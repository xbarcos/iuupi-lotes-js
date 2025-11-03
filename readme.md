# 🎓 IUUPI Lotes JS

**IUUPI Lotes JS** é uma aplicação Node.js que gera **carteirinhas estudantis personalizadas** em PDF a partir de uma planilha `.xlsx`.

O sistema utiliza libs de Node.js para criar cartões com design visual e informações dinâmicas dos usuários.

## 🧰 Libs utilizadas
* Express.js
* Canvas
* QRCode
* PDF-Lib
* XLSX
* Multer

---

## 🚀 Funcionalidades

- 📤 Upload de planilha `.xlsx` com dados dos usuários  
- 🖼️ Geração automática das carteirinhas (com nome, QRCode e identificador)  
- 🧾 Exportação em PDF pronto para impressão  
- ✨ Layout com gradiente, marca d’água e formatação de nomes automática  

---

## ⚙️ Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/xbarcos/iuupi-lotes-js.git
cd iuupi-lotes-js
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor

Modo produção:
```bash
npm start
```
Modo dev (com Nodemon)
```bash
npm start
```
O servidor iniciará na porta 3000

---

## 🖱️ Como utilizar

### 1. Envie a planilha Excel (.xlsx)
* Na interface, arraste e solte o arquivo .xlsx ou clique em Selecionar Arquivo;
* O arquivo deve conter as colunas com os nomes e identificadores dos alunos.

### 2. Clique em "Gerar PDF"
* O sistema processará todos os registros da planilha;
* Cada usuário terá um cartão gerado automaticamente;
* Assim que finalizar, o PDF estará disponível para fazer download.
