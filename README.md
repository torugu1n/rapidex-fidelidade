# ISP Fidelidade - Controle de Indicações e Recompensas

Este projeto é um sistema web para gerenciamento e controle de indicações de clientes e distribuição de recompensas para um Provedor de Internet (ISP).

A aplicação é unificada: o servidor backend (Node + Express) serve tanto as APIs quanto os arquivos estáticos compilados do frontend (React).

---

## 🐳 Executando em Produção (Docker Compose)

A aplicação está configurada para deploy simplificado com um único container de aplicação (`fidelidade_app`) e um container de banco de dados (`fidelidade_db`). A imagem unificada do aplicativo é construída automaticamente pelo GitHub Actions e enviada para o **GitHub Container Registry (GHCR)**.

### Passo a Passo

1.  **Iniciar a aplicação**:
    No diretório do projeto na VPS, execute:
    ```bash
    docker compose up -d
    ```
    A aplicação estará disponível na porta 8080 em [http://localhost:8080](http://localhost:8080).

2.  **Popular o Banco de Dados (Seed Inicial)**:
    ```bash
    curl -X POST http://localhost:8080/api/reset
    ```

3.  **Registro de Containers Privado (Opcional)**:
    Se o seu repositório de imagens no GHCR for privado, autentique o Docker da VPS uma única vez usando seu Personal Access Token (PAT) do GitHub:
    ```bash
    docker login ghcr.io -u SEU_USUARIO_GITHUB
    ```

---

## 🛠️ Desenvolvimento Local (Sem Docker / Apenas Banco)

Para rodar localmente e realizar alterações no código em tempo real:

1.  **Iniciar o Banco de Dados**:
    ```bash
    docker compose up -d db
    ```

2.  **Iniciar o Backend**:
    No diretório `./backend`:
    ```bash
    npm install
    npx prisma db push
    npm run dev
    ```

3.  **Iniciar o Frontend**:
    No diretório raiz:
    ```bash
    npm install
    npm run dev
    ```
