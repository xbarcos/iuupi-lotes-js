const XLSX = require('xlsx');

function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  return data.map(row => ({
    codigo: row['Código']?.toString() || '',
    usuario: row['Usuário'] || '',
    cliente: row['Cliente'] || '',
    situacao: row['Situação'] || ''
  })).filter(user => user.codigo && user.usuario);
}

module.exports = { readExcel };