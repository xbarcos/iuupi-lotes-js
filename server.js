const express = require('express');
const path = require('path');
const cardController = require('./src/controllers/cardController');
const { createDirectories } = require('./src/config/config');

const app = express();
const PORT = process.env.PORT || 3000;

createDirectories();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/output', express.static('output'));

app.post('/api/upload', cardController.uploadAndGenerate);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📂 Acesse a aplicação no navegador`);
});
