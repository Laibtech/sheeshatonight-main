# High-Level Design Document

## 1. System Architecture Overview

### 1.1 Architecture Type

The SheeshaTonight platform follows a **Monolithic Full-Stack Architecture** with clear separation of concerns:

- **Frontend Layer**: Next.js 14 App Router with React 18, Server Components, and Client Components
- **API Layer**: Next.js API Routes providing RESTful endpoints
- **Business Logic Layer**: Service modules encapsulating domain logic
- **Data Access Layer**: Prisma ORM interfacing with PostgreSQL database
- **Infrastructure Layer**: Authentication, validation, caching, and middleware

**Architectural Pattern**: Model-View-Controller (MVC) adapted for Next.js
- **Model**: Prisma schema and database entities
- **View**: React components (Server and Client)
- **Controller**: API route handlers with business logic

### 1.2 Technology Stack

**Frontend**:
- Next.js 14 (App Router, Server-Side Rendering, Static Generation)
- React 18 (Components, Hooks, Context)
- TypeScript (Type safety across codebase)
- TailwindCSS (Utility-first styling)
- Zustand (Client-side state management)
- Lucide React (Icon library)

**Backend**:
- Next.js API Routes (Serverless functions)
- Node.js Runtime
- Prisma ORM (Database abstraction)
- Zod (Schema validation)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)

**Database**:
- PostgreSQL (Primary relational database)
- Prisma Client (Type-safe query builder)

**Infrastructure**:
- HttpOnly Cookies (Secure token storage)
- Rate Limiting (Request throttling)
- CORS (Cross-origin security)

### 1.3 Deployment Model

**Development Environment**:
- Local Next.js development server (`npm run dev`)
- Local PostgreSQL database
- Hot module reloading for rapid development

**Production Environment**:
- Vercel or similar Next.js hosting platform
- Managed PostgreSQL (e.g., Supabase, Neon, AWS RDS)
- CDN for static assets
- Environment variable configuration
- HTTPS enforcement
- Horizontal scaling via serverless functions

### 1.4 System Boundaries

**In Scope**:
- User authentication and authorization
- CRUD operations for all entities
- Action workflows (approve, reject, activate, etc.)
- Dashboard analytics and statistics
- Search and filtering
- Notification system (in-app and email)
- Audit logging and compliance
- Cart and checkout
- Settlement and financial management

**Out of Scope** (Phase 2):
- Payment gateway integration (placeholder only)
- SMS notifications
- Real-time chat/messaging
- Mobile native applications
- Advanced analytics and BI
- Multi-language support (beyond locale field)
- Social media integration

---

## 2. Core Modules

### 2.1 Authentication & Authorization Module

**Responsibility**: Manage user authentication, session management, and access control

**Components**:
- **JWT Service**: Token generation, validation, and refresh
- **Auth Middleware**: Request authentication and role verification
- **Password Service**: bcrypt hashing and verification
- **Session Manager**: Cookie-based session handling

**Key Features**:
- JWT tokens stored in HttpOnly secure cookies
- Role-based access control (CUSTOMER, VENDOR, ADMIN)
- Token expiration and automatic refresh (24-hour rotation)
- Rate limiting on authentication endpoints
- Failed login attempt tracking
- Password strength enforcement

**Security Measures**:
- Database user lookup on every authenticated request
- Account status verification (active/inactive)
- IP-based rate limiting
- Audit logging for authentication events

### 2.2 User Management Module

**Responsibility**: Manage user accounts, profiles, and addresses

**Components**:
- **User Service**: CRUD operations for users
- **Profile Service**: Profile updates and validation
- **Address Service**: Address management with default handling
- **Admin User Controller**: Administrative user management

**Key Features**:
- User registration with role assignment (default: CUSTOMER)
- Profile management (name, phone, dob, locale)
- Multiple address support with default selection
- KYC status tracking (PENDING, APPROVED, REJECTED)
- User search, filtering, and pagination
- Role protection (users cannot modify own role)

**Data Flow**:
```
Frontend Request → Auth Middleware → User Service → Prisma → Database
                                         ↓
                                    Validation (Zod)
                                         ↓
                                    Response Formatter
```

### 2.3 Product Management Module

**Responsibility**: Manage product catalog, inventory, and product actions

**Components**:
- **Product Service**: CRUD operations for products
- **Product Action Service**: Approval, rejection, featuring workflows
- **Product Search Service**: Full-text search and filtering
- **Inventory Service**: Stock tracking and validation

**Key Features**:
- Vendor product creation with ownership enforcement
- Admin product approval workflow
- Product featuring for marketplace visibility
- Soft delete with deletedAt timestamp
- Image upload and storage (URLs)
- Stock level management
- Price and type categorization (SHEESHA_PIPE, TOBACCO_BLEND, etc.)
- Search by title, description with price range filtering
- Pagination (20 items per page)

**Access Control**:
- VENDOR: Create, read own, update own, delete own
- ADMIN: Read all, approve, reject, feature, delete
- CUSTOMER: Read active products only

### 2.4 Order Management Module

**Responsibility**: Handle order creation, tracking, and fulfillment workflow

**Components**:
- **Order Service**: Order creation and CRUD operations
- **Order Action Service**: Status transition workflows
- **Order Tracking Service**: Real-time tracking data
- **Invoice Service**: Invoice generation and management

**Key Features**:
- Order creation with automatic orderNumber generation (ORD-YYYY-NNNN)
- OrderItem creation with price snapshots
- Order status workflow management
- Role-based order visibility (customers see own, vendors see their orders, admins see all)
- Order tracking with location and estimated delivery
- Invoice generation with tax and total calculations

**Order Status Workflow**:
```
PREPARING → READY_FOR_PICKUP → OUT_FOR_DELIVERY → DELIVERED
     ↓              ↓                  ↓
CANCELLED      CANCELLED          COMPLETED
```

**Status Transition Rules**:
- VENDOR can accept (PREPARING → READY_FOR_PICKUP)
- VENDOR can decline (PREPARING → CANCELLED)
- VENDOR can ship (READY_FOR_PICKUP → OUT_FOR_DELIVERY)
- VENDOR can deliver (OUT_FOR_DELIVERY → DELIVERED)
- CUSTOMER can cancel (PREPARING or READY_FOR_PICKUP → CANCELLED)
- Invalid transitions are blocked with validation errors

### 2.5 Vendor Management Module

**Responsibility**: Manage vendor accounts, verification, and business operations

**Components**:
- **Vendor Service**: Vendor profile and CRUD operations
- **Vendor Action Service**: Approval and activation workflows
- **Vendor Document Service**: KYC document management
- **Tier Management Service**: Vendor tier upgrades/downgrades

**Key Features**:
- Vendor registration linked to user accounts
- KYC document upload (TRADE_LICENSE, IDENTITY, BUSINESS_REGISTRATION, TAX_CERTIFICATE)
- Admin approval workflow with kycStatus
- Vendor tier system (SOLO, MASTER, ADVANCED)
- Vendor deactivation cascades to products
- Location and contact information management
- Plan expiry tracking

**Vendor Tiers**:
- **SOLO**: Basic tier, 5 products max, standard commission
- **MASTER**: 20 products, priority support
- **ADVANCED**: Unlimited products, custom rates, advanced analytics

### 2.6 Cart & Checkout Module

**Responsibility**: Manage shopping cart and checkout process

**Components**:
- **Cart Service**: Cart item management
- **Checkout Service**: Order creation from cart
- **Price Calculator**: Total, tax, and fee calculation

**Key Features**:
- Persistent cart storage in database (userId-based)
- Product availability validation before adding
- Stock validation before checkout
- Automatic cart clearing after successful checkout
- Real-time price updates
- Quantity adjustment with stock limits

**Checkout Flow**:
```
Cart Items → Stock Validation → Order Creation → OrderItems Creation → Cart Clear → Order Confirmation
```

### 2.7 Settlement & Financial Management Module

**Responsibility**: Handle vendor payments and commission tracking

**Components**:
- **Settlement Service**: Settlement record management
- **Commission Calculator**: Platform commission calculation
- **Invoice Generator**: PDF invoice creation
- **Earnings Service**: Vendor earnings summary

**Key Features**:
- Automated settlement calculation from completed orders
- Platform commission deduction
- Settlement status tracking (PENDING, PROCESSED, PAID, FAILED)
- Period-based settlement grouping (e.g., monthly)
- Vendor earnings dashboard
- Invoice PDF generation with order breakdown

**Settlement Flow**:
```
Completed Orders → Calculate Revenue → Deduct Commission → Create Settlement → Process Payment → Mark PAID
```

### 2.8 Notification Module

**Responsibility**: Deliver in-app and email notifications

**Components**:
- **Notification Service**: Notification creation and management
- **Email Service**: Email template rendering and sending
- **Notification Preference Service**: User preference management

**Key Features**:
- Event-driven notification creation
- In-app notification storage with read/unread status
- Email notifications with branded HTML templates
- Notification preference opt-in/opt-out
- Unread count badge support
- Automatic cleanup of old notifications (90 days)

**Notification Events**:
- Vendor approval/rejection
- Order status changes
- Product approval/rejection
- Settlement payments
- Admin actions (bulk operations, user updates)

### 2.9 Analytics & Dashboard Module

**Responsibility**: Provide real-time metrics and business intelligence

**Components**:
- **Admin Analytics Service**: Platform-wide statistics
- **Vendor Analytics Service**: Vendor-specific metrics
- **Customer Analytics Service**: Customer order history
- **Cache Manager**: Dashboard data caching (5-minute TTL)

**Key Features**:
- Real-time data aggregation from database
- Role-based dashboard views
- Time-series data with date range filtering
- Product performance tracking
- Revenue and sales trends
- Cache optimization for performance

**Admin Metrics**:
- Total users, vendors, products, orders
- Revenue (total, monthly, pending settlements)
- Growth trends and percentages

**Vendor Metrics**:
- Total sales, active products, pending orders
- Earnings (total, pending, paid)
- Product performance breakdown
- Sales trends over time

**Customer Metrics**:
- Order history summary
- Active rentals count
- Total spent amount

### 2.10 Audit Logging Module

**Responsibility**: Track all administrative actions for compliance

**Components**:
- **Audit Log Service**: Immutable log creation
- **Audit Query Service**: Log retrieval and filtering
- **CSV Export Service**: Audit log data export

**Key Features**:
- Immutable audit records (no updates or deletes)
- Comprehensive event tracking (userId, action, resource, timestamp, IP, user agent)
- Before/after state recording for data changes
- Failed authentication attempt logging
- 2-year retention policy
- CSV export for external analysis
- Indexed for query performance

**Logged Actions**:
- All approve, reject, activate, deactivate, delete actions
- User role changes
- KYC status updates
- Settlement status changes
- Failed login attempts
- Bulk operations

### 2.11 Search & Filtering Module

**Responsibility**: Provide search functionality across entities

**Components**:
- **Global Search Service**: Cross-entity search
- **Product Search Service**: Product-specific search with filters
- **Search Cache Service**: Query result caching (10-minute TTL)
- **Autocomplete Service**: Search suggestions

**Key Features**:
- Full-text search across products, vendors, orders
- Advanced filtering (price range, type, vendor, stock, status)
- Sorting (relevance, price, date, popularity)
- Search result caching for performance
- Autocomplete suggestions
- Search analytics (term tracking)
- Highlighting of matching terms

### 2.12 Bulk Action Module

**Responsibility**: Execute operations on multiple records atomically

**Components**:
- **Bulk Action Service**: Transaction-wrapped batch operations
- **Bulk Validator**: Pre-execution validation
- **Result Aggregator**: Success/failure reporting

**Key Features**:
- Database transaction support for atomicity
- Pre-validation of all records before execution
- Automatic rollback on any failure
- Detailed result reporting (success count, failure count, errors)
- Audit log creation for each affected record
- Maximum 100 records per request limit

**Supported Bulk Actions**:
- Products: approve, reject, delete, feature, unfeature
- Vendors: approve, reject, activate, deactivate
- Orders: accept, cancel, ship

---

## 3. Data Flow Design

### 3.1 Request Flow Architecture

**Standard CRUD Request Flow**:
```
User Browser → Next.js Page → API Call → Next.js API Route → Middleware Chain → Service Layer → Prisma → PostgreSQL
                                              ↓                    ↓                ↓
                                        Authentication      Validation        Business Logic
                                        Authorization       Rate Limiting      Data Transform
                                        Audit Logging       Error Handling     Caching
```

### 3.2 Authentication Flow

**Login Request**:
```
1. User submits credentials (POST /api/auth/login)
2. Rate limiting check (5 attempts per 15 min)
3. Input validation (email format, password presence)
4. Database user lookup by email
5. Password verification using bcrypt
6. JWT token generation (24-hour expiry)
7. Set HttpOnly secure cookie with token
8. Return success response (without token in body)
9. Audit log creation for login event
```

**Authenticated Request**:
```
1. Client sends request with cookie
2. Middleware extracts JWT from cookie
3. JWT signature verification
4. Token expiration check
5. Database user lookup (verify exists and active)
6. Role authorization check
7. Request proceeds to handler
8. Response returned to client
```

### 3.3 Action Workflow Flow

**Product Approval Flow (Example)**:
```
1. Admin clicks "Approve" button (Frontend)
2. Confirmation modal displayed (Action_Modal component)
3. Admin confirms action
4. POST /api/admin/products/[id] with action="approve"
5. Auth middleware validates admin role
6. Product service retrieves product from database
7. Update product: isActive = true, approvedAt = now()
8. Create audit log entry
9. Create notification for vendor
10. Send email notification to vendor
11. Return updated product data
12. Frontend updates table optimistically
13. Toast notification shows success message
```

### 3.4 Pagination and Filtering Flow

**List Request with Filters**:
```
1. User requests list (GET /api/vendor/products?page=2&type=SHEESHA_PIPE&sort=price)
2. Auth middleware validates request
3. Parse query parameters (page, filters, sorting)
4. Build Prisma query with where, orderBy, skip, take
5. Execute count query (for total records)
6. Execute data query with pagination
7. Include related data (vendor info) using Prisma include
8. Return response: { data: [...], total: N, page: 2, pageSize: 20 }
9. Frontend renders paginated table
```

### 3.5 Cart to Order Flow

**Checkout Process**:
```
1. Customer clicks "Checkout" (POST /api/cart/checkout)
2. Retrieve cart items with product details
3. Validate all products exist and are active
4. Validate stock availability for all items
5. Begin database transaction
6. Generate unique orderNumber
7. Calculate order totals (subtotal, tax, fees)
8. Create Order record
9. Create OrderItem records with price snapshots
10. Clear cart items
11. Create OrderTracking record
12. Commit transaction
13. Create notifications (customer and vendor)
14. Return order confirmation
15. Frontend redirects to order details page
```

---

## 4. API Structure Overview

### 4.1 API Organization

**Route Structure**:
```
/api
├── /auth
│   ├── /login (POST)
│   ├── /register (POST)
│   └── /logout (POST)
├── /admin
│   ├── /users (GET)
│   ├── /users/[id] (GET, PATCH)
│   ├── /vendors (GET)
│   ├── /vendors/[id] (GET, PATCH, POST actions)
│   ├── /vendors/bulk (POST)
│   ├── /products (GET)
│   ├── /products/[id] (GET, POST actions)
│   ├── /products/bulk (POST)
│   ├── /orders (GET)
│   ├── /orders/[id] (GET, POST actions)
│   ├── /orders/bulk (POST)
│   ├── /settlements (GET, POST)
│   ├── /settlements/[id] (PATCH)
│   ├── /stats (GET)
│   ├── /analytics (GET)
│   └── /audit-logs (GET, export CSV)
├── /vendor
│   ├── /profile (GET, PATCH)
│   ├── /documents (POST)
│   ├── /products (GET, POST)
│   ├── /products/[id] (GET, PATCH, DELETE, POST actions)
│   ├── /settlements (GET)
│   ├── /earnings/summary (GET)
│   ├── /dashboard (GET)
│   └── /analytics (GET)
├── /user
│   ├── /profile (GET, PATCH)
│   ├── /addresses (GET, POST)
│   └── /addresses/[id] (PATCH, DELETE)
├── /products
│   ├── / (GET - public listing)
│   ├── /[id] (GET - public details)
│   └── /search (GET - search and filter)
├── /orders
│   ├── / (GET - role-based, POST - create)
│   ├── /[id] (GET, PATCH, POST actions)
│   └── /[id]/tracking (GET)
├── /cart
│   ├── / (GET, POST - add item)
│   ├── /[itemId] (PATCH, DELETE)
│   └── /checkout (POST)
├── /notifications
│   ├── / (GET)
│   ├── /[id] (PATCH - mark read)
│   ├── /mark-all-read (POST)
│   └── /unread-count (GET)
├── /search (GET - global search)
└── /health (GET)
```

### 4.2 API Endpoint Groups

**Authentication Endpoints** (`/api/auth`):
- User registration, login, logout
- No authentication required
- Rate limited (5 login attempts per 15 min, 10 registrations per hour)

**Admin Endpoints** (`/api/admin`):
- Platform-wide management (users, vendors, products, orders, settlements)
- Requires ADMIN role
- Full CRUD and action capabilities
- Bulk operations support
- Analytics and audit logs

**Vendor Endpoints** (`/api/vendor`):
- Vendor profile and business management
- Vendor-specific products and earnings
- Requires VENDOR role
- Ownership validation (can only manage own resources)

**User Endpoints** (`/api/user`):
- User profile and address management
- Requires any authenticated user
- Users can only access/modify own data

**Public Product Endpoints** (`/api/products`):
- Product browsing and search
- No authentication required for GET requests
- Filtered to show only active products for non-admin users

**Order Endpoints** (`/api/orders`):
- Order creation (CUSTOMER role)
- Order management and status updates (VENDOR, ADMIN roles)
- Role-based visibility and permissions

**Cart Endpoints** (`/api/cart`):
- Shopping cart management
- Requires CUSTOMER role
- Session persistence

**Notification Endpoints** (`/api/notifications`):
- In-app notification management
- Requires authentication
- User-specific notifications only

**Search Endpoint** (`/api/search`):
- Global platform search
- Role-based result filtering
- Caching enabled

### 4.3 HTTP Methods and Actions

**Standard REST Methods**:
- **GET**: Retrieve resources (list or single)
- **POST**: Create new resources or execute actions
- **PATCH**: Update existing resources (partial updates)
- **DELETE**: Remove resources

**Action POST Pattern**:
For action endpoints, POST is used with an `action` parameter in the request body:
```json
POST /api/admin/products/[id]
{
  "action": "approve",
  "productId": "abc123"
}
```

**Response Format**:
All API responses follow a consistent structure:
```json
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "fields": { "fieldName": "Field error message" }
}
```

### 4.4 Pagination Response Structure

**Paginated List Response**:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": true
  }
}
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 20, max: 100)
- `sort`: Sort field (e.g., "createdAt", "-price" for descending)
- `filter[field]`: Filter values
- `search`: Search query string

---

## 5. Database Overview

### 5.1 Core Entities

**User Entity**:
- Primary user account table
- Stores authentication credentials
- Role assignment (CUSTOMER, VENDOR, ADMIN)
- KYC status tracking
- Relations: Vendor (1:1), Orders (1:N), Addresses (1:N)

**Vendor Entity**:
- Business profile for vendors
- Linked to User via userId
- Tier management (SOLO, MASTER, ADVANCED)
- Relations: User (1:1), Products (1:N), Orders (1:N), VendorDocuments (1:N), Settlements (1:N)

**Product Entity**:
- Product catalog
- Owned by Vendor
- Type categorization (SHEESHA_PIPE, TOBACCO_BLEND, etc.)
- Stock and pricing information
- Relations: Vendor (N:1), OrderItems (1:N)

**Order Entity**:
- Customer purchase records
- Status workflow tracking
- Rental date tracking
- Relations: User (N:1), Vendor (N:1), OrderItems (1:N), OrderTracking (1:1), Invoice (1:1)

**OrderItem Entity**:
- Line items within orders
- Price snapshot at order time
- Quantity tracking
- Relations: Order (N:1), Product (N:1)

**Settlement Entity**:
- Vendor payout records
- Commission tracking
- Status management
- Relations: Vendor (N:1)

**Address Entity**:
- User delivery addresses
- Default address support
- Relations: User (N:1)

**VendorDocument Entity**:
- KYC verification documents
- Document type and status
- Relations: Vendor (N:1)

**OrderTracking Entity**:
- Real-time order tracking
- Location and estimated delivery
- Event history
- Relations: Order (1:1)

**Invoice Entity**:
- Order invoices
- Tax calculation
- PDF storage
- Relations: Order (1:1)

**Notification Entity** (To be added):
- In-app notifications
- Read/unread status
- Notification type
- Relations: User (N:1)

**AuditLog Entity** (To be added):
- Immutable action logs
- User and resource tracking
- Before/after state
- No relations (standalone)

**Cart Entity** (To be added):
- Shopping cart items
- User-specific
- Relations: User (N:1), Product (N:1)

### 5.2 Entity Relationships

**High-Level ER Diagram**:
```
User ─┬─ 1:1 ─ Vendor ─┬─ 1:N ─ Product ─┬─ 1:N ─ OrderItem
      │                 │                  │
      │                 └─ 1:N ─ VendorDocument
      │
      ├─ 1:N ─ Address
      │
      ├─ 1:N ─ Order ─┬─ 1:N ─ OrderItem
      │               │
      │               ├─ 1:1 ─ OrderTracking
      │               │
      │               └─ 1:1 ─ Invoice
      │
      ├─ 1:N ─ Cart
      │
      └─ 1:N ─ Notification

Vendor ─ 1:N ─ Settlement
```

### 5.3 Database Indexes

**Performance Indexes**:
- User: `email` (unique), `role`, `kycStatus`
- Vendor: `userId` (unique), `slug` (unique), `tier`, `isActive`
- Product: `vendorId`, `type`, `isActive`, `sku` (unique)
- Order: `userId`, `vendorId`, `status`, `orderNumber` (unique), `createdAt`
- OrderItem: `orderId`, `productId`
- Settlement: `vendorId`, `status`, `period`
- Address: `userId`, `isDefault`
- VendorDocument: `vendorId`, `status`
- OrderTracking: `orderId` (unique)
- Invoice: `orderId` (unique)
- AuditLog: `userId`, `resourceType`, `actionType`, `createdAt`
- Notification: `userId`, `read`, `createdAt`
- Cart: `userId`, `productId`

### 5.4 Database Connection Management

**Prisma Connection Pooling**:
- Minimum connections: 5
- Maximum connections: 20
- Connection timeout: 10 seconds
- Query timeout: 10 seconds

**Connection Strategy**:
- Single Prisma Client instance (singleton pattern)
- Automatic connection management by Prisma
- Graceful disconnection on application shutdown

### 5.5 Data Consistency and Transactions

**Transaction Usage**:
- Order creation (Order + OrderItems + Cart clear)
- Bulk operations (multiple updates atomically)
- Settlement creation with commission calculation
- Checkout process (validation + order creation + cart clear)

**Consistency Rules**:
- Foreign key constraints enforced at database level
- Cascade deletes for dependent records (e.g., OrderItems when Order deleted)
- Unique constraints (email, orderNumber, sku)
- Check constraints for positive values (price, stock, quantity)

---

## 6. Security Architecture

### 6.1 Authentication System

**JWT Token Strategy**:
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: Environment variable (JWT_SECRET), minimum 32 characters
- **Expiry**: 24 hours
- **Refresh**: Token rotation every 24 hours
- **Payload**: `{ userId, email, role, iat, exp }`

**Cookie Configuration**:
- **Name**: `auth_token`
- **HttpOnly**: true (prevents JavaScript access)
- **Secure**: true in production (HTTPS only)
- **SameSite**: Strict (CSRF protection)
- **Path**: `/` (available to all routes)
- **MaxAge**: 7 days (604800 seconds)

**Authentication Flow**:
```
Request → Extract Cookie → Verify JWT → Database Lookup → Verify Active → Extract User → Continue
            ↓ Missing          ↓ Invalid       ↓ Not Found     ↓ Inactive
          401              401              401             401
```

### 6.2 Authorization System

**Role-Based Access Control (RBAC)**:

**Role Hierarchy**:
- **ADMIN**: Full platform access
- **VENDOR**: Business management access
- **CUSTOMER**: Customer-facing features

**Permission Matrix**:

| Resource | CUSTOMER | VENDOR | ADMIN |
|----------|----------|--------|-------|
| User Profile | Own | Own | All |
| Addresses | Own | Own | - |
| Products (View) | Active | Own + Active | All |
| Products (Create) | - | Own | - |
| Products (Update) | - | Own | - |
| Products (Delete) | - | Own | Admin Only |
| Products (Approve) | - | - | Admin Only |
| Orders (Create) | Own | - | - |
| Orders (View) | Own | Vendor's | All |
| Orders (Update Status) | Cancel Only | Accept/Ship | All Actions |
| Vendors (View) | - | Own | All |
| Vendors (Approve) | - | - | Admin Only |
| Settlements | - | Own | All |
| Analytics | - | Own | Platform-wide |
| Audit Logs | - | - | Admin Only |
| Users (Manage) | - | - | Admin Only |

**Ownership Validation**:
- Vendors can only access/modify their own products
- Customers can only access/modify their own orders and profile
- Vendor orders filtered by vendorId
- Cart items filtered by userId

### 6.3 Rate Limiting

**Rate Limit Configuration**:

**Authentication Endpoints**:
- Login: 5 attempts per 15 minutes per IP
- Registration: 10 attempts per hour per IP
- Password reset: 3 attempts per hour per email

**API Endpoints**:
- Authenticated users: 100 requests per minute
- Public endpoints: 50 requests per minute per IP

**Implementation**:
- In-memory rate limit store (Redis optional for distributed)
- Sliding window counter algorithm
- IP address extraction from request headers
- User ID for authenticated rate limiting

**Rate Limit Response**:
```json
HTTP 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "retryAfter": 300,
  "limit": 100,
  "remaining": 0
}
```

### 6.4 Input Validation and Sanitization

**Validation Strategy**:
- **Schema Validation**: Zod schemas for all API inputs
- **Type Validation**: TypeScript type checking
- **Format Validation**: Email (RFC 5322), phone (E.164), URLs, dates (ISO 8601)
- **Range Validation**: Min/max values, string lengths
- **Business Logic Validation**: Stock availability, ownership, status transitions

**Sanitization**:
- HTML escaping for text inputs (prevent XSS)
- SQL injection prevention via Prisma parameterized queries
- File upload validation (type, size, content)
- URL validation and sanitization

**Validation Error Response**:
```json
HTTP 400 Bad Request
{
  "error": "Validation failed",
  "fields": {
    "email": "Invalid email format",
    "price": "Must be a positive number",
    "stock": "Must be at least 0"
  }
}
```

### 6.5 Security Headers

**HTTP Security Headers**:
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains` (HSTS)
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Content-Security-Policy**: Configured for trusted sources
- **Referrer-Policy**: `strict-origin-when-cross-origin`

**CORS Configuration**:
- Whitelist specific domains (no wildcard in production)
- Allow credentials: true (for cookie-based auth)
- Allowed methods: GET, POST, PATCH, DELETE
- Allowed headers: Content-Type, Authorization

### 6.6 Password Security

**Password Hashing**:
- **Algorithm**: bcrypt
- **Salt Rounds**: 12 (configurable, minimum 10)
- **Process**: Hash generated on registration/password change
- **Verification**: Compare hashed password on login

**Password Requirements**:
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No common passwords (optional dictionary check)

**Password Management**:
- Session invalidation on password change
- Password reset token with expiry (1 hour)
- Password history prevention (optional)

### 6.7 Audit and Monitoring

**Security Logging**:
- Failed login attempts (IP, timestamp, username)
- Unauthorized access attempts (401, 403 responses)
- Rate limit violations
- Suspicious activity patterns
- Admin actions (all logged to AuditLog)

**Monitoring Alerts**:
- Multiple failed login attempts from same IP
- Unusual API access patterns
- Privilege escalation attempts
- Database connection failures
- High error rates

---

## 7. Performance Optimization

### 7.1 Caching Strategy

**Cache Layers**:

**Application-Level Caching**:
- Dashboard statistics: 5-minute TTL
- Search results: 10-minute TTL
- Product lists: 5-minute TTL
- User profile: Session-based caching

**Database Query Optimization**:
- Use Prisma `select` to fetch only needed fields
- Use Prisma `include` for eager loading (prevent N+1 queries)
- Cursor-based pagination for large datasets (>1000 records)
- Database indexes on frequently queried columns

**Cache Invalidation**:
- Time-based expiry (TTL)
- Event-based invalidation (on create, update, delete)
- Manual cache clear for admin operations

### 7.2 Query Optimization

**Best Practices**:
- Avoid SELECT * (use specific fields)
- Use indexes for WHERE, ORDER BY, JOIN columns
- Limit result sets with pagination
- Batch database operations when possible
- Use database transactions for multi-step operations

**Slow Query Monitoring**:
- Log queries exceeding 500ms
- Track query execution time
- Monitor N+1 query patterns
- Database query analysis and optimization

### 7.3 Frontend Optimization

**React Performance**:
- Server Components for static content
- Client Components for interactive elements
- Code splitting and lazy loading
- Memoization with useMemo and useCallback
- Virtual scrolling for large lists

**Asset Optimization**:
- Image optimization with Next.js Image component
- Lazy loading images
- CDN for static assets
- Minification and compression (Gzip/Brotli)

**API Call Optimization**:
- Request debouncing (300ms for search inputs)
- Request deduplication
- Optimistic UI updates
- SWR/React Query for data fetching (optional)

---

## 8. Error Handling

### 8.1 Error Types and Responses

**Validation Errors (HTTP 400)**:
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "fields": {
    "email": "Invalid email format",
    "price": "Must be greater than 0"
  }
}
```

**Authentication Errors (HTTP 401)**:
```json
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

**Authorization Errors (HTTP 403)**:
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

**Not Found Errors (HTTP 404)**:
```json
{
  "success": false,
  "error": "Product not found",
  "code": "NOT_FOUND",
  "resourceType": "Product",
  "resourceId": "abc123"
}
```

**Conflict Errors (HTTP 409)**:
```json
{
  "success": false,
  "error": "Email already exists",
  "code": "CONFLICT",
  "field": "email"
}
```

**Server Errors (HTTP 500)**:
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "requestId": "req_xyz789"
}
```

### 8.2 Error Logging

**Server-Side Logging**:
- Error details (message, stack trace, context)
- Request information (method, URL, headers, body)
- User information (userId, role, IP)
- Timestamp and request ID
- Log to console (development) or logging service (production)

**Client-Side Error Boundaries**:
- React Error Boundaries for component errors
- Global error handler for unhandled promise rejections
- User-friendly error messages
- Error reporting to backend (optional)

---

## 9. Deployment Architecture

### 9.1 Production Environment

**Hosting Platform**:
- **Option 1**: Vercel (Recommended for Next.js)
  - Automatic deployments from Git
  - Serverless function for API routes
  - Edge network and CDN
  - Environment variable management
  - Preview deployments for PRs

- **Option 2**: AWS (EC2, ECS, or Lambda)
  - EC2: Traditional VM hosting
  - ECS: Containerized deployment
  - Lambda: Serverless with API Gateway
  - RDS: PostgreSQL database

- **Option 3**: Self-hosted (VPS)
  - DigitalOcean, Linode, or similar
  - Docker containerization
  - Nginx reverse proxy
  - PM2 or similar process manager

**Database Hosting**:
- Managed PostgreSQL (Supabase, Neon, AWS RDS, or DigitalOcean Managed Database)
- Automated backups (daily, 30-day retention)
- Connection pooling enabled
- SSL/TLS encryption for connections
- Read replicas for scaling (optional)

### 9.2 Environment Configuration

**Environment Variables**:
```
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=<secure-random-string-32-chars-minimum>
JWT_EXPIRY=24h

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.sheeshatonight.com

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<api-key>
SMTP_FROM=noreply@sheeshatonight.com

# File Upload
UPLOAD_MAX_SIZE=5242880 # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW=60000 # 1 minute
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=https://sheeshatonight.com,https://www.sheeshatonight.com
```

### 9.3 CI/CD Pipeline

**Deployment Workflow**:
```
1. Code push to Git repository
2. Automated tests run
3. Build process (npm run build)
4. Deploy to staging environment
5. Automated smoke tests
6. Manual approval (optional)
7. Deploy to production
8. Health check verification
```

**GitHub Actions Example Workflow**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js
      - Install dependencies
      - Run linter
      - Run tests
      - Build application
      - Deploy to Vercel
      - Run health check
```

### 9.4 Monitoring and Observability

**Application Monitoring**:
- Error tracking (Sentry or similar)
- Performance monitoring (response times, throughput)
- Uptime monitoring (Pingdom, UptimeRobot)
- Log aggregation (Logtail, Datadog)

**Database Monitoring**:
- Query performance
- Connection pool usage
- Slow query logs
- Database size and growth

**Alerting**:
- High error rates (>5% in 5 minutes)
- Slow API responses (>1s average)
- Database connection failures
- High CPU/memory usage
- Failed deployments

### 9.5 Backup and Recovery

**Database Backups**:
- Automated daily backups
- 30-day retention policy
- Point-in-time recovery capability
- Backup verification (monthly restore tests)

**Disaster Recovery Plan**:
1. Database restore from latest backup
2. Application redeployment from Git
3. Environment variable restoration
4. DNS and SSL certificate verification
5. Smoke test execution
6. User notification (if applicable)

**Recovery Time Objective (RTO)**: 1 hour
**Recovery Point Objective (RPO)**: 24 hours

---

## 10. Frontend Architecture

### 10.1 Component Structure

**Layout Components**:
- AdminSidebar: Admin dashboard navigation
- VendorSidebar: Vendor dashboard navigation
- CustomerBottomNav: Customer mobile navigation
- Header: Top navigation bar
- RoleGuard: Component for role-based rendering

**Shared Components**:
- DataTable: Paginated table with sorting and filtering
- ActionModal: Confirmation modal for actions
- Toast: Success/error notifications
- StatCard: Dashboard metric cards
- ProductCard: Product display card
- OrderCard: Order display card
- Loader: Loading spinner
- Modal: Generic modal wrapper

**Custom Hooks**:
- useRoleGuard: Role-based access control
- useActions: API action calls with loading states
- useAuth: Authentication state management
- usePagination: Pagination state and logic

### 10.2 State Management

**Client State** (Zustand):
- User authentication state
- Current user profile
- UI state (modals, sidebars)
- Shopping cart state (local cache)

**Server State** (React Server Components):
- Database-driven data
- Dashboard statistics
- Product listings
- Order history

**Form State**:
- Local component state (useState)
- Form validation with Zod
- Error state management

### 10.3 Routing Structure

**Admin Routes** (`/admin/*`):
- Protected by AdminSidebar layout
- Requires ADMIN role
- Server-side role verification

**Vendor Routes** (`/vendor/*`):
- Protected by VendorSidebar layout
- Requires VENDOR role
- Server-side role verification

**Customer Routes** (`/customer/*`):
- Protected by CustomerBottomNav layout
- Requires CUSTOMER role
- Public product browsing allowed

**Public Routes**:
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset

---

## 11. Integration Points

### 11.1 Email Service Integration

**Email Provider Options**:
- SendGrid
- AWS SES
- Mailgun
- SMTP server

**Email Types**:
- Welcome email (vendor approval)
- Order confirmation
- Order status updates
- Vendor deactivation notice
- Password reset
- Settlement payment notification

**Email Templates**:
- HTML templates with branding
- Dynamic content injection
- Action buttons with deep links
- Responsive design for mobile

### 11.2 File Storage Integration

**Storage Options**:
- AWS S3
- Cloudinary
- DigitalOcean Spaces
- Vercel Blob Storage

**File Types**:
- Product images (JPEG, PNG)
- Vendor documents (PDF, images)
- Invoice PDFs
- User profile pictures

**Upload Flow**:
```
Frontend → Upload API → Validate File → Store in Cloud → Return URL → Save to Database
```

### 11.3 Payment Gateway Integration (Placeholder)

**Future Integration**:
- Stripe or PayPal for order payments
- Vendor payout automation
- Refund processing
- Payment status webhooks

**Current Implementation**:
- Placeholder payment methods
- Manual settlement processing
- Order creation without payment validation

---

## 12. Scalability Considerations

### 12.1 Horizontal Scaling

**Stateless API Design**:
- No server-side session storage
- JWT tokens for authentication (client-stored)
- Database for all persistent state
- Enables multiple API server instances

**Load Balancing**:
- Distribute requests across multiple servers
- Health check endpoints for load balancer
- Session affinity not required (stateless)

### 12.2 Database Scaling

**Read Replicas**:
- Separate read and write operations
- Read replicas for GET requests
- Primary database for write operations

**Connection Pooling**:
- Prisma connection pooling
- Maximum 20 connections per instance
- Connection reuse and management

**Query Optimization**:
- Proper indexing strategy
- Avoid N+1 queries
- Cursor-based pagination for large datasets
- Batch operations where possible

### 12.3 Caching Strategy

**Cache Layers**:
- Application-level caching (in-memory)
- CDN caching for static assets
- Database query result caching
- API response caching (optional Redis)

**Cache Invalidation**:
- Time-based expiry (TTL)
- Event-driven invalidation
- Manual cache clear for critical updates

---

## 13. Testing Strategy

### 13.1 Testing Levels

**Unit Tests**:
- Service layer functions
- Utility functions
- Validation schemas
- Helper functions

**Integration Tests**:
- API endpoint tests
- Database operations
- Authentication flows
- Authorization checks

**End-to-End Tests**:
- User workflows (login, order creation, product approval)
- Cross-module interactions
- UI interactions (Playwright/Cypress)

### 13.2 Test Coverage Goals

**Coverage Targets**:
- Service layer: 80%+ coverage
- API routes: 70%+ coverage
- Utilities: 90%+ coverage
- Overall: 75%+ coverage

**Critical Paths**:
- Authentication and authorization (100% coverage)
- Payment and order creation (100% coverage)
- Data validation (100% coverage)

---

## 14. Development Workflow

### 14.1 Local Development Setup

**Prerequisites**:
- Node.js 18+ and npm
- PostgreSQL database
- Git

**Setup Steps**:
```bash
1. Clone repository
2. Install dependencies: npm install
3. Copy .env.local.example to .env.local
4. Configure DATABASE_URL and JWT_SECRET
5. Run Prisma migrations: npx prisma db push
6. Seed database (optional): npx prisma db seed
7. Start development server: npm run dev
8. Open http://localhost:3000
```

### 14.2 Code Standards

**TypeScript**:
- Strict mode enabled
- No implicit any
- Type imports and exports
- Proper type definitions

**Linting**:
- ESLint with Next.js config
- Prettier for code formatting
- Pre-commit hooks (Husky)

**Naming Conventions**:
- PascalCase for components and types
- camelCase for functions and variables
- UPPER_SNAKE_CASE for constants
- kebab-case for file names

### 14.3 Git Workflow

**Branch Strategy**:
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `bugfix/*`: Bug fixes
- `hotfix/*`: Production hotfixes

**Commit Convention**:
```
feat: Add product approval workflow
fix: Resolve order status transition bug
docs: Update API documentation
refactor: Simplify authentication middleware
test: Add unit tests for user service
```

---

## 15. Documentation Requirements

### 15.1 API Documentation

**OpenAPI/Swagger Specification**:
- All endpoints documented
- Request/response schemas
- Authentication requirements
- Error responses
- Example requests and responses

**API Documentation Tools**:
- Swagger UI for interactive documentation
- Postman collection for API testing

### 15.2 Code Documentation

**JSDoc Comments**:
- Function descriptions
- Parameter types and descriptions
- Return value descriptions
- Usage examples

**README Files**:
- Project overview
- Setup instructions
- Development guidelines
- Deployment procedures

### 15.3 User Documentation

**Admin Guide**:
- User management procedures
- Vendor approval workflow
- Product moderation guidelines
- Settlement processing

**Vendor Guide**:
- Account setup
- Product listing procedures
- Order fulfillment workflow
- Earnings and settlements

**Customer Guide**:
- Account registration
- Product browsing and search
- Order placement
- Order tracking

---

## 16. Compliance and Legal

### 16.1 Data Privacy

**GDPR Compliance** (if applicable):
- User data consent
- Right to access (data export)
- Right to deletion (account deletion)
- Right to portability (data export)
- Data processing transparency
- Cookie consent (if required)

**Data Retention**:
- User data: Indefinite (until account deletion)
- Order history: 7 years (tax compliance)
- Audit logs: 2 years minimum
- Session data: 7 days
- Notifications: 90 days

### 16.2 Audit Trail

**Audit Log Requirements**:
- Immutable records
- Who, what, when, where tracking
- Before/after state for data changes
- Retention for compliance period
- Secure storage and access control

---

## 17. Future Enhancements (Out of Scope for Current Phase)

### 17.1 Advanced Features

**Phase 2 Considerations**:
- Reviews and ratings system
- Product categories and brands management
- Advanced analytics and reporting
- Mobile native applications (iOS, Android)
- Real-time chat/messaging
- Social media integration
- Multi-language support
- Advanced search with Elasticsearch
- Recommendation engine

### 17.2 Payment Integration

**Payment Gateway**:
- Stripe or PayPal integration
- Payment webhooks
- Refund processing
- Subscription management (for vendor tiers)
- Multi-currency support

### 17.3 Advanced Notifications

**Push Notifications**:
- Mobile push notifications
- Web push notifications
- SMS notifications
- WhatsApp notifications

### 17.4 Business Intelligence

**Advanced Analytics**:
- Custom report builder
- Data export (Excel, CSV, PDF)
- Predictive analytics
- Vendor performance dashboards
- Customer behavior analytics
- Revenue forecasting

---

## 18. Risk Assessment and Mitigation

### 18.1 Technical Risks

**Risk: Database Performance Degradation**
- **Mitigation**: Proper indexing, query optimization, connection pooling, read replicas
- **Monitoring**: Slow query logs, query performance metrics

**Risk: API Rate Limit Bypass**
- **Mitigation**: IP-based rate limiting, user-based limits, distributed rate limit store
- **Monitoring**: Rate limit violation alerts

**Risk: Authentication Token Compromise**
- **Mitigation**: HttpOnly cookies, short expiry, token rotation, secure transmission
- **Monitoring**: Failed authentication attempts, unusual access patterns

**Risk: Data Loss**
- **Mitigation**: Daily automated backups, point-in-time recovery, backup verification
- **Monitoring**: Backup success/failure alerts, periodic restore tests

### 18.2 Business Risks

**Risk: Vendor Fraud**
- **Mitigation**: KYC verification, document approval, performance monitoring
- **Monitoring**: Order cancellation rates, customer complaints, settlement disputes

**Risk: System Downtime**
- **Mitigation**: High availability architecture, automatic failover, health checks
- **Monitoring**: Uptime monitoring, automatic alerts, incident response plan

**Risk: Data Breach**
- **Mitigation**: Encryption at rest and in transit, access controls, audit logging
- **Monitoring**: Security scanning, intrusion detection, audit log analysis

---

## 19. System Boundaries and Limitations

### 19.1 Current Limitations

**Performance Limits**:
- Maximum 100 records per bulk operation
- Maximum 5MB file upload size
- API rate limit: 100 requests/minute per user
- Search result limit: 1000 records

**Feature Limitations**:
- No real-time payment processing (placeholder only)
- No real-time chat/messaging
- No mobile push notifications
- Single currency support (AED)
- Single language (English with locale field)

### 19.2 External Dependencies

**Required Services**:
- PostgreSQL database (managed or self-hosted)
- Email service provider (SendGrid, AWS SES, etc.)
- File storage service (AWS S3, Cloudinary, etc.)
- Hosting platform (Vercel, AWS, etc.)

**Optional Services**:
- Redis for distributed caching and rate limiting
- Sentry for error tracking
- Analytics service (Google Analytics, Mixpanel)
- CDN for static asset delivery

---

## 20. Glossary of Architectural Terms

**Monolithic Architecture**: Single unified application containing frontend, backend, and data access layers

**Serverless Functions**: Stateless compute functions that run on-demand (Next.js API routes)

**ORM (Object-Relational Mapping)**: Database abstraction layer (Prisma)

**JWT (JSON Web Token)**: Token-based authentication mechanism

**RBAC (Role-Based Access Control)**: Authorization based on user roles

**CORS (Cross-Origin Resource Sharing)**: Security mechanism for cross-domain requests

**HttpOnly Cookie**: Cookie that cannot be accessed by JavaScript (XSS protection)

**Rate Limiting**: Throttling mechanism to prevent API abuse

**Pagination**: Breaking large datasets into pages

**Optimistic Update**: UI update before server confirmation

**Soft Delete**: Marking records as deleted without removing from database

**Audit Log**: Immutable record of system actions for compliance

**N+1 Query**: Performance anti-pattern where related data causes multiple queries

**Connection Pooling**: Reusing database connections for performance

**CDN (Content Delivery Network)**: Distributed network for serving static assets

---

## 21. Summary

This high-level design document outlines the architecture for the Complete CRUD & Action System for SheeshaTonight platform. The system follows a monolithic full-stack architecture using Next.js 14, React 18, Prisma ORM, and PostgreSQL.

**Key Architectural Decisions**:
1. **Monolithic Architecture**: Simplifies deployment and development while maintaining clear separation of concerns
2. **JWT Authentication with HttpOnly Cookies**: Secure, stateless authentication
3. **Role-Based Access Control**: Three-tier permission model (CUSTOMER, VENDOR, ADMIN)
4. **Prisma ORM**: Type-safe database access with migration support
5. **API-First Design**: RESTful API routes with consistent response format
6. **Caching Strategy**: Multi-layer caching for performance optimization
7. **Audit Logging**: Comprehensive tracking for compliance and security
8. **Rate Limiting**: Protection against abuse and DDoS attacks
9. **Validation with Zod**: Schema-based input validation
10. **Serverless Deployment**: Scalable hosting on Vercel or similar platforms

**Production Readiness**:
- Complete elimination of mock data
- Database-backed all features
- Comprehensive error handling
- Security hardening with JWT, rate limiting, and HTTPS
- Performance optimization with caching and indexing
- Monitoring and observability
- Backup and disaster recovery procedures

**Next Steps**:
1. Review and approve this high-level design
2. Proceed to detailed technical design document
3. Create implementation task breakdown
4. Begin phased development (Security → CRUD → Actions → Polish → Testing)

This architecture provides a solid foundation for a production-ready, scalable, and secure e-commerce platform.
