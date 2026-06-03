# SheeshaTonight - Setup & Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

## Local Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd sheeshatonight
npm install
```

### 2. Database Setup
```bash
# Copy .env.local and update DATABASE_URL
cp .env.local.example .env.local

# Run migrations
npx prisma db push
npx prisma generate
```

### 3. Development
```bash
# Terminal 1: Next.js Frontend
npm run dev

# Terminal 2: Backend (optional)
npm run backend
```

Visit http://localhost:3000

### 4. Testing Roles
- Use the **Role Switcher** at the top of the auth page
- Click "Sign In" to test each role instantly:
  - **CUSTOMER**: Dashboard with order tracking
  - **VENDOR**: Portal with booking requests
  - **ADMIN**: Operations hub with KYC approvals

## Deployment (Vercel)

```bash
npm install -g vercel
vercel deploy
```

## Production Checklist
- [ ] Set secure DATABASE_URL on Vercel
- [ ] Enable CORS headers for backend
- [ ] Configure S3/CDN for document uploads
- [ ] Set up email/SMS OTP service
- [ ] Enable payment gateway (Stripe/Telr)
- [ ] Configure CI/CD pipeline
