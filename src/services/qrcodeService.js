const QRCode = require('qrcode');

async function generateQRCode(code) {
  const qrString = `$${code}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrString, {
      width: 150,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw error;
  }
}

module.exports = { generateQRCode };