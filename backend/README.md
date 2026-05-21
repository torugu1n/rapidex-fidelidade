# Estrutura do Backend - ISP Fidelidade

Este diretório contém a API REST do sistema de controle de indicações e recompensas para produção, utilizando **Node.js + Express, PostgreSQL e Prisma ORM**.

---

## 🛠️ Tecnologias Utilizadas
* **Servidor**: Node.js v18+ com Express
* **Banco de Dados**: PostgreSQL 15
* **ORM**: Prisma Client e Migrations
* **Containerização**: Docker e Docker Compose

---

## 🚀 Como Executar em Desenvolvimento

### 1. Requisitos
Certifique-se de possuir instalado:
- [Node.js](https://nodejs.org/) (v16 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` neste diretório baseando-se nas configurações padrão:
```env
DATABASE_URL="postgresql://fidelidade_user:fidelidade_password_secure_123@localhost:5432/fidelidade_isp_db?schema=public"
PORT=3001
```

### 3. Iniciar o Banco de Dados (PostgreSQL via Docker)
Suba o banco de dados PostgreSQL usando o compose:
```bash
docker-compose up -d postgres
```

### 4. Executar Migrações do Banco de Dados
Com o banco ativo, execute as migrations do Prisma para gerar as tabelas relacionais no PostgreSQL:
```bash
npm install
npx prisma migrate dev --name init
```

### 5. Iniciar o Servidor API
Execute a API em modo de desenvolvimento (com nodemon para reiniciar automaticamente):
```bash
npm run dev
```
O servidor estará ativo em `http://localhost:3001`.

### 6. Povoar o Banco de Dados (Seed Inicial)
Para carregar os clientes e indicações padrão de demonstração no banco PostgreSQL real, faça uma requisição POST para o endpoint de reset:
```bash
curl -X POST http://localhost:3001/api/reset
```

---

## 🌐 Integração com o Frontend

No frontend, abra o arquivo `src/services/api.js` e altere a flag de conexão:
```javascript
const USE_REAL_BACKEND = true; // Altere de false para true
```
A partir desse momento, a interface do React passará a consumir os dados reais gravados no PostgreSQL do backend em vez do LocalStorage.

---

## 🐳 Deploy em Produção (VPS Linux + Docker)

Para realizar o deploy completo em sua VPS Linux:

1. Faça o clone do repositório na VPS.
2. Certifique-se de expor as portas adequadas e mude a senha no `docker-compose.yml`.
3. Inicie os containers em segundo plano:
   ```bash
   docker-compose up -d --build
   ```
4. Configure o **Nginx** na VPS como proxy reverso para encaminhar as requisições para a API e servir o frontend compilado. Exemplo de configuração de bloco do servidor Nginx (`/etc/nginx/sites-available/fidelidade`):

```nginx
server {
    listen 80;
    server_name fidelidade.isp.com.br;

    # Frontend estático compilado (npm run build)
    location / {
        root /var/www/fidelidade/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Encaminhar requisições da API para o backend Node
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
