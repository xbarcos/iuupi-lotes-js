const uploadSection = document.getElementById('uploadSection');
const progressSection = document.getElementById('progressSection');
const successSection = document.getElementById('successSection');
const errorSection = document.getElementById('errorSection');

const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileInfo = document.getElementById('fileInfo');
const submitBtn = document.getElementById('submitBtn');

const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');

const downloadBtn = document.getElementById('downloadBtn');
const totalCards = document.getElementById('totalCards');
const newGenerationBtn = document.getElementById('newGenerationBtn');

const errorText = document.getElementById('errorText');
const retryBtn = document.getElementById('retryBtn');

let currentFile = null;

document.addEventListener('DOMContentLoaded', () => {
  showSection('upload');
  setupEventListeners();
});

function setupEventListeners() {
  uploadArea.addEventListener('click', (e) => {
    if (e.target !== fileInput) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', handleFileSelect);

  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);

  uploadForm.addEventListener('submit', handleFormSubmit);

  newGenerationBtn.addEventListener('click', resetForm);
  retryBtn.addEventListener('click', resetForm);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    currentFile = file;
    displayFileInfo(file);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (validTypes.includes(file.type)) {
      currentFile = file;
      fileInput.files = files;
      displayFileInfo(file);
    } else {
      showError('Por favor, envie apenas arquivos Excel (.xlsx ou .xls)');
    }
  }
}

function displayFileInfo(file) {
  const fileSize = formatFileSize(file.size);
  
  fileInfo.innerHTML = `
    <div class="file-name">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      ${file.name}
    </div>
    <div class="file-size">Tamanho: ${fileSize}</div>
  `;
  
  fileInfo.classList.add('show');
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!currentFile) {
    showError('Por favor, selecione um arquivo');
    return;
  }
  
  const formData = new FormData();
  formData.append('excel', currentFile);

  showSection('progress');
  animateProgress();
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      totalCards.textContent = result.totalCards;
      downloadBtn.href = result.downloadUrl;
      downloadBtn.download = result.fileName;
      showSection('success');
    } else {
      showError(result.error || 'Erro ao processar a planilha');
    }
  } catch (error) {
    showError('Erro de conexão. Verifique sua internet e tente novamente.');
  }
}

function animateProgress() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 90) progress = 90;
    
    progressBar.style.width = progress + '%';
    progressPercentage.textContent = Math.round(progress) + '%';
  }, 300);

  window.progressInterval = interval;
}

function showSection(section) {
  uploadSection.classList.remove('active');
  progressSection.classList.remove('active');
  successSection.classList.remove('active');
  errorSection.classList.remove('active');

  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }

  switch(section) {
    case 'upload':
      uploadSection.classList.add('active');
      break;
    case 'progress':
      progressSection.classList.add('active');
      progressBar.style.width = '0%';
      progressPercentage.textContent = '0%';
      break;
    case 'success':
      progressBar.style.width = '100%';
      progressPercentage.textContent = '100%';
      setTimeout(() => {
        successSection.classList.add('active');
      }, 500);
      break;
    case 'error':
      errorSection.classList.add('active');
      break;
  }
}

function showError(message) {
  errorText.textContent = message;
  showSection('error');
}

function resetForm() {
  uploadForm.reset();
  fileInfo.classList.remove('show');
  fileInfo.innerHTML = '';
  currentFile = null;
  showSection('upload');
}

document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
});