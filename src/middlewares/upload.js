const multer = require('multer');
const path = require('path');
const { CONFIG } = require('../config/config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CONFIG.uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.xlsx' && ext !== '.xls') {
    return cb(new Error('Apenas arquivos Excel são permitidos!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;