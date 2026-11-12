# 📚 Relivro: Digital Book Exchange & Marketplace Platform

**Relivro** is an academic full-stack web application developed to facilitate literature trade, exchange, and circular economy among readers.

[![Category](https://img.shields.io/badge/CATEGORY-ACADEMIC%20PROJECT-e0004d?style=for-the-badge)](#) [![UNIVAG](https://img.shields.io/badge/UNIVAG-PROJETO%20INTEGRADOR%20EXTENSIONISTA-00c8ff?style=for-the-badge)](#) [![License](https://img.shields.io/badge/LICENSE-MIT-76b900?style=for-the-badge)](#)

---

## 📌 Project Overview

**Relivro** was developed as an academic project during the *Projeto Integrador Extensionista* for the Bachelor's degree in Software Engineering at **UNIVAG**.

The platform provides a digital solution for local communities to exchange, buy, and sell physical books. By creating an accessible online environment, the system fosters reading habits and sustainable consumption through literature reuse.

---

## ⚡ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Integrations:** Mercado Pago SDK (Checkout API)
- **State Management:** SessionStorage & LocalStorage

---

## 🚀 Key Features

* **Authentication & Access Control:** User registration, credential validation, and protected client-side routes.
* **Interactive Shopping Cart:** Real-time item calculation, price totals, and cart management.
* **Favorites System:** Persistent bookmarking for desired titles using local storage.
* **Payment API Integration:** Dynamic payment preference generation via Mercado Pago SDK.

---

## 📦 Deliverables

| What | Where to see it |
|---|---|
| Static storefront (listings, templates, assets) | `frontend/index.html`, open directly or serve the folder |
| API with Mercado Pago payment flow | `backend/`, `npm start` |

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Paulorgdc/relivro.git
   cd relivro
   ```

2. Install backend dependencies:
   ```powershell
   cd backend
   npm ci
   Copy-Item ../.env.example .env.local
   ```
3. Fill `backend/.env.local` locally. `dotenv.config({ path: ".env.local" })` uses the process working
   directory, so start the API from `backend` with `npm start`.
4. Serve the static `frontend` directory or open its HTML entry point.
   There is no frontend dependency installation or build step.

The template lives at the repository root; the runtime file lives in `backend`.
Never place the Mercado Pago access token in frontend files.
