import { GetStaticProps } from 'next';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ThemeSelector } from '@/components/ThemeSelector';
import { OperationSelector } from '@/components/OperationSelector';
import { MathProblem } from '@/components/MathProblem';
import { ProblemFilters } from '@/components/ProblemFilters';
import { Problem, Operation, Theme } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Library() {
  const { t } = useTranslation('common');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('space');
  
  // Sample problem for demonstration
  const sampleProblem: Problem = {
    id: '1',
    operand1: 8,
    operand2: 5,
    operation: 'addition',
    answer: 13,
  };

  const sampleProblemWithPlaceholder: Problem = {
    id: '2',
    operand1: 7,
    operand2: 3,
    operation: 'multiplication',
    answer: 21,
    placeholder: 'answer',
  };

  const themes: Theme[] = ['space', 'dino', 'castle', 'ocean', 'circus'];
  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Component Library</h1>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          This page showcases all UI components used in Rechenblatt. Use this as a reference for maintaining design consistency across the application.
        </p>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Typography</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-4">
            <h1 className="text-4xl font-bold">Heading 1 - Page Title</h1>
            <h2 className="text-3xl font-bold">Heading 2 - Section Title</h2>
            <h3 className="text-2xl font-semibold">Heading 3 - Subsection</h3>
            <h4 className="text-xl font-semibold">Heading 4 - Component Title</h4>
            <p className="text-base">Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="text-sm text-gray-600">Small text - Used for descriptions and hints</p>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Color Palette</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="w-full h-24 bg-blue-600 rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Primary Blue</p>
                <p className="text-xs text-gray-600">bg-blue-600</p>
              </div>
              <div>
                <div className="w-full h-24 bg-green-600 rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Success Green</p>
                <p className="text-xs text-gray-600">bg-green-600</p>
              </div>
              <div>
                <div className="w-full h-24 bg-red-600 rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Error Red</p>
                <p className="text-xs text-gray-600">bg-red-600</p>
              </div>
              <div>
                <div className="w-full h-24 bg-gray-600 rounded-lg mb-2"></div>
                <p className="text-sm font-medium">Neutral Gray</p>
                <p className="text-xs text-gray-600">bg-gray-600</p>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Buttons</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Primary Button
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                Success Button
              </button>
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                Danger Button
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                Secondary Button
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition text-sm">
                Small Button
              </button>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg">
                Large Button
              </button>
            </div>
          </div>
        </section>

        {/* Form Elements Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Form Elements</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full max-w-sm p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Number Input</label>
              <input
                type="number"
                placeholder="0"
                className="w-full max-w-sm p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Dropdown</label>
              <select className="w-full max-w-sm p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Checkbox option</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="radio" className="w-4 h-4" />
                <span className="text-sm">Radio option 1</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="radio" className="w-4 h-4" />
                <span className="text-sm">Radio option 2</span>
              </label>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Cards & Containers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Basic Card</h3>
              <p className="text-gray-600">This is a basic card with shadow-lg</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-2">Interactive Card</h3>
              <p className="text-gray-600">Hover to see the scale effect</p>
            </motion.div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-semibold mb-2">Gradient Card</h3>
              <p className="text-gray-700">Card with gradient background</p>
            </div>
          </div>
        </section>

        {/* Theme Selector Component */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Theme Selector Component</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <ThemeSelector
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
            />
          </div>
        </section>

        {/* Operation Selector Component */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Operation Selector Component</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <OperationSelector
              selectedOperations={['addition', 'multiplication']}
              multiplicationTables={[3, 5, 7]}
              onOperationsChange={() => {}}
              onMultiplicationTablesChange={() => {}}
            />
          </div>
        </section>

        {/* Math Problem Component */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Math Problem Component</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Regular Problem</h4>
                <MathProblem
                  problem={sampleProblem}
                  showSolution={false}
                  isInteractive={false}
                  theme="space"
                  index={1}
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Problem with Placeholder</h4>
                <MathProblem
                  problem={sampleProblemWithPlaceholder}
                  showSolution={false}
                  isInteractive={false}
                  theme="dino"
                  index={2}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Filters Component */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Problem Filters Component</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <ProblemFilters
              suppressTrivial={false}
              avoidDuplicates={true}
              onSuppressTrivialChange={() => {}}
              onAvoidDuplicatesChange={() => {}}
            />
          </div>
        </section>

        {/* Spacing & Layout */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Spacing Guidelines</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Standard Spacing Classes</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-32 text-sm font-mono">space-y-2</div>
                    <div className="flex-1 bg-gray-100 p-2">8px vertical spacing</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm font-mono">space-y-4</div>
                    <div className="flex-1 bg-gray-100 p-4">16px vertical spacing</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm font-mono">space-y-6</div>
                    <div className="flex-1 bg-gray-100 p-6">24px vertical spacing</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm font-mono">space-y-8</div>
                    <div className="flex-1 bg-gray-100 p-8">32px vertical spacing</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Container Widths</h4>
                <div className="space-y-2">
                  <div className="max-w-sm bg-gray-100 p-4">max-w-sm (24rem)</div>
                  <div className="max-w-md bg-gray-100 p-4">max-w-md (28rem)</div>
                  <div className="max-w-lg bg-gray-100 p-4">max-w-lg (32rem)</div>
                  <div className="max-w-xl bg-gray-100 p-4">max-w-xl (36rem)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Animations</h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-blue-50 rounded-lg text-center"
              >
                <h4 className="font-semibold mb-2">Fade In</h4>
                <p className="text-sm text-gray-600">opacity: 0 → 1</p>
              </motion.div>
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-green-50 rounded-lg text-center"
              >
                <h4 className="font-semibold mb-2">Slide In</h4>
                <p className="text-sm text-gray-600">x: -20 → 0</p>
              </motion.div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-purple-50 rounded-lg text-center"
              >
                <h4 className="font-semibold mb-2">Scale Up</h4>
                <p className="text-sm text-gray-600">scale: 0.8 → 1</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};