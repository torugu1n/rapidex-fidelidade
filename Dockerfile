# Stage 1: Build the React application
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the Express application (Backend + Frontend)
FROM node:20-alpine
WORKDIR /usr/src/app

# Instalar dependências de sistema necessárias para o Prisma no Alpine
RUN apk add --no-cache openssl libc6-compat

# Copiar arquivos de dependências do backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install

# Copiar código do backend
COPY backend/ .

# Copiar arquivos estáticos compilados do frontend para dentro da pasta do backend
COPY --from=frontend-builder /app/dist ./dist

# Gerar o Prisma Client
RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && npm start"]
