# Backend Architecture & Security Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  Login/Register Components → AuthHydration Component        │
│         RoleSwitcher → Route Guards                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests + JWT Token
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Next.js Middleware (middleware.ts)             │
│  - Route Protection                                          │
│  - Role-based Access Control                                │
│  - Cookie-based session management                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             API Route Handlers (/app/api)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ /auth/*                                             │    │
│  │  ├─ register: Create user + hash password           │    │
│  │  ├─ login: Verify credentials + issue JWT          │    │
│  │  └─ logout: Clear auth cookies                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ /users/*                                            │    │
│  │  ├─ me: Get current user profile                   │    │
│  │  └─ index: Get all users (admin only)              │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ /admin/*                                            │    │
│  │  └─ stats: Get dashboard statistics                │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Prisma ORM + SQL Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                             │
│                                                              │
│  User Table:                                                │
│  ├─ id (CUID)                                              │
│  ├─ name, email, phone                                     │
│  ├─ password (bcrypt hash)                                 │
│  ├─ role (CUSTOMER | VENDOR | ADMIN)                       │
│  ├─ verified, kycStatus                                    │
│  └─ timestamps                                             │
│                                                              │
│  Vendor Table:                                              │
│  ├─ userId (FK → User)                                     │
│  ├─ name, slug, description                                │
│  ├─ tier, isActive                                         │
│  └─ documents, products, orders                            │
│                                                              │
│  Order Table, Address Table, etc.                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Registration Flow

```
1. User fills registration form
   ↓
2. Form data sent to POST /api/auth/register
   ├─ Validate input (email, password strength)
   ├─ Check for duplicate email
   ├─ Hash password with bcryptjs (10 rounds)
   ├─ Create user in database
   └─ Generate JWT token
   ↓
3. Return token + user data
   ├─ Store token in localStorage (browser)
   ├─ Set HTTP-only cookie (server)
   └─ Redirect to dashboard
```

### Login Flow

```
1. User enters email & password
   ↓
2. Form data sent to POST /api/auth/login
   ├─ Validate input format
   ├─ Find user by email
   ├─ Compare password with bcrypt hash
   └─ Generate JWT token (if valid)
   ↓
3. Return token + user data
   ├─ Store token in localStorage
   ├─ Set HTTP-only cookie
   └─ Redirect to dashboard based on role
```

### Authorization Flow (API Requests)

```
1. Frontend makes API request
   ├─ Include JWT in Authorization header
   └─ Send to protected endpoint
   ↓
2. API Route Handler receives request
   ├─ Extract token from header
   ├─ Verify token signature & expiration
   ├─ Decode user info (userId, email, role)
   └─ Attach user to request object
   ↓
3. Check Authorization Rules
   ├─ If endpoint requires admin → check role
   ├─ If endpoint requires auth → verify token exists
   └─ If unauthorized → return 401/403
   ↓
4. Process request if authorized
   ├─ Fetch from database
   ├─ Return response
   └─ Handle errors gracefully
```

---

## 🛡️ Security Features

### 1. Password Security

- **Hashing Algorithm**: bcryptjs with 10 salt rounds
- **Storage**: Never stored in plain text
- **Validation**: 
  - Minimum 8 characters
  - Must contain uppercase, lowercase, numbers
  - Can be extended with special characters

```typescript
// Password hash example (never visible to users)
$2b$10$...very_long_hash_string...
```

### 2. JWT Token Security

- **Algorithm**: HS256 (HMAC SHA-256)
- **Secret**: Environment variable (JWT_SECRET)
- **Expiration**: 7 days
- **Payload**: userId, email, role

```typescript
// Token structure (without signature)
{
  "userId": "clx123...",
  "email": "user@example.com",
  "role": "CUSTOMER",
  "iat": 1705318200,
  "exp": 1705923000
}
```

### 3. Cookie Security

- **Type**: HTTP-only (JavaScript cannot access)
- **Secure Flag**: Only sent over HTTPS in production
- **SameSite**: 'lax' (prevents CSRF attacks)
- **Path**: '/' (available to entire app)
- **Max Age**: 7 days

### 4. Input Validation

- **Email**: RFC 5322 format validation
- **Password**: Strength requirements
- **Name**: Minimum 2 characters
- **XSS Prevention**: All inputs sanitized
- **SQL Injection**: Prisma parameterized queries

### 5. Rate Limiting (Optional)

Consider adding rate limiting for:
- `POST /api/auth/login` (prevent brute force)
- `POST /api/auth/register` (prevent spam)

### 6. HTTPS Enforcement (Production)

```typescript
// In .env.local
NODE_ENV="production"

// Cookies automatically secure in production
secure: process.env.NODE_ENV === 'production'
```

---

## 📊 Database Schema Details

### User Table Structure

```prisma
model User {
  id        String     @id @default(cuid())
  name      String                          // User's full name
  email     String     @unique             // Email login
  phone     String?    @unique             // Phone number
  password  String                         // Bcrypt hash
  role      UserRole   @default(CUSTOMER)  // Access level
  dob       DateTime?                      // Date of birth
  locale    String     @default("en-AE")   // Language/region
  verified  Boolean    @default(false)     // Email verified
  kycStatus KYCStatus  @default(PENDING)   // KYC status
  createdAt DateTime   @default(now())     // Account created
  updatedAt DateTime   @updatedAt          // Last update
  
  // Relations
  vendor    Vendor?           // If user is vendor
  orders    Order[]           // User's orders
  addresses Address[]         // Shipping addresses
  
  // Indexes for performance
  @@index([email])            // Fast login lookup
  @@index([role])             // Fast role-based queries
}
```

### User Roles & Permissions

| Role | Access | Endpoints |
|------|--------|-----------|
| **CUSTOMER** | `/customer/*` | `GET /api/users/me`, `POST /api/auth/login` |
| **VENDOR** | `/vendor/*` | `GET /api/users/me`, vendor-specific endpoints |
| **ADMIN** | `/admin/*` | All endpoints including `GET /api/admin/stats` |

---

## 🔄 Token Lifecycle

```
1. Token Generated
   ├─ Created at: current timestamp
   ├─ Expires at: current + 7 days
   └─ Secret: JWT_SECRET from .env
   ↓
2. Token Stored
   ├─ localStorage: for API requests
   ├─ HTTP-only cookie: for browser requests
   └─ Sent in Authorization header
   ↓
3. Token Used
   ├─ Each API request includes token
   ├─ Server verifies signature
   ├─ Server checks expiration
   └─ Decoded to extract user info
   ↓
4. Token Expires
   ├─ After 7 days automatically
   ├─ User must login again
   └─ (Can implement refresh tokens for better UX)
```

---

## 🚨 Error Handling

### Authentication Errors

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Invalid input | Show validation message |
| 401 | Invalid/expired token | Redirect to login |
| 403 | Insufficient permissions | Show access denied |
| 409 | Email already exists | Ask to login instead |
| 500 | Server error | Log and retry |

---

## 📈 Scalability Considerations

### Current Setup
- Single PostgreSQL database
- No caching layer
- No API rate limiting
- No request logging

### Future Improvements

1. **Caching Layer**
   ```
   Redis → Cache user data, stats
   ```

2. **API Rate Limiting**
   ```
   npm install express-rate-limit
   ```

3. **Token Refresh**
   ```
   Short-lived tokens (15min) + refresh tokens (7 days)
   ```

4. **Monitoring & Logging**
   ```
   Winston/Bunyan for structured logging
   Sentry for error tracking
   ```

5. **Database Optimization**
   ```
   Connection pooling with PgBouncer
   Indexes on frequently queried fields
   ```

---

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with invalid token (should fail)
- [ ] Access admin route as customer (should fail)
- [ ] Get current user profile
- [ ] Get all users as admin
- [ ] Get stats as admin
- [ ] Logout and clear token
- [ ] Password hashing works correctly
- [ ] Token expires after 7 days
- [ ] Duplicate email registration prevented

---

## 📚 Files Overview

```
lib/
├─ jwt.ts           → JWT token generation & verification
├─ auth.ts          → Password hashing & validation
├─ db.ts            → Prisma client initialization
├─ middleware.ts    → API authentication middleware
└─ api-client.ts    → Frontend helper functions

app/api/
├─ auth/
│  ├─ register/     → POST /api/auth/register
│  ├─ login/        → POST /api/auth/login
│  └─ logout/       → POST|GET /api/auth/logout
├─ users/
│  ├─ me/           → GET /api/users/me
│  └─ index/        → GET /api/users
├─ admin/
│  └─ stats/        → GET /api/admin/stats
└─ health/          → GET /api/health

middleware.ts       → Frontend route protection
```

---

## 🔄 Integration Points

### Frontend Components Can Now Use:

```typescript
// In any component
import { authAPI, userAPI, adminAPI } from '@/lib/api-client';

// Handle login
const response = await authAPI.login(email, password);

// Get user data
const user = await userAPI.getMe();

// Admin stats
const stats = await adminAPI.getStats();
```

### No UI Changes Required
- All new APIs are backend-only
- Frontend can integrate gradually
- Existing role switcher still works
- Can coexist with old auth system

---

## 🚀 Production Checklist

- [ ] Update JWT_SECRET to strong random value
- [ ] Set DATABASE_URL for production database
- [ ] Set NODE_ENV="production"
- [ ] Enable HTTPS (secure cookies)
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Run database migrations
- [ ] Test all endpoints
- [ ] Set up automated backups
- [ ] Configure CI/CD pipeline
