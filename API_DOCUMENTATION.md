# Backend API Documentation

## Overview

The SheeshaTonight backend system provides secure authentication, role-based access control, and RESTful APIs for managing users, vendors, and admin functions.

---

## 🔐 Authentication

### Base URL
```
http://localhost:3000/api
```

### Headers
For authenticated requests, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔑 Auth Endpoints

### 1. Register User
**POST** `/auth/register`

Creates a new user account with secure password hashing.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "role": "CUSTOMER"  // Optional: CUSTOMER | VENDOR | ADMIN (default: CUSTOMER)
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

**Errors:**
- `400` - Invalid input (weak password, invalid email format)
- `409` - Email already registered

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### 2. Login
**POST** `/auth/login`

Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

**Errors:**
- `400` - Invalid input
- `401` - Invalid credentials

---

### 3. Logout
**POST** `/auth/logout` or **GET** `/auth/logout`

Clear authentication session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👤 User Endpoints

### 1. Get Current User
**GET** `/users/me`

Retrieve authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+971501234567",
    "role": "CUSTOMER",
    "locale": "en-AE",
    "verified": false,
    "kycStatus": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- `401` - Unauthorized (no token or invalid token)
- `404` - User not found

---

### 2. Get All Users (Admin Only)
**GET** `/users`

Retrieve paginated list of all users.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+971501234567",
      "role": "CUSTOMER",
      "verified": false,
      "kycStatus": "PENDING",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

## 📊 Admin Endpoints

### 1. Get Dashboard Stats
**GET** `/admin/stats`

Retrieve admin dashboard statistics and user metrics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalVendors": 25,
    "totalCustomers": 120,
    "adminCount": 5,
    "vendorCount": 25,
    "customerCount": 120,
    "usersByRole": {
      "customer": 120,
      "vendor": 25,
      "admin": 5
    }
  },
  "recentUsers": [
    {
      "id": "clx...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "CUSTOMER",
      "createdAt": "2024-01-20T15:45:00Z"
    }
  ]
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Forbidden (not admin)

---

## 🛡️ Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

---

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs with 10 rounds
2. **JWT Tokens**: Secure token-based authentication with 7-day expiration
3. **HTTP-Only Cookies**: Auth tokens stored in secure HTTP-only cookies
4. **Input Validation**: All inputs validated before processing
5. **Role-Based Access Control**: APIs check user roles before returning data
6. **Email Uniqueness**: Duplicate email prevention at registration

---

## 💡 Usage Examples

### JavaScript/Node.js

```javascript
// Register
const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    confirmPassword: 'SecurePass123'
  })
});

const { token, user } = await registerResponse.json();

// Get Current User
const meResponse = await fetch('http://localhost:3000/api/users/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const currentUser = await meResponse.json();

// Admin: Get Stats
const statsResponse = await fetch('http://localhost:3000/api/admin/stats', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

const stats = await statsResponse.json();
```

### cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get Current User
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Role-Based Access Control

### Available Roles
- **CUSTOMER**: Regular users, can access `/customer/*` routes
- **VENDOR**: Marketplace vendors, can access `/vendor/*` routes
- **ADMIN**: System administrators, can access `/admin/*` routes and all admin APIs

### API Route Protection
- `/api/auth/register`, `/api/auth/login`, `/api/auth/logout` - Public (no auth required)
- `/api/users/me` - Authenticated users only
- `/api/users` - Admin only
- `/api/admin/stats` - Admin only

---

## 🚀 Getting Started

1. **Set JWT_SECRET in .env.local**
   ```
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   ```

2. **Run database migrations**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Test the API**
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)
- [bcryptjs GitHub](https://github.com/dcodeIO/bcrypt.js)
