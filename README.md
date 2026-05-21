# ISP Fidelidade - Controle de Indicações e Recompensas

Este projeto é um sistema web para gerenciamento e controle de indicações de clientes e distribuição de recompensas para um Provedor de Internet (ISP).

A aplicação é dividida em:
*   **Frontend**: Desenvolvido em React + Vite + TailwindCSS.
*   **Backend**: API REST desenvolvida em Node.js + Express + Prisma ORM.
*   **Banco de Dados**: PostgreSQL.

---

## 🐳 Executando em Produção (Docker Compose + Watchtower)

A aplicação está configurada para deploy simplificado. As imagens do frontend e do backend são construídas automaticamente pelo GitHub Actions e enviadas para o **GitHub Container Registry (GHCR)**.

Na sua VPS, você só precisa do arquivo `docker-compose.yml`. O **Watchtower** monitorará o registro de imagens e atualizará a aplicação automaticamente a cada 5 minutos sempre que um novo `push` for feito na branch `main`.

### Passo a Passo

1.  **Iniciar a aplicação**:
    No diretório do projeto na VPS, execute:
    ```bash
    docker compose up -d
    ```
    A aplicação estará disponível em [http://localhost:8080](http://localhost:8080).

2.  **Popular o Banco de Dados (Seed Inicial)**:
    ```bash
    curl -X POST http://localhost:8080/api/reset
    ```

3.  **Registro de Containers Privado (Opcional)**:
    Se o seu repositório de imagens no GHCR for privado, autentique o Docker da VPS uma única vez usando seu Personal Access Token (PAT) do GitHub:
    ```bash
    docker login ghcr.io -u SEU_USUARIO_GITHUB
    ```
    E certifique-se de expor as credenciais para o Watchtower no `docker-compose.yml` descomentando a linha:
    ```yaml
    - ~/.docker/config.json:/config.json:ro
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
    # Configure o arquivo .env se necessário (padrão já configurado no código)
    npx prisma db push
    npm run dev
    ```

3.  **Iniciar o Frontend**:
    No diretório raiz:
    ```bash
    npm install
    npm run dev
    ```
