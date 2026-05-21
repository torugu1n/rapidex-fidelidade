# Imagem base
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Copiar restante do código
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Expor porta da API
EXPOSE 3001

# Comando para rodar a aplicação
CMD [ "npm", "start" ]
