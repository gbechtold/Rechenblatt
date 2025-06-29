import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportOptions {
  pageFormat: 'A4' | 'Letter';
  filename?: string;
}

export async function exportToPDF(element: HTMLElement, options: ExportOptions) {
  try {
    // Add PDF export class for better styling
    element.classList.add('pdf-export');
    
    // Set dimensions based on page format
    const dimensions = options.pageFormat === 'A4' 
      ? { width: 210, height: 297 } // A4 in mm
      : { width: 215.9, height: 279.4 }; // Letter in mm

    // Create canvas from HTML element with optimized settings
    const canvas = await html2canvas(element, {
      scale: 1.5, // Balanced quality vs performance
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure print styles are applied
        const clonedElement = clonedDoc.querySelector('.worksheet-page');
        if (clonedElement) {
          // Remove absolute positioned elements
          clonedElement.querySelectorAll('[class*="absolute"]').forEach(el => {
            (el as HTMLElement).style.display = 'none';
          });
        }
      }
    });

    // Calculate dimensions for PDF
    const imgWidth = dimensions.width;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > dimensions.height ? 'portrait' : 'portrait',
      unit: 'mm',
      format: options.pageFormat.toLowerCase() as 'a4' | 'letter'
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    let y = 0;
    
    // Handle multi-page documents
    while (y < imgHeight) {
      if (y > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(
        imgData,
        'PNG',
        0,
        y === 0 ? 0 : -y,
        imgWidth,
        imgHeight
      );
      
      y += dimensions.height;
    }

    // Save the PDF
    const filename = options.filename || `worksheet_${new Date().getTime()}.pdf`;
    pdf.save(filename);
    
    // Remove PDF export class
    element.classList.remove('pdf-export');
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting PDF:', error);
    // Ensure cleanup on error
    element.classList.remove('pdf-export');
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}