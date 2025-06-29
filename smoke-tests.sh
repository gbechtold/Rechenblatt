#!/bin/bash

# Smoke Tests for Rechenblatt App
echo "🔍 Running Smoke Tests for Rechenblatt..."
echo "=========================================="

BASE_URL="http://66.241.125.224"
HOST_HEADER="rechenblatt.fly.dev"
ERRORS=0

# Function to test endpoint
test_endpoint() {
    local path=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing $description ($path)... "
    status=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: $HOST_HEADER" "$BASE_URL$path")
    
    if [ "$status" == "$expected_status" ]; then
        echo "✅ PASS (HTTP $status)"
    else
        echo "❌ FAIL (Expected $expected_status, got $status)"
        ((ERRORS++))
    fi
}

# Function to test content
test_content() {
    local path=$1
    local search_string=$2
    local description=$3
    
    echo -n "Testing content: $description... "
    content=$(curl -s -L -H "Host: $HOST_HEADER" "$BASE_URL$path")
    
    if echo "$content" | grep -q "$search_string"; then
        echo "✅ PASS"
    else
        echo "❌ FAIL (String not found: $search_string)"
        ((ERRORS++))
    fi
}

# Test 1: Basic connectivity
echo "1. BASIC CONNECTIVITY TESTS"
echo "---------------------------"
test_endpoint "/" "301" "Root redirect"
test_endpoint "/en" "200" "English homepage"
test_endpoint "/de" "200" "German homepage"
test_endpoint "/en/create" "200" "Create page (EN)"
test_endpoint "/en/play" "200" "Play page (EN)"

echo ""
echo "2. CONTENT VERIFICATION TESTS"
echo "-----------------------------"
test_content "/en" "Rechenblatt" "App title present"
test_content "/en" "Create" "Navigation links"
test_content "/en" "Space Adventure" "Theme content"
test_content "/de" "Erstellen" "German translation"

echo ""
echo "3. STATIC ASSETS TESTS"
echo "----------------------"
# Check if Next.js static files are served
echo -n "Testing Next.js static assets... "
chunk_test=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: $HOST_HEADER" "$BASE_URL/_next/static/chunks/main.js")
if [[ "$chunk_test" == "200" ]] || [[ "$chunk_test" == "304" ]]; then
    echo "✅ PASS"
else
    echo "❌ FAIL (HTTP $chunk_test)"
    ((ERRORS++))
fi

echo ""
echo "4. ERROR HANDLING TESTS"
echo "-----------------------"
test_endpoint "/nonexistent" "404" "404 error page"
test_endpoint "/api/nonexistent" "404" "API 404"

echo ""
echo "5. LOCALIZATION TESTS"
echo "---------------------"
# Test language switching
echo -n "Testing locale files... "
locale_test=$(curl -s -H "Host: $HOST_HEADER" "$BASE_URL/locales/en/common.json" | grep -c "Rechenblatt")
if [ "$locale_test" -gt 0 ]; then
    echo "✅ PASS"
else
    echo "❌ FAIL (Locale files not accessible)"
    ((ERRORS++))
fi

echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ ALL TESTS PASSED!"
else
    echo "❌ $ERRORS TESTS FAILED"
    echo ""
    echo "Debugging suggestions:"
    echo "1. Check logs: fly logs"
    echo "2. SSH into machine: fly ssh console"
    echo "3. Check build output: fly deploy --verbose"
fi

exit $ERRORS