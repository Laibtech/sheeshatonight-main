# Backend Integration Guide

## Overview

This guide explains how to integrate the new backend authentication and API system with your existing frontend without changing any UI/design.

---

## 🚀 Quick Start

### 1. Set Environment Variables

Update `.env.local` with your database URL and JWT secret:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sheeshatonight"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Development
NODE_ENV="development"
```

### 2. Run Database Migrations

```bash
# Create/update database tables
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and the API is ready at `http://localhost:3000/api`.

---

## 📝 Integration Examples

### Example 1: Update Login Component

Your existing login component can now call the new API:

```typescript
// lib/api-client.ts is already provided with helper functions
import { authAPI } from '@/lib/api-client';

async function handleLogin(email: string, password: string) {
  try {
    const response = await authAPI.login(email, password);
    
    if (response.success) {
      // Token is automatically stored
      const user = response.user;
      
      // Update your store/state with user info
      setUser(user);
      
      // Redirect to dashboard based on role
      const dashboardMap = {
        CUSTOMER: '/customer/home',
        VENDOR: '/vendor/dashboard',
        ADMIN: '/admin/dashboard'
      };
      
      router.push(dashboardMap[user.role] || '/');
    }
  } catch (error) {
    // Handle error
    console.error('Login failed:', error.message);
  }
}
```

### Example 2: Update Registration Component

```typescript
import { authAPI } from '@/lib/api-client';

async function handleRegister(formData: any) {
  try {
    const response = await authAPI.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: 'CUSTOMER' // Can be CUSTOMER, VENDOR, or ADMIN
    });
    
    if (response.success) {
      // User automatically logged in
      router.push('/customer/home');
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}
```

### Example 3: Fetch User Data in Dashboard

```typescript
import { userAPI } from '@/lib/api-client';

useEffect(() => {
  async function fetchUser() {
    try {
      const response = await userAPI.getMe();
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }
  
  fetchUser();
}, []);
```

### Example 4: Admin Stats Dashboard

```typescript
import { adminAPI } from '@/lib/api-client';

useEffect(() => {
  async function fetchStats() {
    try {
      const response = await adminAPI.getStats();
      setStats(response.stats);
      setRecentUsers(response.recentUsers);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }
  
  fetchStats();
}, []);
```

### Example 5: Get All Users (Admin Only)

```typescript
import { userAPI } from '@/lib/api-client';

async function fetchAllUsers(page = 1) {
  try {
    const response = await userAPI.getUsers(page, 10);
    setUsers(response.data);
    setPagination(response.pagination);
  } catch (error) {
    if (error.status === 403) {
      alert('You do not have permission to view all users');
    }
  }
}
```

---

## 🔧 Using API Helper Functions

The `lib/api-client.ts` file provides pre-built helpers:

### Authentication

```typescript
import { authAPI, isAuthenticated, getStoredToken } from '@/lib/api-client';

// Register
await authAPI.register({
  name: 'John',
  email: 'john@example.com',
  password: 'Pass123!',
  confirmPassword: 'Pass123!'
});

// Login
await authAPI.login('john@example.com', 'Pass123!');

// Logout
await authAPI.logout();

// Check if logged in
if (isAuthenticated()) {
  const token = getStoredToken();
}
```

### User Data

```typescript
import { userAPI } from '@/lib/api-client';

// Get current user
const response = await userAPI.getMe();
const user = response.user;

// Get all users (admin)
const response = await userAPI.getUsers(page, limit);
const users = response.data;
const pagination = response.pagination;
```

### Admin Functions

```typescript
import { adminAPI } from '@/lib/api-client';

// Get stats
const response = await adminAPI.getStats();
const stats = response.stats;
const recentUsers = response.recentUsers;
```

---

## 🛡️ Error Handling

All API calls should handle errors:

```typescript
import { authAPI, isUnauthorizedError, isForbiddenError } from '@/lib/api-client';

async function handleApiCall() {
  try {
    const response = await authAPI.login(email, password);
    return response;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      // Token expired or invalid
      router.push('/login');
    } else if (isForbiddenError(error)) {
      // Insufficient permissions
      alert('You do not have permission to access this resource');
    } else {
      console.error('Error:', error.message);
    }
  }
}
```

---

## 🔐 Protected Routes

The middleware automatically protects frontend routes:

```typescript
// Middleware (already configured in middleware.ts)
// /admin/* → requires ADMIN role
// /vendor/* → requires VENDOR role
// /customer/* → requires CUSTOMER or logged in status
```

For API routes, authentication is handled per endpoint.

---

## 💾 Database Schema

The User model includes:

```typescript
model User {
  id        String      @id @default(cuid())
  name      String
  email     String      @unique
  phone     String?     @unique
  password  String      // Hashed with bcryptjs
  role      UserRole    @default(CUSTOMER)
  dob       DateTime?
  locale    String      @default("en-AE")
  verified  Boolean     @default(false)
  kycStatus KYCStatus   @default(PENDING)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  vendor    Vendor?
  orders    Order[]
  addresses Address[]
}

enum UserRole {
  CUSTOMER
  VENDOR
  ADMIN
}

enum KYCStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## 📊 API Endpoints Summary

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout (GET also supported)
- `GET /api/health` - Health check

### Protected Endpoints (Any Logged-in User)
- `GET /api/users/me` - Get current user

### Admin Only Endpoints
- `GET /api/users` - Get all users (paginated)
- `GET /api/admin/stats` - Get dashboard stats

---

## 🧪 Testing the Backend

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Next Steps

1. ✅ Backend is set up and ready
2. Update your login/register components to use `authAPI`
3. Update dashboard components to fetch data from API
4. Update admin components to use `adminAPI`
5. Test all features in development

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: can't reach database server
```
**Solution**: Ensure PostgreSQL is running and `DATABASE_URL` is correct in `.env.local`

### JWT_SECRET Not Set
```
Error: JWT_SECRET is required
```
**Solution**: Add `JWT_SECRET` to `.env.local`

### Token Expired
**Solution**: Users need to login again. Add automatic token refresh for better UX.

### CORS Errors
The API is served from the same domain (Next.js), so CORS shouldn't be an issue. If using external frontend, check CORS configuration.

---

## 📞 Support

For issues or questions:
1. Check the API_DOCUMENTATION.md for detailed endpoint specs
2. Review error messages in browser console
3. Check backend logs in terminal
4. Verify database connection
