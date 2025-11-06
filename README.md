# ReservaFácil - Booking Management SaaS

**Version:** 1.0.0 (MVP)  
**Status:** Phase 1 - Foundation (In Progress)

A simple, affordable booking and appointment management SaaS for small service businesses in Barcelona and Spain.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Features Status](#features-status)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

---

## 🎯 Overview

ReservaFácil helps small service businesses modernize their booking process, reduce no-shows, and increase revenue through a beautiful, easy-to-use appointment management system.

**Target Market:**
- Hair salons & barbershops
- Massage therapists & wellness centers
- Craft workshops & art classes
- Repair services
- Personal trainers & fitness instructors
- Tattoo & piercing studios
- Photography studios

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS 3.x
- **State Management:** React Context API + React Query
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Icons:** Heroicons
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 14+
- **ORM:** Prisma
- **Authentication:** JWT
- **Validation:** Joi
- **Email:** Nodemailer (SendGrid/Resend)
- **Payment:** Stripe SDK
- **Logging:** Winston

---

## 📁 Project Structure

```
reservafacil/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # CSS files
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   └── package.json
│
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Custom middleware
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utility functions
│   │   └── server.js         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── logs/                 # Application logs
│   └── package.json
│
├── PROJECT_STATUS.md         # Development progress tracker
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (comes with Node.js)

### Installation

#### 1. Clone or Download the Project

If you received this as files, extract them. Otherwise:
```bash
git clone <repository-url>
cd reservafacil
```

#### 2. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# REQUIRED: Update DATABASE_URL, JWT_SECRET, and other keys
```

**Important .env Variables:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/reservafacil?schema=public"
JWT_SECRET=your-super-secret-key-change-this
FRONTEND_URL=http://localhost:5173
```

#### 3. Set Up Database

```bash
# Run Prisma migrations to create database tables
npm run db:push

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

#### 4. Set Up Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install
```

---

## 💻 Development

### Running the Application

You need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Access the Application

1. Open your browser to `http://localhost:5173`
2. Click **"Regístrate gratis"** to create an account
3. Fill in your business information
4. You'll be logged in and redirected to the dashboard

### Testing the API

You can test API endpoints using:
- **Postman** ([Download](https://www.postman.com/downloads/))
- **Thunder Client** (VS Code extension)
- **curl** commands

Example:
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "businessName": "Test Business",
    "businessCategory": "Peluquería y Barbería"
  }'
```

---

## ✅ Features Status

### Phase 1: Foundation ✅ (Current)

#### Completed
- [x] Project structure
- [x] Database schema with Prisma
- [x] Authentication system (Register, Login, Logout)
- [x] JWT token-based auth
- [x] Email verification (backend ready)
- [x] Password reset (backend ready)
- [x] Auth context and protected routes
- [x] Login and Register UI
- [x] Tailwind CSS design system
- [x] Basic layouts (Auth, Dashboard)

#### In Progress
- [ ] Email verification UI
- [ ] Password reset UI
- [ ] Onboarding flow
- [ ] Dashboard overview
- [ ] Settings page

### Phase 2: Services & Availability ⏳
- [ ] Services management (CRUD)
- [ ] Weekly availability setup
- [ ] Break time management
- [ ] Special dates (holidays)
- [ ] Time slot generation

### Phase 3: Booking System ⏳
- [ ] Public booking page
- [ ] Date & time selection
- [ ] Stripe payment integration
- [ ] Booking confirmation emails

### Phase 4: Dashboard & Management ⏳
- [ ] Bookings list and filters
- [ ] Calendar view
- [ ] Drag & drop rescheduling
- [ ] Manual booking creation

### Phase 5: Customers & Notifications ⏳
- [ ] Customer management
- [ ] Automated reminder emails
- [ ] Daily summary emails

### Phase 6: Analytics & Polish ⏳
- [ ] Analytics dashboard
- [ ] Charts and reports
- [ ] Export functionality

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new business account.

**Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars, 1 number, 1 special char)",
  "businessName": "string (required, min 2 chars)",
  "businessCategory": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": { ... },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### POST `/api/auth/login`
Login to account.

**Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional)"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "jwt_token"
}
```

#### GET `/api/auth/me`
Get current user information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "businessName": "string",
    "businessSlug": "string",
    ...
  }
}
```

#### POST `/api/auth/verify-email`
Verify email address.

**Body:**
```json
{
  "token": "verification_token"
}
```

#### POST `/api/auth/forgot-password`
Request password reset.

**Body:**
```json
{
  "email": "string"
}
```

#### POST `/api/auth/reset-password`
Reset password with token.

**Body:**
```json
{
  "token": "reset_token",
  "newPassword": "string"
}
```

### Other Endpoints

Coming in future phases:
- `/api/services` - Service management
- `/api/availability` - Availability settings
- `/api/bookings` - Booking management
- `/api/customers` - Customer management
- `/api/analytics` - Analytics data
- `/api/settings` - Business settings
- `/api/payments` - Payment processing
- `/api/public/:businessSlug` - Public booking pages

---

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Create account on [Railway](https://railway.app/) or [Render](https://render.com/)
2. Create new project
3. Connect your Git repository
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://vercel.com/)
2. Import your Git repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=your-backend-url`
6. Deploy

### Environment Variables for Production

**Backend:**
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production database
- Set up email service (SendGrid/Resend)
- Configure Stripe with live keys

**Frontend:**
- Set `VITE_API_URL` to backend URL

---

## 🔐 Security Notes

- Never commit `.env` files
- Use strong JWT secrets in production
- Enable HTTPS in production
- Keep dependencies updated
- Regular security audits
- Follow GDPR compliance for EU users

---

## 📞 Support

For issues or questions:
- Check `PROJECT_STATUS.md` for development progress
- Review API documentation above
- Check backend logs in `backend/logs/`

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🗓️ Development Timeline

- **Phase 1 (Weeks 1-2):** Foundation & Authentication ← **YOU ARE HERE**
- **Phase 2 (Weeks 3-4):** Services & Availability
- **Phase 3 (Weeks 5-6):** Booking System
- **Phase 4 (Weeks 7-8):** Dashboard & Management
- **Phase 5 (Weeks 9-10):** Customers & Notifications
- **Phase 6 (Weeks 11-12):** Analytics & Polish
- **Phase 7 (Week 13):** Beta Launch
- **Phase 8 (Week 14+):** Iteration & Growth

---

**Last Updated:** November 6, 2025  
**Version:** 1.0.0 (Phase 1)
