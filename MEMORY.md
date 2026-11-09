# MEMORY — Relivro
Marketplace de troca de livros (Projeto Integrador, UNIVAG).

## Stack
- `backend/`: Node.js + Express 5 (`server.js`) · Mercado Pago
- `frontend/`: HTML/CSS/JS estático (`index.html`, `templates/`, `assets/`)

## Comandos
- `cd backend` · `npm install` · `npm start`
- Frontend: abrir `frontend/index.html` ou servir a pasta estaticamente.

## Variáveis de ambiente
- MERCADOPAGO_ACCESS_TOKEN, PORT

## Regras de ouro
1. Pagamentos só pelo backend; o token do Mercado Pago nunca vai ao frontend.
2. Frontend sem build: páginas em `templates/`, estáticos em `assets/`.
3. `.env` fora do Git; manter `.env.example` atualizado com os nomes.
