# 🚀 Quick Start Guide

Get ReservaFácil running in 5 minutes!

## Prerequisites

✅ Node.js 18+ installed  
✅ PostgreSQL 14+ installed and running

## Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update these REQUIRED variables:
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/reservafacil"
JWT_SECRET="your-super-secret-key-min-32-characters-long"
```

### 3. Set Up Database

```bash
# Create database tables
npm run db:push

# Verify database is ready
npm run db:studio
# This opens a web interface at http://localhost:5555
```

### 4. Start Backend Server

```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

### 5. Install Frontend Dependencies

**Open a NEW terminal window:**

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### 7. Create Your First Account

1. Open browser to `http://localhost:5173`
2. Click **"Regístrate gratis"**
3. Fill in the form:
   - Business Name: Your business name
   - Email: your@email.com
   - Password: Test123! (or stronger)
4. Click **"Crear Cuenta"**

You're in! 🎉

---

## Troubleshooting

### Backend won't start?

**Problem:** `Error: connect ECONNREFUSED`  
**Solution:** PostgreSQL is not running. Start it:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL from Services
```

**Problem:** `DATABASE_URL is not defined`  
**Solution:** Make sure you created `.env` file in backend folder

### Frontend won't start?

**Problem:** `Cannot find module`  
**Solution:** Run `npm install` in the frontend folder

**Problem:** Can't reach backend  
**Solution:** Make sure backend is running on port 5000

### Database issues?

**Problem:** `Database does not exist`  
**Solution:** Create the database:
```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE reservafacil;

# Exit
\q

# Then run migrations
npm run db:push
```

---

## Next Steps

✅ You're now ready to start building!

Check `README.md` for full documentation  
Check `PROJECT_STATUS.md` for development progress

**Happy coding! 🚀**
