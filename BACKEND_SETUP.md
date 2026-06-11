# MyUniPath – Backend Setup Guide

## Overview

- **Backend**: Standalone PHP API in `backend/api/` (no Laravel required)
- **Frontend**: React (Vite) in project root
- **Database**: MySQL (managed via phpMyAdmin)

---

## 1. Install MySQL and phpMyAdmin

### Option A: XAMPP (Windows)

1. Download XAMPP: https://www.apachefriends.org/
2. Install and open XAMPP Control Panel
3. Start **Apache** and **MySQL**
4. phpMyAdmin is at: http://localhost/phpmyadmin

### Option B: Laragon (Windows)

1. Download Laragon: https://laragon.org/
2. Install and start Laragon
3. MySQL and phpMyAdmin are included
4. phpMyAdmin: http://localhost/phpmyadmin

### Option C: WAMP / MAMP

Similar to XAMPP – install and start MySQL, then access phpMyAdmin from the control panel.

---

## 2. Create Database

1. Open phpMyAdmin (e.g. http://localhost/phpmyadmin)
2. Click **New** to create a database
3. Name it: `myunipath`
4. Collation: `utf8mb4_unicode_ci`
5. Click **Create**

---

## 3. Configure Backend

The database is already created and seeded. To change settings, edit `backend/.env`:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myunipath
DB_USERNAME=root
DB_PASSWORD=

ADMIN_PASSWORD=admin123
```

## 4. Start the API

Double-click `backend/start-api.bat` or run:

```bash
cd backend
php -S localhost:8000 api\router.php
```

API: http://localhost:8000/api

---

## 5. Configure React Frontend

1. In the project root, copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Ensure `.env` has:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```
   App: http://localhost:3000

---

## 6. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/programs | List all programs |
| GET | /api/programs/{slug} | Get program by slug |
| GET | /api/quiz/questions | Get quiz questions |
| POST | /api/quiz/submit | Submit quiz completion |
| POST | /api/students | Create student profile |
| POST | /api/analytics/login | Admin login |
| GET | /api/analytics/dashboard | Analytics (requires auth) |

---

## 7. Admin Dashboard

- Go to: http://localhost:3000/analytics
- Default password: `admin123`
- Change it in `backend/.env`: `ADMIN_PASSWORD=your_password`

---

## 8. Troubleshooting

**"SQLSTATE HY000] [2002] Connection refused"**  
- MySQL is not running (start it in XAMPP/Laragon)

**"SQLSTATE[HY000] [1049] Unknown database 'myunipath'"**  
- Create the `myunipath` database in phpMyAdmin

**CORS errors in browser**  
- Backend should run on port 8000, frontend on 3000  
- Laravel CORS allows `*` by default for API routes
