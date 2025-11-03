const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { CONFIG } = require('../config/config');
const { generateQRCode } = require('./qrcodeService');

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function formatarNomeUsuario(nomeCompleto) {
  if (!nomeCompleto) return 'Usuário';

  let nomeLimpo = nomeCompleto.replace(/[0-9#]+/g, '').trim();
  nomeLimpo = nomeLimpo
    .split(/\s+/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');

  const partes = nomeLimpo.split(' ');
  if (partes.length === 1) return partes[0];

  const primeiro = partes[0];
  const ultimo = partes[partes.length - 1];
  const meios = partes.slice(1, -1).map(p => p[0].toUpperCase() + '.');

  return [primeiro, ...meios, ultimo].join(' ');
}


async function createStudentCard(userData) {
  const canvas = createCanvas(CONFIG.cardWidth, CONFIG.cardHeight);
  const ctx = canvas.getContext('2d');
  const gradiente = ctx.createLinearGradient(0, 0, 0, CONFIG.cardHeight);
  gradiente.addColorStop(0, 'rgb(36, 78, 122)');
  gradiente.addColorStop(1, 'rgb(16, 36, 66)');

  drawRoundedRect(ctx, 0, 0, CONFIG.cardWidth, CONFIG.cardHeight, 20);
  ctx.fillStyle = gradiente;
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.font = 'bold 140px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('IUUPI', CONFIG.cardWidth / 2, CONFIG.cardHeight / 2);

  try {
    if (fs.existsSync(CONFIG.logoPath)) {
      const logo = await loadImage(CONFIG.logoPath);
      ctx.drawImage(logo, 25, 20, 45, 45);
    }
  } catch (error) {
    throw error.message;
  }

  try {
    const qrCode = await generateQRCode(userData.codigo);
    const qrImage = await loadImage(qrCode);

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(CONFIG.cardWidth - 95, 15, 80, 80);
    ctx.drawImage(qrImage, CONFIG.cardWidth - 90, 20, 70, 70);
  } catch (error) {
    console.error('✗ Erro no QR Code:', error.message);
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgb(255, 255, 255)';

  const nomeFormatado = formatarNomeUsuario(userData.usuario);
  const nomeCompleto = `${nomeFormatado} #${userData.codigo}`;
  const titular = userData.cliente || 'Estabelecimento';

  ctx.font = 'bold 22px Arial';
  ctx.fillText(nomeCompleto, 25, CONFIG.cardHeight - 45);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '15px Arial';
  ctx.fillText(titular, 25, CONFIG.cardHeight - 20);
  return canvas;
}

async function saveCardImage(canvas, codigo) {
  try {
    const filePath = path.join(CONFIG.tempDir, `card_${codigo}_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    console.error('✗ Erro ao salvar:', error);
    throw error;
  }
}

module.exports = { createStudentCard, saveCardImage };
