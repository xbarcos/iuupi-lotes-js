const fs = require('fs');
const path = require('path');

const CONFIG = {
  cardWidth: 390,
  cardHeight: 240,
  cardsPerRow: 2,
  cardsPerColumn: 4,
  margin: 20,
  cardSpacing: 15,
  outputDir: path.join(__dirname, '../../output'),
  tempDir: path.join(__dirname, '../../temp'),
  uploadDir: path.join(__dirname, '../../uploads'),
  logoPath: path.join(__dirname, '../../public/images/logo.svg')
};

function createDirectories() {
  [CONFIG.outputDir, CONFIG.tempDir, CONFIG.uploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

module.exports = { CONFIG, createDirectories };