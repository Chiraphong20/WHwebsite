const fs = require('fs');
const { exportImages } = require('pdf-export-images');
const pdf = require('pdf-parse');

async function extract() {
    const pdfPath = 'c:/Users/User/Desktop/WH-Website/sale package.pdf';
    const outputDir = 'c:/Users/User/Desktop/WH-Website/temp_pdf/sale_package_images';
    
    // Create output dir if not exists
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        console.log('Extracting text...');
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        fs.writeFileSync('c:/Users/User/Desktop/WH-Website/temp_pdf/sale_package_text.txt', data.text);
        console.log('Text extracted to temp_pdf/sale_package_text.txt');
        
        console.log('Extracting images...');
        const images = await exportImages(pdfPath, outputDir);
        console.log(`Extracted ${images.length} images to ${outputDir}`);
    } catch (e) {
        console.error('Error extracting PDF:', e);
    }
}

extract();
