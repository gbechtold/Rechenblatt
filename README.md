# Rechenblatt

Ein Programm zur Erstellung von Rechenblättern für die Grund- und Hauptschule.

## User Requirements Feature List

Based on the analysis of the existing desktop application, the following features should be implemented:

### Core Functionality
- **Math Worksheet Generation**: Automatically generate worksheets with math problems for elementary and middle school students
- **Basic Arithmetic Operations**: Support for addition (+), subtraction (-), multiplication (*), and division (:)
- **WYSIWYG Preview**: Real-time preview of the worksheet exactly as it will be printed
- **Print Functionality**: Direct printing of generated worksheets
- **Clipboard Export**: Copy worksheets as vector graphics to clipboard for use in other applications (e.g., Microsoft Word)
- **Save/Load Worksheets**: Save worksheets in .rbl format and reload them later

### Problem Configuration
- **Number Range Selection**: Configurable number ranges for problems (ones, tens, hundreds, etc.)
- **Operation Types**:
  - Addition/Subtraction with configurable operand combinations (E, Z, ZE, H, HE, HZ, HZE)
  - Multiplication tables (Einmaleins)
  - Written multiplication with large factors
  - Division problems
- **Carry-over Control**: Options for "Zehnerübergang" (tens carry-over) and "Hunderterübergang" (hundreds carry-over)
- **Placeholder Problems**: Support for problems with missing operands (e.g., _ + 3 = 7)
- **Trivial Problem Suppression**: Option to exclude overly simple problems
- **Commutative Problems**: Option to include or exclude commutative variations (Tauschaufgaben)

### Layout Options
- **Zoom Control**: Adjustable zoom level for screen preview (doesn't affect print output)
- **Page Margins**: Configurable page margins
- **Font Selection**: Choice of fonts for problems
- **Problem Numbering**: Optional numbering of problems
- **Headers**: Customizable worksheet headers/titles
- **Solutions Display**: Option to show/hide solutions
- **Problem Count**: Configurable number of problems per worksheet
- **Problem Size**: Adjustable size of problem placeholders
- **Layout Templates**: Multiple layout options for problem arrangement

### User Interface
- **Main Window**: Central workspace showing WYSIWYG preview
- **Action Bar**: Quick access to key functions (zoom, new problems, print, save, open, copy to clipboard)
- **Problem Type Dialog**: Comprehensive dialog for selecting problem parameters
- **Layout Options Panel**: Easy access to all layout configuration options

### Technical Requirements
- **No Installation Required**: Portable application that runs without installation
- **No System Modifications**: Application should not modify system registry or files
- **File Association**: Register .rbl file extension for double-click opening
- **Platform**: Desktop application (based on benchmark being Windows desktop app)

### Workflow Support
1. Select problem type and parameters
2. Configure layout and appearance
3. Preview worksheet in real-time
4. Print directly or export to clipboard
5. Save for later use if needed

This feature list represents the complete functionality needed to recreate a modern version of the Rechenblatt application for generating customizable math worksheets.