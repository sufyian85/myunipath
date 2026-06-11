# MyUniPath – ICT Program Recommendation System

A web-based career recommendation quiz for SPM leavers exploring ICT programs at UNITEN (Universiti Tenaga Nasional). Built with **React** (frontend) and **Laravel + MySQL** (backend).

## Quick Start

### 1. Install MySQL & phpMyAdmin

Use **XAMPP** or **Laragon** – start MySQL, then create database `myunipath` in phpMyAdmin.

### 2. Backend (Standalone PHP API)

Double-click `backend/start-api.bat` or run:

```bash
cd backend
php -S localhost:8000 api\router.php
```

API runs at: http://localhost:8000/api

### 3. Frontend (React)

```bash
npm install
npm run dev
```

App runs at: http://localhost:3000

---

## Full Setup

See **[BACKEND_SETUP.md](BACKEND_SETUP.md)** for detailed MySQL/phpMyAdmin setup and configuration.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Standalone PHP API |
| Database | MySQL (phpMyAdmin for admin) |
