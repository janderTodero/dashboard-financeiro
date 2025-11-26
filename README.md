# PersonalFin

Aplicação fullstack para controle de finanças pessoais, desenvolvida para facilitar o gerenciamento de receitas e despesas de forma simples, segura e intuitiva.
(https://personalfin.vercel.app)

## 🚀 Funcionalidades

- Cadastro, listagem e visualização de transações financeiras (entradas e saídas)
- Importação de Extrato Bancário (CSV) com categorização automática via IA (Google Gemini)
- Autenticação de usuários via JWT
- Dashboard com resumo financeiro e filtros por período (incluindo visão anual)
- Integração com banco de dados MongoDB
- Interface moderna e responsiva
- Segurança dos dados do usuário

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js, JWT para autenticação, MongoDB (Mongoose) para persistência de dados
- **API:** RESTful

## 📦 Instalação

### Pré-requisitos

- Node.js (v16+)
- npm ou yarn
- MongoDB

### Backend

```bash
cd backend
npm install
# Configure as variáveis de ambiente em .env (exemplo disponível em .env.example)
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Configuração

1. Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

    ```
    MONGODB_URI=mongodb://localhost:27017/personalfin
    JWT_SECRET=sua_senha_secreta
    GEMINI_API_KEY=sua_chave_api_gemini
    ```

2. Ajuste as URLs de API no frontend caso necessário (`src/services/api.js`).

## 📊 Como Usar

1. Crie sua conta ou faça login.
2. Cadastre suas entradas e saídas financeiras.
3. Visualize o resumo financeiro em tempo real no dashboard.
4. Utilize os filtros para analisar suas finanças em diferentes períodos.

## 🛡️ Segurança

- Autenticação baseada em JWT
- Validação de dados no backend
- Senhas armazenadas de forma segura

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

> Desenvolvido por Jander Todero (https://github.com/janderTodero)
