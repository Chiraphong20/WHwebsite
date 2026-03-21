const fs = require('fs');
const { exportImages } = require('pdf-export-images');

async function extract() {
    const pdfPath = 'c:/Users/User/Desktop/WH-Website/BNI5min WH69.pdf';
    
    try {
        const images = await exportImages(pdfPath, 'c:/Users/User/Desktop/WH-Website/temp_pdf/images');
        console.log(`Extracted images to images/`);
    } catch (e) {
        console.log('Error extracting images:', e);
    }
}
extract();
