# Tasks

## Task 1: Foundation and Infrastructure Setup

Set up the foundational infrastructure including database schema, core libraries, and authentication system.

### Task 1.1: Update Database Schema

Update Prisma schema with all missing tables and fields required by the specification.
- Add missing tables: Cart, Notification, AuditLog
- Add missing fields to existing tables (Product.isFeatured, User.status, Order timestamps)
- Add proper indexes for performance
- Generate Prisma Client and run database migration

### Task 1.2: Create Core Library Files

Create foundational library files for authentication, validation, and utilities.
- Create `lib/prisma.ts` with singleton Prisma client
- Create `lib/auth.ts` with JWT utilities and password hashing
- Create `lib/validation.ts` with Zod schemas
- Create `lib/rate-limit.ts` with rate limiting logic
- Create `lib/utils.ts` with common helper functions
- Update `lib/middleware.ts` for cookie-based auth with database verification

### Task 1.3: Implement Authentication API Routes

Implement complete authentication system with JWT and cookies.
- Update `app/api/auth/register/route.ts` with validation, rate limiting, and audit logging
- Update `app/api/auth/login/route.ts` with rate limiting and audit logging
- Verify `app/api/auth/logout/route.ts` works correctly
- Create `app/api/auth/me/route.ts` for getting current user
- Test authentication flow end-to-end

## Task 2: User Management Module

Implement user profile, address management, and admin user management endpoints.

### Task 2.1: Create User Profile API

Implement user profile management endpoints.
- Create `app/api/user/profile/route.ts` (GET, PATCH)
- Validate profile updates (name, phone, dob, locale)
- Prevent role modification by users
- Add proper error handling and validation

### Task 2.2: Create Address Management API

Implement address CRUD operations.
- Create `app/api/user/addresses/route.ts` (GET, POST)
- Create `app/api/user/addresses/[id]/route.ts` (PATCH, DELETE)
- Implement default address handling (auto-toggle other addresses)
- Add address validation

### Task 2.3: Create Admin User Management API

Implement admin endpoints for user management.
- Create `app/api/admin/users/route.ts` (GET with pagination, filtering, sorting, search)
- Create `app/api/admin/users/[userId]/route.ts` (GET, PATCH)
- Implement KYC status updates
- Add audit logging for admin actions

## Task 3: Product Management Module

Implement product CRUD operations, search functionality, and action workflows.

### Task 3.1: Create Vendor Product CRUD API

Implement vendor product management endpoints.
- Create `app/api/vendor/products/route.ts` (GET, POST)
- Create `app/api/vendor/products/[id]/route.ts` (GET, PATCH, DELETE)
- Implement ownership validation
- Add pagination, filtering, sorting
- Add product validation (title, description, type, price, stock, images)

### Task 3.2: Create Public Product API

Implement public product browsing and search endpoints.
- Create `app/api/products/route.ts` (GET with filtering, only active products)
- Create `app/api/products/[id]/route.ts` (GET with vendor info)
- Create `app/api/products/search/route.ts` (GET with full-text search, price range filter)
- Add search result caching (10-minute TTL)

### Task 3.3: Create Admin Product Management API

Implement admin product endpoints.
- Create `app/api/admin/products/route.ts` (GET all products with admin filters)
- Create `app/api/admin/products/[productId]/route.ts` (GET, DELETE)
- Add pagination and advanced filtering

### Task 3.4: Implement Product Action System

Implement product action workflows (approve, reject, feature, delete).
- Add POST action handler in `app/api/admin/products/[productId]/route.ts`
- Implement approve action (set isActive=true, approvedAt timestamp)
- Implement reject action (set isActive=false, rejectedAt timestamp)
- Implement feature/unfeature actions (toggle isFeatured)
- Implement soft delete (set deletedAt timestamp)
- Add audit logging for all actions
- Create notifications for vendor

### Task 3.5: Implement Bulk Product Actions

Implement bulk product operations.
- Create `app/api/admin/products/bulk/route.ts`
- Support bulk approve, reject, delete, feature, unfeature
- Implement transaction-based execution
- Add validation for max 100 records
- Return detailed success/failure results
- Create audit logs for each affected product

## Task 4: Order Management Module

Implement order creation, listing, tracking, and action workflows.

### Task 4.1: Create Order Creation API

Implement order creation endpoint for customers.
- Create `app/api/orders/route.ts` (POST)
- Generate unique orderNumber (ORD-YYYY-NNNN format)
- Create Order and OrderItem records
- Validate products, vendor, and stock availability
- Calculate order totals
- Return order confirmation

### Task 4.2: Create Order Listing API

Implement role-based order listing.
- Add GET handler to `app/api/orders/route.ts`
- Implement role-based filtering (customers see own, vendors see their orders, admins see all)
- Add pagination, filtering by status/date range/vendor
- Add sorting by createdAt, totalAmount, deliveryDate
- Include related data (OrderItems, Products, Vendor)

### Task 4.3: Create Order Details and Updates API

Implement order detail retrieval and updates.
- Create `app/api/orders/[id]/route.ts` (GET, PATCH)
- Implement role-based access control
- Allow customers/vendors to update notes and rental dates
- Include all related information (items, tracking, invoice)

### Task 4.4: Create Order Tracking API

Implement order tracking endpoint.
- Create `app/api/orders/[id]/tracking/route.ts` (GET)
- Return tracking information with location and estimated delivery
- Include order status history

### Task 4.5: Implement Order Action System

Implement order status workflow actions.
- Add POST action handler in `app/api/orders/[id]/route.ts`
- Implement accept action (VENDOR: PREPARING → READY_FOR_PICKUP)
- Implement decline action (VENDOR: PREPARING → CANCELLED)
- Implement ship action (VENDOR: READY_FOR_PICKUP → OUT_FOR_DELIVERY)
- Implement deliver action (VENDOR: OUT_FOR_DELIVERY → DELIVERED)
- Implement cancel action (CUSTOMER: PREPARING/READY_FOR_PICKUP → CANCELLED)
- Validate status transitions
- Create OrderTracking events
- Send notifications to customer and vendor

### Task 4.6: Implement Bulk Order Actions

Implement bulk order operations.
- Create `app/api/admin/orders/bulk/route.ts`
- Support bulk accept, cancel, ship actions
- Implement transaction-based execution
- Validate status transitions for each order
- Return detailed results

## Task 5: Vendor Management Module

Implement vendor profile, document management, and action workflows.

### Task 5.1: Create Vendor Profile API

Implement vendor profile management.
- Create `app/api/vendor/profile/route.ts` (GET, PATCH)
- Allow vendors to update name, description, location, phone
- Return vendor with user information

### Task 5.2: Create Vendor Document Upload API

Implement vendor KYC document upload.
- Create `app/api/vendor/documents/route.ts` (GET, POST)
- Validate document type (TRADE_LICENSE, IDENTITY, BUSINESS_REGISTRATION, TAX_CERTIFICATE)
- Store document URLs
- Set initial status to PENDING
- Validate file uploads (type, size, content)

### Task 5.3: Create Admin Vendor Management API

Implement admin vendor endpoints.
- Create `app/api/admin/vendors/route.ts` (GET with pagination, filtering, sorting, search)
- Create `app/api/admin/vendors/[vendorId]/route.ts` (GET, PATCH)
- Support filtering by tier, isActive, verification status
- Include user and document information
- Allow tier updates

### Task 5.4: Create Vendor Document Review API

Implement admin vendor document retrieval.
- Create `app/api/admin/vendors/[vendorId]/documents/route.ts` (GET)
- Return all VendorDocument records for vendor
- Include document status and details

### Task 5.5: Implement Vendor Action System

Implement vendor action workflows.
- Add POST action handler in `app/api/admin/vendors/[vendorId]/route.ts`
- Implement approve action (update kycStatus to APPROVED, set kycApprovedAt)
- Implement reject action (update kycStatus to REJECTED, set kycRejectedAt)
- Implement activate action (set isActive=true)
- Implement deactivate action (set isActive=false, disable all vendor products)
- Send email notifications (welcome email on approval, deactivation notice)
- Create audit logs
- Create in-app notifications

### Task 5.6: Implement Bulk Vendor Actions

Implement bulk vendor operations.
- Create `app/api/admin/vendors/bulk/route.ts`
- Support bulk approve, reject, activate, deactivate
- Implement transaction-based execution
- Send notifications for each vendor
- Return detailed results

## Task 6: Cart and Checkout Module

Implement shopping cart management and checkout process.

### Task 6.1: Create Cart Management API

Implement shopping cart CRUD operations.
- Create `app/api/cart/route.ts` (GET, POST)
- Validate product availability and stock before adding
- Return cart with product details, current prices, and totals
- Persist cart in database by userId

### Task 6.2: Create Cart Item Updates API

Implement cart item updates and removal.
- Create `app/api/cart/[itemId]/route.ts` (PATCH, DELETE)
- Validate quantity updates against stock
- Return updated cart with recalculated totals

### Task 6.3: Create Checkout API

Implement checkout process creating order from cart.
- Create `app/api/cart/checkout/route.ts` (POST)
- Validate all cart items have sufficient stock
- Use database transaction for atomicity
- Create Order and OrderItem records
- Clear cart after successful checkout
- Calculate totals (subtotal, tax, delivery fees)
- Return order confirmation

## Task 7: Settlement and Financial Management Module

Implement vendor settlements, payouts, and invoice generation.

### Task 7.1: Create Settlement Management API

Implement admin settlement endpoints.
- Create `app/api/admin/settlements/route.ts` (GET, POST)
- Implement pagination, filtering by vendor/status/period
- Calculate settlement amounts from completed orders minus commission
- Validate settlement data

### Task 7.2: Create Settlement Status Updates API

Implement settlement status transitions.
- Create `app/api/admin/settlements/[id]/route.ts` (GET, PATCH)
- Update settlement status
- Record paidAt timestamp when status changes to PAID
- Add audit logging

### Task 7.3: Create Vendor Settlements API

Implement vendor settlement and earnings endpoints.
- Create `app/api/vendor/settlements/route.ts` (GET)
- Create `app/api/vendor/earnings/summary/route.ts` (GET)
- Return vendor-specific settlement history
- Calculate total earnings, pending settlements, paid amounts
- Implement caching (5-minute TTL)

### Task 7.4: Implement Settlement Invoice Generation

Implement invoice PDF generation.
- Add invoice generation endpoint (GET with PDF response)
- Include vendor info, order details, commission breakdown
- Generate PDF using library (e.g., pdf-lib or puppeteer)

## Task 8: Analytics and Dashboard Module

Implement dashboard statistics and analytics for all user roles.

### Task 8.1: Create Admin Dashboard Statistics API

Implement admin dashboard statistics endpoint.
- Create `app/api/admin/stats/route.ts` (GET)
- Calculate total users, vendors, products, orders
- Calculate revenue metrics (total, monthly, pending settlements)
- Implement caching (5-minute TTL)
- Return real database-driven data (no mock data)

### Task 8.2: Create Admin Analytics API

Implement admin analytics with time-series data.
- Create `app/api/admin/analytics/route.ts` (GET)
- Support date range filtering
- Return time-series data for revenue, orders, users
- Implement efficient database aggregations

### Task 8.3: Create Vendor Dashboard API

Implement vendor dashboard statistics endpoint.
- Create `app/api/vendor/dashboard/route.ts` (GET)
- Calculate total sales, active products, pending orders, earnings
- Implement caching (5-minute TTL)
- Return vendor-specific metrics

### Task 8.4: Create Vendor Analytics API

Implement vendor analytics with product performance.
- Create `app/api/vendor/analytics/route.ts` (GET)
- Support date range filtering
- Return product performance breakdown
- Return sales trends over time

### Task 8.5: Create Customer Dashboard API

Implement customer dashboard endpoint.
- Create `app/api/customer/dashboard/route.ts` (GET)
- Return order history summary
- Calculate total orders, active rentals, total spent
- Implement caching

## Task 9: Notification System

Implement in-app notifications, email notifications, and notification preferences.

### Task 9.1: Create Notification Management API

Implement notification CRUD endpoints.
- Create `app/api/notifications/route.ts` (GET with pagination)
- Support filtering by read/unread status and type
- Return user-specific notifications only

### Task 9.2: Create Notification Actions API

Implement notification update endpoints.
- Create `app/api/notifications/[id]/route.ts` (PATCH to mark as read)
- Create `app/api/notifications/mark-all-read/route.ts` (POST)
- Create `app/api/notifications/unread-count/route.ts` (GET)
- Update notification status properly

### Task 9.3: Create Email Notification Service

Implement email sending functionality.
- Create email service in `lib/email.ts`
- Create branded HTML email templates
- Integrate with email provider (e.g., SendGrid, AWS SES)
- Send emails for key events (vendor approval, order status, etc.)

### Task 9.4: Create Notification Preferences API

Implement notification preference management.
- Create `app/api/user/notification-preferences/route.ts` (GET, PATCH)
- Allow users to opt-in/opt-out of notification types
- Respect preferences when creating notifications

### Task 9.5: Create Notification Cleanup Job

Implement automatic cleanup of old notifications.
- Create cleanup utility to delete notifications older than 90 days
- Can be triggered manually or via cron job

## Task 10: Audit Logging System

Implement comprehensive audit logging for compliance and security.

### Task 10.1: Create Audit Log Service

Implement audit log creation functionality.
- Create audit service in `lib/audit.ts`
- Create immutable audit log entries for admin actions
- Capture userId, action type, resource type, resource ID, timestamp, IP, user agent
- Record before/after state for data changes

### Task 10.2: Create Audit Log Retrieval API

Implement audit log query endpoint.
- Create `app/api/admin/audit-logs/route.ts` (GET)
- Implement pagination
- Support filtering by userId, action type, resource type, date range
- Support sorting by timestamp (descending)
- Admin-only access

### Task 10.3: Create Audit Log Export API

Implement audit log CSV export.
- Add CSV export endpoint to audit logs route
- Generate CSV with all audit log fields
- Stream large datasets

### Task 10.4: Integrate Audit Logging Across Actions

Add audit logging to all action endpoints.
- Update all admin action handlers to create audit logs
- Log product actions (approve, reject, feature, delete)
- Log vendor actions (approve, reject, activate, deactivate)
- Log order actions (accept, decline, ship, deliver, cancel)
- Log bulk operations
- Log failed authentication attempts

## Task 11: Search and Filtering Infrastructure

Implement global search, product search, and autocomplete functionality.

### Task 11.1: Create Global Search API

Implement global platform search.
- Create `app/api/search/route.ts` (GET)
- Search across products (title, description), vendors (name), orders (orderNumber)
- Return results with resource type, ID, title, relevance score
- Implement role-based filtering
- Add search result caching (10-minute TTL)

### Task 11.2: Create Search Autocomplete API

Implement search autocomplete suggestions.
- Create `app/api/search/autocomplete/route.ts` (GET)
- Return suggestions based on popular searches
- Implement prefix matching
- Add caching

### Task 11.3: Implement Search Analytics

Log and track search queries.
- Log search terms and result counts
- Store in database or analytics service
- Use for improving autocomplete

## Task 12: Security Hardening

Implement comprehensive security measures including rate limiting, headers, and input sanitization.

### Task 12.1: Implement Enhanced Rate Limiting

Implement comprehensive rate limiting across all endpoints.
- Apply 100 req/min limit to authenticated API endpoints
- Apply 50 req/min limit to public endpoints
- Ensure proper rate limit headers in responses
- Test rate limiting functionality

### Task 12.2: Configure Security Headers

Add security headers to all responses.
- Implement HSTS, X-Content-Type-Options, X-Frame-Options, CSP
- Configure CORS with domain whitelist
- Add Referrer-Policy
- Test security headers

### Task 12.3: Implement Input Sanitization

Implement comprehensive input sanitization.
- Add HTML escaping for text inputs (XSS prevention)
- Validate file uploads (type, size, malware scan)
- Validate URLs and sanitize
- Review all Zod schemas for completeness

### Task 12.4: Enhance Password Security

Enforce strong password requirements.
- Update password validation (min 12 chars, uppercase, lowercase, number, special char)
- Ensure bcrypt salt rounds = 12
- Implement password change invalidates all sessions
- Test password security

### Task 12.5: Implement JWT Token Rotation

Implement JWT token refresh mechanism.
- Add token rotation every 24 hours
- Create refresh token endpoint if needed
- Invalidate old tokens on rotation

## Task 13: Frontend Integration

Update all frontend pages to use real API calls and remove mock data.

### Task 13.1: Update Admin Dashboard Pages

Replace all mock data in admin dashboard with real API calls.
- Update `/app/admin/dashboard/page.tsx` to use API
- Update `/app/admin/users/page.tsx` to use API
- Update `/app/admin/vendors/page.tsx` to use API
- Update `/app/admin/products/page.tsx` to use API
- Update `/app/admin/orders/page.tsx` to use API
- Update `/app/admin/finance/page.tsx` (settlements) to use API
- Update `/app/admin/analytics/page.tsx` to use API
- Add loading states and error boundaries

### Task 13.2: Update Vendor Dashboard Pages

Replace all mock data in vendor dashboard with real API calls.
- Update vendor dashboard to use real API
- Update vendor products page to use API
- Update vendor orders page to use API
- Update vendor analytics page to use API
- Add loading states and error boundaries

### Task 13.3: Implement Action Buttons with Modals

Add action buttons with confirmation modals across all admin and vendor pages.
- Create reusable Action Modal component
- Add approve/reject/feature/delete buttons to product management
- Add approve/reject/activate/deactivate buttons to vendor management
- Add accept/decline/ship/deliver/cancel buttons to order management
- Add loading states and optimistic updates
- Display toast notifications on success/failure

### Task 13.4: Implement Bulk Action UI

Add bulk action functionality to admin pages.
- Add multi-select checkboxes to product, vendor, order tables
- Add bulk action dropdown/buttons
- Implement bulk confirmation modal
- Display bulk operation results (success/failure counts)
- Add optimistic UI updates

### Task 13.5: Implement Pagination and Filtering UI

Add pagination and filtering controls to all list pages.
- Create reusable Pagination component
- Create Filter controls (dropdowns, date pickers, search input)
- Implement infinite scroll or load-more option
- Debounce search inputs (300ms)
- Update URL query params for filter state

### Task 13.6: Update Customer Pages

Replace all mock data in customer-facing pages with real API calls.
- Update product browsing pages to use API
- Update cart page to use API
- Update checkout page to use API
- Update order history page to use API
- Update customer dashboard to use API
- Add loading states and error boundaries

### Task 13.7: Remove Mock Data Constants

Delete all mock data from codebase.
- Identify and remove mock data from `lib/constants.ts` or similar files
- Search codebase for hardcoded test data
- Ensure all pages use real API data
- Verify no mock data in production build

### Task 13.8: Implement Error Boundaries

Add error boundaries to gracefully handle API failures.
- Create Error Boundary components
- Wrap pages and sections with error boundaries
- Display user-friendly error messages
- Add retry mechanisms
- Log errors for debugging

## Task 14: Testing and Quality Assurance

Comprehensive testing of all modules and functionality.

### Task 14.1: API Integration Testing

Test all API endpoints end-to-end.
- Test authentication flow (register, login, logout)
- Test CRUD operations for all entities
- Test action workflows (approve, reject, etc.)
- Test role-based access control
- Test pagination, filtering, sorting
- Test error handling and validation
- Verify audit logging

### Task 14.2: Frontend Integration Testing

Test frontend pages and user flows.
- Test admin dashboard all pages
- Test vendor dashboard all pages
- Test customer pages
- Test action buttons and modals
- Test bulk operations
- Test pagination and filtering
- Test loading states and error handling

### Task 14.3: Security Testing

Verify security measures are working.
- Test JWT authentication and authorization
- Test rate limiting (manual or automated)
- Test input validation and sanitization
- Test password requirements
- Verify security headers
- Test CORS configuration
- Attempt common attacks (XSS, SQL injection, CSRF)

### Task 14.4: Performance Testing

Test system performance under load.
- Test API response times (target: 95% < 500ms)
- Test database query performance
- Test caching effectiveness
- Test pagination with large datasets
- Identify and optimize slow queries

### Task 14.5: Database Migration Testing

Test database migrations in clean environment.
- Test migration from scratch
- Test migration rollback
- Verify all indexes created
- Verify all constraints enforced
- Test data integrity

## Task 15: Production Readiness

Final production configuration, optimization, and launch verification.

### Task 15.1: Configure Production Environment

Set up production environment variables and configuration.
- Document all required environment variables
- Set up production database connection
- Configure JWT secret (minimum 32 characters)
- Configure email service credentials
- Set up CORS whitelist
- Configure rate limiting settings
- Enable HTTPS and secure cookies

### Task 15.2: Optimize Database for Production

Optimize database for production.
- Review and add missing indexes
- Configure connection pooling (min 5, max 20)
- Set query timeouts (10 seconds)
- Enable slow query logging (> 500ms)
- Test database performance under load

### Task 15.3: Setup Error Logging and Monitoring

Set up error logging and monitoring.
- Integrate error tracking service (e.g., Sentry)
- Log slow queries and database errors
- Log authentication failures
- Set up alerts for critical errors
- Test error logging

### Task 15.4: Verify Build and Deployment

Verify production build and deployment.
- Run production build (`npm run build`)
- Verify TypeScript strict mode passes with zero errors
- Test production build locally
- Verify no mock data in production build
- Test deployment to staging environment
- Run smoke tests on staging

### Task 15.5: Create Production Documentation

Create production documentation.
- Document API endpoints (OpenAPI/Swagger)
- Document environment variables
- Document deployment process
- Document database schema
- Create admin user guide
- Create vendor user guide

### Task 15.6: Complete Final Production Launch Checklist

Complete final launch verification.
- Verify all requirements met (Requirements 1-20)
- Verify all mock data removed
- Verify security measures in place
- Verify error handling works
- Verify audit logging enabled
- Run full regression test suite
- Get stakeholder sign-off
- Deploy to production
