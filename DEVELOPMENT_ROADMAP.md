# 🛣️ Development Roadmap: Path to Production Launch

**Document**: Complete implementation roadmap for SheeshaTonight  
**Target**: Production launch within 4-5 weeks  
**Last Updated**: June 3, 2026

---

## Phase 1: Security Hardening (40 hours - Week 1)
**Goal**: Eliminate all critical security vulnerabilities  
**Success Metric**: Zero privilege escalation exploits

### 1.1 Server-Side JWT Validation Middleware
**Status**: ⚠️ NEEDS IMPLEMENTATION

**Files to Create**:
- `lib/auth.ts` - Update with `verifyTokenOnServer()` function
- `middleware.ts` - Add JWT validation for all `/api/` routes

**Implementation**:
```typescript
// lib/auth.ts - Add new export
export async function verifyTokenAndGetUser(token: string) {
  try {
    const payload = verifyToken(token) as JWTPayload;
    
    // Database lookup to verify user still exists and role is current
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true }
    });
    
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }
    
    return user;
  } catch (error) {
    return null;
  }
}

// middleware.ts - Protect all /api/ routes
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Only auth endpoints don't need token
    if (['/api/auth/login', '/api/auth/register', '/api/health'].includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.next();
}
```

**Checklist**:
- [ ] JWT verification on all protected endpoints
- [ ] Database role lookup
- [ ] User active status check
- [ ] Token expiration handling
- [ ] Refresh token mechanism

---

### 1.2 HttpOnly Secure Cookies
**Status**: ⚠️ NEEDS IMPLEMENTATION

**Files to Update**:
- `lib/middleware.ts` - `setAuthCookie()` function
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`

**Implementation**:
```typescript
// lib/middleware.ts
export function setAuthCookie(token: string, response: NextResponse) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,           // Cannot be accessed from JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    sameSite: 'strict',       // CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

// Make sure token is never sent in JSON response
export async function POST(request: NextRequest) {
  // ... authentication logic ...
  
  const response = NextResponse.json({
    success: true,
    user: { id, email, role }, // NOT token
  });
  
  setAuthCookie(token, response);
  return response;
}
```

**Checklist**:
- [ ] HttpOnly flag set
- [ ] Secure flag for HTTPS
- [ ] SameSite=Strict
- [ ] Appropriate expiration
- [ ] Token never in JSON response

---

### 1.3 Rate Limiting on Auth Endpoints
**Status**: ❌ NEEDS IMPLEMENTATION

**Installation**:
```bash
npm install express-rate-limit
```

**Files to Create**:
- `lib/rate-limit.ts` - Rate limiting middleware

**Implementation**:
```typescript
// lib/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

const loginAttempts = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];
  
  // Clear old attempts outside window
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  recentAttempts.push(now);
  loginAttempts.set(ip, recentAttempts);
  return true;
}

// In auth endpoint:
const ip = request.headers.get('x-forwarded-for') || 'unknown';
if (!checkRateLimit(ip)) {
  return NextResponse.json(
    { error: 'Too many login attempts. Try again later.' },
    { status: 429 }
  );
}
```

**Checklist**:
- [ ] Rate limiting on /auth/login (5 attempts per 15 min)
- [ ] Rate limiting on /auth/register (10 per hour)
- [ ] IP-based tracking
- [ ] Exponential backoff implementation

---

### 1.4 CORS and Security Headers
**Status**: ⚠️ NEEDS IMPLEMENTATION

**File**: `next.config.js`

**Implementation**:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/?redirect=admin',
        permanent: false,
        missing: [{ type: 'header', key: 'Authorization' }],
      },
    ]
  },
}
```

**Checklist**:
- [ ] HSTS header
- [ ] X-Content-Type-Options
- [ ] X-Frame-Options
- [ ] X-XSS-Protection
- [ ] CSP headers

---

### 1.5 Input Validation & Sanitization
**Status**: ⚠️ PARTIAL (Zod partially implemented)

**File**: `lib/validation.ts` - Create comprehensive schema

**Implementation**:
```typescript
// lib/validation.ts
import { z } from 'zod';

export const emailSchema = z.string().email().toLowerCase();
export const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password required'),
});

// Use in endpoints
const validation = registerSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json({ error: validation.error.errors }, { status: 400 });
}
```

**Checklist**:
- [ ] Email validation
- [ ] Password complexity requirements
- [ ] Input length limits
- [ ] Whitelist allowed characters
- [ ] SQL injection prevention
- [ ] XSS prevention

---

## Phase 2: Feature Implementation (120 hours - Weeks 2-3)
**Goal**: Implement all critical APIs and pages  
**Success Metric**: All core workflows end-to-end functional

### 2.1 Core API Endpoints (60 hours)

**Product API** (`app/api/products/`)
```typescript
// Files to create:
- route.ts (GET all products, POST create)
- [id]/route.ts (GET, PATCH, DELETE specific product)
- [id]/reviews/route.ts (GET reviews, POST review)
- search/route.ts (Full-text search)

// Implement:
- GET /api/products - List with pagination, filtering
- POST /api/products - Admin only
- GET /api/products/[id] - Get details with reviews
- PATCH /api/products/[id] - Update product
- DELETE /api/products/[id] - Archive product
- POST /api/products/search - Full-text search
```

**Order API** (`app/api/orders/`)
```typescript
// Files to create:
- route.ts (GET user orders, POST create)
- [id]/route.ts (GET order detail, PATCH status)
- [id]/track/route.ts (Get tracking info)
- [id]/cancel/route.ts (Cancel order)

// Implement:
- GET /api/orders - User's orders with pagination
- POST /api/orders - Create order from cart
- GET /api/orders/[id] - Order details
- PATCH /api/orders/[id] - Update status (admin)
- GET /api/orders/[id]/track - Tracking info
- POST /api/orders/[id]/cancel - Customer cancellation
```

**Cart API** (`app/api/cart/`)
```typescript
// Files to create:
- route.ts (GET cart, POST add item)
- [id]/route.ts (PATCH/DELETE item)
- checkout/route.ts (Process checkout)

// Implement:
- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- PATCH /api/cart/[id] - Update quantity
- DELETE /api/cart/[id] - Remove item
- POST /api/cart/checkout - Create order
```

**Admin APIs** (`app/api/admin/`)
```typescript
// Files to create:
- stats/route.ts (Dashboard metrics)
- users/route.ts (User management)
- vendors/route.ts (Vendor management)
- vendors/[id]/approve/route.ts (KYC approval)
- settlements/route.ts (Payouts)

// Implement:
- GET /api/admin/stats - Real dashboard metrics
- GET /api/admin/users - User list with pagination
- GET /api/admin/vendors - Vendor list with KYC status
- PATCH /api/admin/vendors/[id]/approve - KYC approval
- GET /api/admin/settlements - Payout history
```

**Checklist for Each Endpoint**:
- [ ] Input validation (Zod schema)
- [ ] Authorization check (role-based)
- [ ] Database query with error handling
- [ ] Pagination for list endpoints
- [ ] Appropriate HTTP status codes
- [ ] Sanitized response (no sensitive data)
- [ ] Rate limiting
- [ ] Audit logging

---

### 2.2 Dashboard Pages (30 hours)

**Admin Dashboard** (`app/admin/`)
- [ ] `/dashboard` - Replace hardcoded metrics with API queries
- [ ] `/analytics` - Real chart data (install Chart.js or Recharts)
- [ ] `/products` - Product approval workflow
- [ ] `/vendors` - KYC approval queue
- [ ] `/finance` - Settlement and payout history
- [ ] `/reports` - Generate downloadable reports

**Vendor Dashboard** (`app/vendor/`)
- [ ] `/dashboard` - Sales metrics
- [ ] `/products` - Product listing and inventory
- [ ] `/analytics` - Revenue charts
- [ ] `/earnings` - Payout schedule
- [ ] `/orders` - Order management
- [ ] `/messages` - Vendor messaging

**Customer Pages** (`app/customer/`)
- [ ] `/home` - API-driven product recommendations
- [ ] `/search` - Search functionality
- [ ] `/product/[id]` - Product detail page
- [ ] `/categories` - Category filtering
- [ ] `/cart` - Cart management
- [ ] `/checkout` - Order creation flow
- [ ] `/orders` - Order history
- [ ] `/track` - Order tracking
- [ ] `/wishlist` - Wishlist management
- [ ] `/wallet` - Digital wallet

---

### 2.3 Remove Mock Data (20 hours)

**Files to Update**:
- `lib/constants.ts` - Remove all MOCK_ exports
- All pages using MOCK data - Replace with API calls

**Mock Data to Remove**:
- MOCK_ORDERS
- MOCK_BOOKING_REQUESTS
- MOCK_KYC_QUEUE
- ADMIN_METRICS
- All hardcoded product/venue lists

---

### 2.4 Real Dashboard Metrics (10 hours)

**File**: `app/admin/dashboard/page.tsx`

**Implement Real Queries**:
```typescript
// Replace hardcoded AED 2.4M with:
const totalRevenue = await prisma.order.aggregate({
  _sum: { total: true },
  where: { status: 'COMPLETED' }
});

// Replace hardcoded 342 vendors with:
const activeVendors = await prisma.vendor.count({
  where: { isApproved: true, isActive: true }
});

// Replace 1,240 customers with:
const activeCustomers = await prisma.user.count({
  where: { role: 'CUSTOMER', isActive: true }
});

// Replace 8,542 orders with:
const totalOrders = await prisma.order.count();
```

---

## Phase 3: Optimization & Testing (60 hours - Week 4)
**Goal**: Ensure quality, performance, security  
**Success Metric**: 80%+ test coverage, <2s page load

### 3.1 Database Optimization (15 hours)
- [ ] Add database indexes on frequently queried columns
- [ ] Optimize N+1 queries using Prisma `include`
- [ ] Implement query caching strategy
- [ ] Database connection pooling

### 3.2 Performance Optimization (15 hours)
- [ ] Image optimization (Next.js Image component)
- [ ] Lazy loading for components
- [ ] API response caching
- [ ] Database query result caching (Redis)
- [ ] Code splitting optimization

### 3.3 Error Handling & Boundaries (10 hours)
- [ ] Error boundary components
- [ ] Global error handling middleware
- [ ] User-friendly error messages
- [ ] Error logging to Sentry
- [ ] Retry logic for failed requests

### 3.4 Testing Strategy (20 hours)
**Tools**: Jest + React Testing Library + Playwright

- [ ] Unit tests (lib functions, utilities)
- [ ] Component tests (React components)
- [ ] Integration tests (API endpoints)
- [ ] E2E tests (critical user flows)
- [ ] Security tests (OWASP Top 10)
- [ ] Performance tests (Lighthouse)

---

## Phase 4: Deployment & Monitoring (30 hours - Week 5)
**Goal**: Production-ready infrastructure  
**Success Metric**: Automated deployment, real-time monitoring

### 4.1 CI/CD Pipeline (10 hours)
- [ ] GitHub Actions workflow
- [ ] Automated tests on PR
- [ ] Build and deploy to staging
- [ ] Staging → Production promotion

### 4.2 Error Tracking & Monitoring (10 hours)
- [ ] Set up Sentry for error tracking
- [ ] Configure performance monitoring
- [ ] Set up alerts for critical errors
- [ ] Create dashboards

### 4.3 Database & Backups (5 hours)
- [ ] Automated database backups
- [ ] Backup retention policy
- [ ] Point-in-time recovery testing
- [ ] Disaster recovery plan

### 4.4 Documentation (5 hours)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide
- [ ] Operations runbook
- [ ] Incident response procedures

---

## 📊 Timeline Overview

```
Week 1 (Phase 1): Security Hardening
├─ Mon-Tue: JWT validation, CORS, security headers
├─ Wed-Thu: Rate limiting, input validation
└─ Fri: Security review & testing

Week 2-3 (Phase 2): Features
├─ Mon: Product & Order APIs (20 hours)
├─ Tue-Wed: Cart API & Admin endpoints (20 hours)
├─ Thu: Replace mock data (20 hours)
├─ Fri: Implement real metrics (10 hours)
└─ Sat-Sun: Buffer for issues

Week 4 (Phase 3): Optimization
├─ Mon-Tue: Database optimization (15 hours)
├─ Wed: Performance tuning (15 hours)
├─ Thu: Error handling (10 hours)
├─ Fri: Testing & QA (20 hours)
└─ Buffer for findings

Week 5 (Phase 4): Production
├─ Mon-Tue: CI/CD setup (10 hours)
├─ Wed: Monitoring & alerts (10 hours)
├─ Thu: Documentation (5 hours)
└─ Fri: Final review & approval
```

---

## 📋 Definition of Done

### Phase 1 Complete When:
- [ ] Zero security vulnerabilities remain
- [ ] All endpoints enforce server-side JWT validation
- [ ] Rate limiting active on all endpoints
- [ ] No credentials in code or config
- [ ] Security audit passes

### Phase 2 Complete When:
- [ ] All APIs implemented and tested
- [ ] All pages functional
- [ ] No mock data in codebase
- [ ] Real data flowing through dashboard
- [ ] User workflows end-to-end functional

### Phase 3 Complete When:
- [ ] 80%+ test coverage
- [ ] <2s page load time
- [ ] Performance monitoring configured
- [ ] Error handling on all flows
- [ ] Zero console errors in prod

### Phase 4 Complete When:
- [ ] CI/CD pipeline active
- [ ] Staging environment mirrors production
- [ ] Error tracking active
- [ ] Automated backups working
- [ ] Team trained on operations
- [ ] Ready for production launch ✅

---

## 👥 Team Allocation

### Recommended Team Composition
- 1 Backend Developer (2 weeks full-time) → APIs & Database
- 1 Frontend Developer (1.5 weeks) → Pages & UI fixes
- 1 DevOps/Infrastructure (1 week) → Deployment, monitoring
- 1 QA Engineer (ongoing) → Testing & verification
- 1 Security Reviewer (part-time) → Security validation

### Parallelization Opportunities
- Phase 1 & 2 can overlap (APIs while finishing UI)
- Phase 3 testing during Phase 2 implementation
- Phase 4 setup parallel to Phase 3 optimization

---

## 🎯 Success Metrics

The application is production-ready when:

```
Security:              100% ██████████ ✅
Functionality:         100% ██████████ ✅
Performance:            90% █████████░ ✅
Test Coverage:          80% ████████░░ ✅
Documentation:         100% ██████████ ✅
Deployment:            100% ██████████ ✅
Monitoring:            100% ██████████ ✅
────────────────────────────────────────
Overall Readiness:     96% █████████░ ✅
```

---

## 🚀 Go/No-Go Decision Criteria

**GO for Production**: When all Phase 1-4 items are complete AND:
- ✅ Security audit passes with zero critical findings
- ✅ Load test shows 10,000+ concurrent users supported
- ✅ Performance metrics meet targets
- ✅ Backup & recovery tested
- ✅ Team trained and ready
- ✅ Client approval received

**NO-GO**: If any critical security vulnerability remains

---

**Document Owner**: Development Team Lead  
**Last Updated**: June 3, 2026  
**Next Review**: Weekly progress updates

