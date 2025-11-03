const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { CONFIG } = require('../config/config');

async function createPDFGrid(imagePaths) {
  const pdfDoc = await PDFDocument.create();
  
  const pageWidth = 595;
  const pageHeight = 842;
  
  const cardWidth = (pageWidth - CONFIG.margin * 2 - CONFIG.cardSpacing) / CONFIG.cardsPerRow;
  const cardHeight = (pageHeight - CONFIG.margin * 2 - CONFIG.cardSpacing * (CONFIG.cardsPerColumn - 1)) / CONFIG.cardsPerColumn;
  
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let cardCount = 0;
  
  for (const imagePath of imagePaths) {
    if (!fs.existsSync(imagePath)) {
      continue;
    }

    if (cardCount > 0 && cardCount % (CONFIG.cardsPerRow * CONFIG.cardsPerColumn) === 0) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    }
    
    try {
      const imageBytes = fs.readFileSync(imagePath);

      let image;
      try {
        image = await pdfDoc.embedPng(imageBytes);
      } catch (pngError) {
        image = await pdfDoc.embedJpg(imageBytes);
      }
      
      const row = Math.floor((cardCount % (CONFIG.cardsPerRow * CONFIG.cardsPerColumn)) / CONFIG.cardsPerRow);
      const col = cardCount % CONFIG.cardsPerRow;
      
      const x = CONFIG.margin + col * (cardWidth + CONFIG.cardSpacing);
      const y = pageHeight - CONFIG.margin - (row + 1) * cardHeight - row * CONFIG.cardSpacing;
      
      currentPage.drawImage(image, {
        x: x,
        y: y,
        width: cardWidth,
        height: cardHeight
      });      
    } catch (error) {
      throw error;
    }
    
    cardCount++;
  }
  
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(CONFIG.outputDir, `carteirinhas_${Date.now()}.pdf`);
  fs.writeFileSync(outputPath, pdfBytes);  
  return outputPath;
}

module.exports = { createPDFGrid };