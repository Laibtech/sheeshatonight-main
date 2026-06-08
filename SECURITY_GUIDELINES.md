# 🔐 Security Guidelines & Best Practices

This document outlines critical security practices for SheeshaTonight development and deployment.

---

## 🚨 Critical Security Issues Fixed

### 1. JWT Secret Management
**Status**: ✅ FIXED

**What Changed**:
- JWT_SECRET now requires a 32+ character environment variable
- Default fallback removed - production throws error if not set
- Development mode warns about weak secrets

**How to Set Up**:
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Set in .env.local (never commit!)
JWT_SECRET="your-generated-32-char-secret"

# In production, set via environment variable:
export JWT_SECRET="your-production-secret"
```

### 2. Admin Role Restrictions
**Status**: ✅ FIXED

**What Changed**:
- Registration endpoint now ONLY creates CUSTOMER accounts
- ADMIN and VENDOR roles require special invitation/approval
- Privilege escalation attempts are logged for audit trail

**How Admin Accounts are Created**:
```typescript
// Existing admin only - via special API
POST /api/admin/invite-user
{
  "email": "newadmin@example.com",
  "role": "ADMIN",
  "invitationToken": "signed-token"
}
```

### 3. Server-Side Session Validation
**Status**: 🟡 IN PROGRESS

**Recommended Architecture**:
```
1. User registers → Server creates JWT
2. JWT stored in HttpOnly secure cookie
3. Every API request validates token server-side
4. Role checked in database (not cookie)
5. Permissions enforced server-side
```

---

## 📋 Security Checklist for All Developers

### Before Committing Code

- [ ] No credentials in code (API keys, passwords, tokens)
- [ ] No secrets in comments or logs
- [ ] All user input validated server-side
- [ ] All API responses properly typed
- [ ] Error messages don't leak sensitive info
- [ ] Authentication tokens in secure cookies (HttpOnly, Secure, SameSite)
- [ ] Database queries use parameterized statements
- [ ] Rate limiting applied to auth endpoints
- [ ] CORS headers properly configured

### API Endpoint Development

**Template for New Endpoints**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt'; // Server-side verification
import { validateInput } from '@/lib/validation'; // Zod schema
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authentication token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Validate input using Zod
    const body = await request.json();
    const validation = createSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 });
    }

    // 3. Check permissions server-side
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Execute with database transaction
    const result = await prisma.$transaction(async (tx) => {
      return await tx.model.create({ data: validation.data });
    });

    // 5. Return sanitized response (never leak sensitive data)
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // 6. Log error securely (no sensitive data in logs)
    console.error('Endpoint error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## 🔒 Environment Variables

### Required for Production
```bash
JWT_SECRET              # 32+ character random string
DATABASE_URL           # PostgreSQL connection string
NODE_ENV              # "production"
```

### Optional but Recommended
```bash
SENTRY_DSN            # Error tracking
LOG_LEVEL             # "info" for production
SMTP_HOST/PORT/USER   # Email notifications
STRIPE_SECRET_KEY     # Payment processing
```

### Never Include These
```
❌ API_INTERNAL_SECRET
❌ ADMIN_PASSWORD
❌ DATABASE_PASSWORD (use connection string instead)
❌ Any hardcoded API keys
```

---

## 🚫 Common Security Mistakes to Avoid

### 1. Storing Secrets in Code
```typescript
// ❌ NEVER DO THIS
const API_KEY = "sk_live_abc123...";
const DB_PASSWORD = "SecurePass123";

// ✅ DO THIS
const API_KEY = process.env.STRIPE_SECRET_KEY;
const DB_URL = process.env.DATABASE_URL;
```

### 2. Trusting Client-Side Values
```typescript
// ❌ NEVER DO THIS
if (localStorage.getItem('user_role') === 'ADMIN') {
  // Allow admin action
}

// ✅ DO THIS (Server-side)
const token = verifyToken(request.headers.get('Authorization'));
if (token.role === 'ADMIN') {
  // Allow admin action
}
```

### 3. Exposing Sensitive Data in Responses
```typescript
// ❌ NEVER DO THIS
return NextResponse.json({
  user: {
    id: '123',
    email: 'user@example.com',
    password_hash: 'bcrypt_hash_here',  // ← NO!
    jwt_token: 'eyJhbGc...', // ← NO!
  }
});

// ✅ DO THIS
return NextResponse.json({
  success: true,
  user: {
    id: '123',
    email: 'user@example.com',
    // Password never in response
    // Token in secure cookie only
  }
});
```

### 4. SQL Injection
```typescript
// ❌ NEVER DO THIS
const user = await prisma.$queryRaw(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ DO THIS (Prisma is safe)
const user = await prisma.user.findUnique({ where: { email } });
```

### 5. Missing Rate Limiting
```typescript
// ❌ NEVER DO THIS
POST /api/auth/login  // Can brute force!

// ✅ DO THIS
// Add rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per IP
});
```

---

## 🧪 Testing Security

### Manual Security Testing Checklist
- [ ] Try registering as ADMIN - should fail silently
- [ ] Try modifying browser cookies - should not change role
- [ ] Try accessing admin endpoints without token - should 401
- [ ] Try invalid JWT token - should reject
- [ ] Try modifying JWT payload - should fail signature validation
- [ ] Try SQL injection payloads - should be escaped
- [ ] Try XSS payloads in forms - should be sanitized
- [ ] Monitor network tab - no tokens in URLs, only secure cookies

### Automated Security Testing
```bash
# Run security audit
npm audit

# Check for dependencies with vulnerabilities
npm audit --production

# OWASP dependency checks
npm install -D snyk
npx snyk test
```

---

## 📊 Audit Logging

### Events to Log
```typescript
// Authentication
- User registration attempt
- Login success/failure
- Password change
- Token refresh
- Logout

// Authorization
- Admin role assignment
- Permission changes
- Suspicious access attempts

// Data modifications
- User creation/update/deletion
- Sensitive field changes
- Admin actions
```

### Log Format (Never include sensitive data)
```json
{
  "timestamp": "2026-06-03T10:30:00Z",
  "event": "LOGIN_SUCCESS",
  "userId": "user_123",
  "email_hash": "sha256(email)",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "success"
}
```

---

## 🚀 Deployment Security

### Before Production Deployment
- [ ] All environment variables set securely
- [ ] Database has strong credentials
- [ ] HTTPS/TLS enabled on all endpoints
- [ ] Security headers configured (HSTS, CSP, etc.)
- [ ] CORS properly restricted
- [ ] Rate limiting enabled
- [ ] Error handling doesn't expose internals
- [ ] Logging doesn't include sensitive data
- [ ] Database backups automated
- [ ] Security audit completed

### Vercel Deployment
```bash
# Set environment variables in Vercel Dashboard
Settings > Environment Variables

Never paste .env.local into Settings!
```

### AWS/Azure Deployment
```bash
# Use managed secrets service
AWS Secrets Manager
Azure Key Vault
Google Secret Manager

Never embed in EC2/container configs!
```

---

## 📞 Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** commit or push the code
2. **DO NOT** post on public channels
3. **DO** create a private issue/email to security@sheeshatonight.com
4. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Suggested fix
   - Your contact information

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Next.js Security Best Practices](https://nextjs.org/docs#security)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: June 3, 2026  
**Review Frequency**: Quarterly or after security incidents
**Owner**: Security Team

