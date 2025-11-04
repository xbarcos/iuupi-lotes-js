# Usar Node.js 18 com suporte a canvas
FROM node:18-bullseye

# Instalar dependências necessárias para o canvas e fontes
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    fonts-liberation \
    fonts-dejavu-core \
    fontconfig \
    && fc-cache -f -v \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Criar diretórios necessários
RUN mkdir -p uploads temp output

# Expor porta
EXPOSE 3000

# Variável de ambiente para porta
ENV PORT=3000

# Comando para iniciar
CMD ["node", "server.js"]