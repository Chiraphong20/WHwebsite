const fs = require('fs');
const pdf2img = require('pdf-img-convert');

async function extract() {
    const pdfPath = 'c:/Users/User/Desktop/WH-Website/sale package.pdf';
    const outputDir = 'c:/Users/User/Desktop/WH-Website/public/images/packages';
    
    // Create output dir if not exists
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        console.log('Extracting images from pages 4 to 9...');
        // page_numbers: The page numbers to extract. Usually 1-indexed. We want pages 4, 5, 6, 7, 8, 9.
        const outputImages = await pdf2img.convert(pdfPath, {
             page_numbers: [4, 5, 6, 7, 8, 9],
             base64: false
        });
        
        for (let i = 0; i < outputImages.length; i++) {
            const pageNum = i + 4; // since we extracted 4 to 9
            const imgPath = `${outputDir}/package-page-${pageNum}.png`;
            fs.writeFileSync(imgPath, outputImages[i]);
            console.log(`Saved: ${imgPath}`);
        }
        console.log('Extraction complete!');
    } catch (e) {
        console.error('Error extracting PDF:', e);
    }
}

extract();
