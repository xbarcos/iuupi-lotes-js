const fs = require('fs');
const path = require('path');
const upload = require('../middlewares/upload');
const { readExcel } = require('../services/excelService');
const { createStudentCard, saveCardImage } = require('../services/cardService');
const { createPDFGrid } = require('../services/pdfService');

async function uploadAndGenerate(req, res) {
  upload.single('excel')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
      }

      const filePath = req.file.path;

      const users = readExcel(filePath);
      
      if (users.length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: 'Nenhum usuário válido encontrado na planilha' });
      }

      const imagePaths = [];
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const canvas = await createStudentCard(user);
        const imagePath = await saveCardImage(canvas, user.codigo);
        imagePaths.push(imagePath);
      }

      const pdfPath = await createPDFGrid(imagePaths);
      imagePaths.forEach(imgPath => {
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      const downloadUrl = `/output/${path.basename(pdfPath)}`;
      
      res.json({ 
        success: true, 
        downloadUrl: downloadUrl,
        totalCards: users.length,
        fileName: path.basename(pdfPath)
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = { uploadAndGenerate };