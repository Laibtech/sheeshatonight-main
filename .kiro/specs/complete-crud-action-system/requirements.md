# Requirements Document

## Introduction

This document specifies the complete CRUD (Create, Read, Update, Delete) and Action System implementation for the SheeshaTonight e-commerce platform. The system will transform the platform from 40% production readiness to a fully functional, database-backed, launchable application with no mock data or placeholders.

SheeshaTonight is a Next.js 14-based premium sheesha rental and marketplace platform for UAE/UK markets. The platform serves three user roles (CUSTOMER, VENDOR, ADMIN) and requires comprehensive CRUD operations across 15+ modules including users, vendors, products, orders, settlements, reviews, categories, inventory, and more.

The implementation will provide:
- Complete CRUD API routes for all database entities
- Action systems with approve/reject/delete/toggle workflows
- Real-time database integration replacing all mock data
- Security-hardened endpoints with JWT validation and role-based authorization
- Optimized database queries with pagination, filtering, sorting, and search
- Production-ready error handling, validation, and audit logging

## Glossary

- **CRUD_System**: The complete Create, Read, Update, Delete API implementation across all platform modules
- **Action_System**: Button-based workflow controls (approve, reject, delete, activate, deactivate, feature) with confirmation modals
- **API_Route**: Next.js API route handler in app/api directory providing HTTP endpoints
- **Database**: PostgreSQL database accessed through Prisma ORM
- **JWT_Token**: JSON Web Token stored in HttpOnly cookie for authentication
- **Role**: User permission level (CUSTOMER, VENDOR, ADMIN) determining access rights
- **Mock_Data**: Hardcoded test data in constants files that must be removed
- **Pagination**: Database query limiting results to pages (default 20 items per page)
- **Validation_Schema**: Zod schema defining input validation rules
- **Audit_Log**: Database record of administrative actions for compliance and security
- **Protected_Route**: API endpoint requiring authentication and authorization
- **Bulk_Action**: Operation performed on multiple selected records simultaneously
- **Optimistic_Update**: UI update before API response for perceived performance
- **Toast_Notification**: Temporary success/error message displayed to user
- **Loading_State**: UI indicator showing operation in progress
- **Prisma**: ORM (Object-Relational Mapping) library for type-safe database access
- **Rate_Limiting**: Request throttling to prevent API abuse
- **Server_Validation**: Backend JWT verification with database user lookup
- **Action_Modal**: Confirmation dialog before executing destructive or important actions


## Requirements

### Requirement 1: Authentication and Authorization Infrastructure

**User Story:** As a platform administrator, I want all API endpoints to validate user authentication and authorization, so that only legitimate users with appropriate permissions can access protected resources.

#### Acceptance Criteria

1. THE CRUD_System SHALL validate JWT_Token on all protected API_Route requests
2. WHEN a JWT_Token is missing or invalid, THE CRUD_System SHALL return HTTP 401 Unauthorized
3. THE CRUD_System SHALL perform database user lookup to verify user exists and is active
4. WHEN a user role does not match required permissions, THE CRUD_System SHALL return HTTP 403 Forbidden
5. THE CRUD_System SHALL extract user identity from verified JWT_Token for all database operations
6. THE CRUD_System SHALL store JWT_Token in HttpOnly secure cookies with SameSite=Strict
7. WHEN a JWT_Token expires, THE CRUD_System SHALL return HTTP 401 and clear the cookie
8. THE CRUD_System SHALL implement rate limiting of 100 requests per minute per IP address
9. FOR ALL authentication operations, THE CRUD_System SHALL log failed attempts with IP address and timestamp
10. THE CRUD_System SHALL never expose JWT_Token in JSON response bodies


### Requirement 2: Product CRUD Operations

**User Story:** As a vendor, I want to create, read, update, and delete my products, so that I can manage my product catalog and inventory.

#### Acceptance Criteria

1. WHEN authenticated as VENDOR, THE CRUD_System SHALL allow POST to /api/vendor/products to create new products
2. THE CRUD_System SHALL validate product creation data against Validation_Schema (title, description, type, price, stock, images)
3. WHEN creating a product, THE CRUD_System SHALL associate it with the authenticated vendor's vendorId
4. THE CRUD_System SHALL support GET /api/vendor/products with Pagination (20 items per page)
5. THE CRUD_System SHALL support filtering products by type, active status, and stock level
6. THE CRUD_System SHALL support sorting products by createdAt, price, and stock
7. WHEN authenticated as VENDOR, THE CRUD_System SHALL allow PATCH /api/vendor/products/[id] to update owned products
8. THE CRUD_System SHALL prevent vendors from updating products they do not own
9. WHEN authenticated as VENDOR, THE CRUD_System SHALL allow DELETE /api/vendor/products/[id] for owned products
10. THE CRUD_System SHALL support GET /api/products/[id] for public product details access
11. THE CRUD_System SHALL support GET /api/products with search by title, description, and filtering by price range
12. THE CRUD_System SHALL return products with vendor information included in response


### Requirement 3: Order CRUD Operations

**User Story:** As a customer, I want to create orders and track their status, so that I can purchase products and monitor delivery.

#### Acceptance Criteria

1. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL allow POST to /api/orders to create new orders
2. THE CRUD_System SHALL validate order creation data including userId, vendorId, items array, totalAmount, and rentalStartDate
3. THE CRUD_System SHALL generate unique orderNumber in format ORD-YYYY-NNNN for each new order
4. THE CRUD_System SHALL create OrderItem records for each product in the order with quantity and price snapshot
5. THE CRUD_System SHALL support GET /api/orders with role-based filtering (customers see own orders, vendors see their vendor orders, admins see all)
6. THE CRUD_System SHALL support Pagination for order lists with 20 items per page
7. THE CRUD_System SHALL support filtering orders by status, date range, and vendorId
8. THE CRUD_System SHALL support sorting orders by createdAt, totalAmount, and deliveryDate
9. THE CRUD_System SHALL support GET /api/orders/[id] with role-based access control
10. WHEN authenticated as CUSTOMER or VENDOR, THE CRUD_System SHALL allow PATCH /api/orders/[id] to update order notes and rental dates
11. THE CRUD_System SHALL return orders with related OrderItem, Product, and Vendor information included
12. THE CRUD_System SHALL support GET /api/orders/[id]/tracking for real-time order tracking information


### Requirement 4: Vendor Management CRUD Operations

**User Story:** As an administrator, I want to manage vendor accounts and approvals, so that only legitimate businesses can sell on the platform.

#### Acceptance Criteria

1. WHEN authenticated as ADMIN, THE CRUD_System SHALL support GET /api/admin/vendors with Pagination
2. THE CRUD_System SHALL support filtering vendors by tier (SOLO, MASTER, ADVANCED), isActive status, and verification status
3. THE CRUD_System SHALL support sorting vendors by createdAt, tier, and name
4. THE CRUD_System SHALL support searching vendors by name, email, and phone
5. WHEN authenticated as ADMIN, THE CRUD_System SHALL support GET /api/admin/vendors/[id] with complete vendor details including user and documents
6. WHEN authenticated as ADMIN, THE CRUD_System SHALL support PATCH /api/admin/vendors/[id] to update vendor tier, planExpiry, and location
7. THE CRUD_System SHALL support GET /api/admin/vendors/[id]/documents to retrieve all VendorDocument records
8. WHEN authenticated as VENDOR, THE CRUD_System SHALL support GET /api/vendor/profile for own vendor information
9. WHEN authenticated as VENDOR, THE CRUD_System SHALL support PATCH /api/vendor/profile to update name, description, location, and phone
10. WHEN authenticated as VENDOR, THE CRUD_System SHALL support POST /api/vendor/documents to upload new verification documents
11. THE CRUD_System SHALL validate document uploads for type (TRADE_LICENSE, IDENTITY, BUSINESS_REGISTRATION, TAX_CERTIFICATE)
12. THE CRUD_System SHALL store document URLs and set initial status to PENDING


### Requirement 5: User Management CRUD Operations

**User Story:** As an administrator, I want to manage user accounts and permissions, so that I can maintain platform security and user quality.

#### Acceptance Criteria

1. WHEN authenticated as ADMIN, THE CRUD_System SHALL support GET /api/admin/users with Pagination of 20 users per page
2. THE CRUD_System SHALL support filtering users by role (CUSTOMER, VENDOR, ADMIN), verified status, and kycStatus
3. THE CRUD_System SHALL support sorting users by createdAt, name, and email
4. THE CRUD_System SHALL support searching users by name, email, and phone
5. WHEN authenticated as ADMIN, THE CRUD_System SHALL support GET /api/admin/users/[id] with complete user details
6. WHEN authenticated as ADMIN, THE CRUD_System SHALL support PATCH /api/admin/users/[id] to update kycStatus and verified status
7. WHEN authenticated as CUSTOMER or VENDOR, THE CRUD_System SHALL support GET /api/user/profile for own user information
8. WHEN authenticated as CUSTOMER or VENDOR, THE CRUD_System SHALL support PATCH /api/user/profile to update name, phone, dob, and locale
9. THE CRUD_System SHALL prevent users from modifying their own role through any API endpoint
10. WHEN authenticated, THE CRUD_System SHALL support GET /api/user/addresses to retrieve all saved addresses
11. WHEN authenticated, THE CRUD_System SHALL support POST /api/user/addresses to create new addresses
12. WHEN authenticated, THE CRUD_System SHALL support PATCH /api/user/addresses/[id] to update address details and isDefault flag
13. WHEN setting isDefault to true on an address, THE CRUD_System SHALL set all other user addresses isDefault to false
14. WHEN authenticated, THE CRUD_System SHALL support DELETE /api/user/addresses/[id] to remove saved addresses


### Requirement 6: Product Action System

**User Story:** As an administrator, I want to approve, reject, feature, and delete products, so that I can curate the marketplace and maintain quality standards.

#### Acceptance Criteria

1. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/products/[id] with action "approve"
2. WHEN approve action is executed, THE Action_System SHALL update product isActive to true and record approvedAt timestamp
3. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/products/[id] with action "reject"
4. WHEN reject action is executed, THE Action_System SHALL update product isActive to false and record rejectedAt timestamp
5. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/products/[id] with action "feature"
6. WHEN feature action is executed, THE Action_System SHALL set product isFeatured to true
7. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/products/[id] with action "unfeature"
8. WHEN unfeature action is executed, THE Action_System SHALL set product isFeatured to false
9. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/products/[id] with action "delete"
10. WHEN delete action is executed, THE Action_System SHALL soft delete the product by setting deletedAt timestamp
11. FOR ALL product actions, THE Action_System SHALL create Audit_Log entries recording admin userId, action type, productId, and timestamp
12. THE Action_System SHALL return updated product data after successful action execution
13. WHEN action execution fails, THE Action_System SHALL return HTTP 400 with descriptive error message


### Requirement 7: Vendor Action System

**User Story:** As an administrator, I want to approve, reject, activate, and deactivate vendors, so that I can control which businesses operate on the platform.

#### Acceptance Criteria

1. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/vendors/[id] with action "approve"
2. WHEN approve action is executed, THE Action_System SHALL update vendor user kycStatus to APPROVED and set kycApprovedAt timestamp
3. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/vendors/[id] with action "reject"
4. WHEN reject action is executed, THE Action_System SHALL update vendor user kycStatus to REJECTED and set kycRejectedAt timestamp
5. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/vendors/[id] with action "activate"
6. WHEN activate action is executed, THE Action_System SHALL set vendor isActive to true
7. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/vendors/[id] with action "deactivate"
8. WHEN deactivate action is executed, THE Action_System SHALL set vendor isActive to false and disable all their active products
9. FOR ALL vendor actions, THE Action_System SHALL create Audit_Log entries recording admin userId, action type, vendorId, and timestamp
10. WHEN vendor is deactivated, THE Action_System SHALL send notification to vendor email address
11. THE Action_System SHALL return updated vendor data with user information after successful action execution
12. WHEN vendor approval is executed, THE Action_System SHALL send welcome email to vendor


### Requirement 8: Order Action System

**User Story:** As a vendor, I want to accept, decline, ship, and complete orders, so that I can manage the order fulfillment workflow.

#### Acceptance Criteria

1. WHEN authenticated as VENDOR, THE Action_System SHALL support POST /api/orders/[id] with action "accept"
2. WHEN accept action is executed on PREPARING status order, THE Action_System SHALL update status to READY_FOR_PICKUP and set acceptedAt timestamp
3. WHEN authenticated as VENDOR, THE Action_System SHALL support POST /api/orders/[id] with action "decline"
4. WHEN decline action is executed on PREPARING status order, THE Action_System SHALL update status to CANCELLED and set cancelledAt timestamp
5. WHEN authenticated as VENDOR, THE Action_System SHALL support POST /api/orders/[id] with action "ship"
6. WHEN ship action is executed on READY_FOR_PICKUP status order, THE Action_System SHALL update status to OUT_FOR_DELIVERY and set shippedAt timestamp
7. WHEN authenticated as VENDOR, THE Action_System SHALL support POST /api/orders/[id] with action "deliver"
8. WHEN deliver action is executed on OUT_FOR_DELIVERY status order, THE Action_System SHALL update status to DELIVERED and set deliveredAt timestamp
9. WHEN authenticated as CUSTOMER, THE Action_System SHALL support POST /api/orders/[id] with action "cancel"
10. WHEN cancel action is executed by customer on PREPARING or READY_FOR_PICKUP status order, THE Action_System SHALL update status to CANCELLED
11. THE Action_System SHALL prevent order status transitions that violate the workflow (e.g., DELIVERED cannot become PREPARING)
12. FOR ALL order actions, THE Action_System SHALL create OrderTracking event entries with timestamp and status
13. WHEN order status changes, THE Action_System SHALL send notification to customer and vendor


### Requirement 9: Settlement and Financial Management

**User Story:** As an administrator, I want to manage vendor settlements and payouts, so that vendors receive timely payment for their sales.

#### Acceptance Criteria

1. WHEN authenticated as ADMIN, THE CRUD_System SHALL support GET /api/admin/settlements with Pagination
2. THE CRUD_System SHALL support filtering settlements by vendorId, status (PENDING, PROCESSED, PAID, FAILED), and period
3. THE CRUD_System SHALL support sorting settlements by createdAt, amount, and period
4. WHEN authenticated as ADMIN, THE CRUD_System SHALL support POST /api/admin/settlements to create new settlement records
5. THE CRUD_System SHALL validate settlement data including vendorId, period, amount, and commission
6. THE CRUD_System SHALL calculate vendor settlement amount from completed orders minus platform commission
7. WHEN authenticated as ADMIN, THE CRUD_System SHALL support PATCH /api/admin/settlements/[id] to update status
8. WHEN settlement status changes to PAID, THE CRUD_System SHALL record paidAt timestamp
9. WHEN authenticated as VENDOR, THE CRUD_System SHALL support GET /api/vendor/settlements for own settlement history
10. THE CRUD_System SHALL support GET /api/vendor/earnings/summary for total earnings, pending settlements, and paid amounts
11. WHEN authenticated as ADMIN, THE CRUD_System SHALL support generating settlement invoice PDF files
12. THE CRUD_System SHALL include vendor information, order details, commission breakdown, and payment information in invoices


### Requirement 10: Dashboard Statistics and Analytics

**User Story:** As a user with any role, I want to view real-time dashboard statistics from the database, so that I can monitor platform performance and my business metrics.

#### Acceptance Criteria

1. WHEN authenticated as ADMIN, THE CRUD_System SHALL support GET /api/admin/stats returning total users, vendors, products, and orders
2. THE CRUD_System SHALL calculate revenue metrics including total revenue, monthly revenue, and pending settlements
3. THE CRUD_System SHALL support GET /api/admin/analytics with date range filtering for time-series data
4. WHEN authenticated as VENDOR, THE CRUD_System SHALL support GET /api/vendor/dashboard returning vendor-specific metrics
5. THE CRUD_System SHALL calculate vendor metrics including total sales, active products, pending orders, and earnings
6. THE CRUD_System SHALL support GET /api/vendor/analytics with product performance breakdown and sales trends
7. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL support GET /api/customer/dashboard returning order history summary
8. THE CRUD_System SHALL calculate customer metrics including total orders, active rentals, and total spent
9. THE CRUD_System SHALL cache dashboard statistics with 5-minute TTL to optimize database load
10. FOR ALL dashboard endpoints, THE CRUD_System SHALL return data aggregated from Database without Mock_Data


### Requirement 11: Bulk Action Operations

**User Story:** As an administrator, I want to perform bulk operations on multiple records, so that I can efficiently manage large datasets.

#### Acceptance Criteria

1. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/products/bulk with action and productIds array
2. THE Action_System SHALL support bulk actions including "approve", "reject", "delete", "feature", and "unfeature" for products
3. THE Action_System SHALL validate that all productIds exist before executing Bulk_Action
4. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/vendors/bulk with action and vendorIds array
5. THE Action_System SHALL support bulk actions including "approve", "reject", "activate", and "deactivate" for vendors
6. WHEN authenticated as ADMIN, THE Action_System SHALL support POST /api/admin/orders/bulk with action and orderIds array
7. THE Action_System SHALL support bulk actions including "accept", "cancel", and "ship" for orders
8. THE Action_System SHALL execute Bulk_Action operations within database transaction for atomicity
9. WHEN any individual operation in Bulk_Action fails, THE Action_System SHALL rollback entire transaction
10. THE Action_System SHALL return detailed results indicating success count, failure count, and specific errors
11. FOR ALL Bulk_Action operations, THE Action_System SHALL create Audit_Log entries for each affected record
12. THE Action_System SHALL limit Bulk_Action to maximum 100 records per request to prevent performance issues


### Requirement 12: Input Validation and Error Handling

**User Story:** As a system operator, I want comprehensive input validation and error handling, so that invalid data is rejected and users receive clear error messages.

#### Acceptance Criteria

1. THE CRUD_System SHALL validate all API request bodies using Validation_Schema before processing
2. WHEN validation fails, THE CRUD_System SHALL return HTTP 400 with detailed field-level error messages
3. THE CRUD_System SHALL validate email format using RFC 5322 compliant regex pattern
4. THE CRUD_System SHALL validate phone numbers using E.164 international format
5. THE CRUD_System SHALL validate price and currency fields ensuring positive decimal values with 2 decimal places
6. THE CRUD_System SHALL validate date fields ensuring proper ISO 8601 format and logical date ranges
7. WHEN database constraint violations occur, THE CRUD_System SHALL return HTTP 409 Conflict with descriptive message
8. WHEN resource not found, THE CRUD_System SHALL return HTTP 404 with resource type and ID
9. WHEN server errors occur, THE CRUD_System SHALL return HTTP 500 and log full error details with request context
10. THE CRUD_System SHALL sanitize all text inputs to prevent XSS attacks by escaping HTML special characters
11. THE CRUD_System SHALL validate file uploads for allowed types, maximum size of 5MB, and scan for malware
12. FOR ALL API errors, THE CRUD_System SHALL return consistent JSON structure with error code, message, and field details


### Requirement 13: Database Query Optimization and Performance

**User Story:** As a system operator, I want optimized database queries, so that the platform performs efficiently under production load.

#### Acceptance Criteria

1. THE CRUD_System SHALL implement database indexes on frequently queried columns including email, role, vendorId, userId, and createdAt
2. THE CRUD_System SHALL use Prisma include and select to avoid N+1 query problems when fetching related data
3. THE CRUD_System SHALL implement cursor-based Pagination for lists exceeding 1000 records
4. THE CRUD_System SHALL limit database query response time to average 100ms and P99 of 500ms
5. THE CRUD_System SHALL implement database connection pooling with minimum 5 and maximum 20 connections
6. THE CRUD_System SHALL use database transactions for operations modifying multiple tables
7. WHEN performing full-text search, THE CRUD_System SHALL use database native search or dedicated search indexes
8. THE CRUD_System SHALL implement query result caching with 5-minute TTL for frequently accessed read-only data
9. THE CRUD_System SHALL log slow queries exceeding 500ms with query text and execution plan
10. THE CRUD_System SHALL aggregate database statistics including query count, average response time, and error rate
11. THE CRUD_System SHALL implement database query timeouts of 10 seconds to prevent resource exhaustion
12. FOR ALL list endpoints, THE CRUD_System SHALL return total count separately from paginated results to optimize performance


### Requirement 14: Audit Logging and Compliance

**User Story:** As a compliance officer, I want comprehensive audit logs of all administrative actions, so that I can track changes and meet regulatory requirements.

#### Acceptance Criteria

1. THE CRUD_System SHALL create Audit_Log database records for all administrative actions
2. THE Audit_Log SHALL capture userId, action type, resource type, resource ID, timestamp, IP address, and user agent
3. WHEN Action_System executes approve, reject, activate, deactivate, or delete actions, THE CRUD_System SHALL record before and after state
4. WHEN authenticated as ADMIN, THE CRUD_System SHALL support GET /api/admin/audit-logs with Pagination
5. THE CRUD_System SHALL support filtering Audit_Log by userId, action type, resource type, and date range
6. THE CRUD_System SHALL support sorting Audit_Log by timestamp in descending order
7. THE Audit_Log records SHALL be immutable and prevent modification after creation
8. THE CRUD_System SHALL retain Audit_Log records for minimum 2 years for compliance
9. WHEN sensitive data changes occur, THE CRUD_System SHALL log field-level changes with old and new values
10. THE CRUD_System SHALL implement separate audit log database table with appropriate indexes for query performance
11. FOR ALL failed authentication attempts, THE CRUD_System SHALL create Audit_Log entries for security monitoring
12. THE CRUD_System SHALL support exporting Audit_Log data in CSV format for external analysis


### Requirement 15: Frontend Integration and User Experience

**User Story:** As a user, I want responsive and intuitive interfaces that integrate seamlessly with the backend APIs, so that I can efficiently complete tasks with immediate feedback.

#### Acceptance Criteria

1. THE CRUD_System SHALL provide API responses within 500ms for 95% of requests
2. WHEN Action_System operations are triggered, THE frontend SHALL display Loading_State indicators on action buttons
3. THE frontend SHALL disable action buttons during operation execution to prevent duplicate submissions
4. WHEN Action_System operations complete successfully, THE frontend SHALL display Toast_Notification with success message
5. WHEN Action_System operations fail, THE frontend SHALL display Toast_Notification with error message from API response
6. THE frontend SHALL implement Optimistic_Update for UI responsiveness before API confirmation
7. WHEN destructive actions are triggered, THE frontend SHALL display Action_Modal requiring explicit confirmation
8. THE Action_Modal SHALL clearly state action type, affected item name, and consequences
9. THE frontend SHALL update data tables automatically after successful action execution without page reload
10. THE frontend SHALL implement infinite scroll or load-more buttons for Pagination instead of traditional page numbers
11. THE frontend SHALL debounce search inputs with 300ms delay to reduce API calls during typing
12. FOR ALL forms, THE frontend SHALL display inline validation errors immediately as user types based on Validation_Schema rules


### Requirement 16: Mock Data Elimination and Production Readiness

**User Story:** As a product manager, I want all mock data removed and replaced with real database-driven content, so that the platform is production-ready for launch.

#### Acceptance Criteria

1. THE CRUD_System SHALL eliminate all Mock_Data constants from lib/constants.ts file
2. THE CRUD_System SHALL replace all mock data usage in admin dashboard pages with API calls
3. THE CRUD_System SHALL replace all mock data usage in vendor dashboard pages with API calls
4. THE CRUD_System SHALL replace all mock data usage in customer application pages with API calls
5. WHEN pages load, THE CRUD_System SHALL display Loading_State while fetching real data from Database
6. WHEN API data is unavailable, THE CRUD_System SHALL display empty state messages instead of showing mock data
7. THE CRUD_System SHALL remove all placeholder pages or implement their full functionality with real APIs
8. THE CRUD_System SHALL ensure all statistics and metrics on dashboards are calculated from live Database queries
9. THE CRUD_System SHALL verify no hardcoded test data exists in production build using build-time checks
10. THE CRUD_System SHALL implement proper error boundaries to gracefully handle API failures without crashing the application
11. FOR ALL pages, THE CRUD_System SHALL verify data is fetched from Database and not from local variables or constants
12. THE CRUD_System SHALL pass TypeScript strict mode compilation with zero errors related to mock data typing


### Requirement 17: Search and Filtering Infrastructure

**User Story:** As a user, I want powerful search and filtering capabilities, so that I can quickly find specific products, orders, vendors, or users.

#### Acceptance Criteria

1. THE CRUD_System SHALL support GET /api/search with query parameter for global platform search
2. THE CRUD_System SHALL search across products (title, description), vendors (name), and orders (orderNumber)
3. THE CRUD_System SHALL return search results with resource type, ID, title, and relevance score
4. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL support GET /api/products/search with text query and filters
5. THE CRUD_System SHALL support filtering products by price range, product type, vendor, and stock availability
6. THE CRUD_System SHALL support filtering products by rating range when review system is implemented
7. THE CRUD_System SHALL support sorting search results by relevance, price, createdAt, and popularity
8. WHEN authenticated as ADMIN, THE CRUD_System SHALL support advanced search with filters for verification status and dates
9. THE CRUD_System SHALL implement search query result caching with 10-minute TTL for identical queries
10. THE CRUD_System SHALL highlight matching search terms in returned results
11. THE CRUD_System SHALL support autocomplete suggestions for search queries based on popular searches
12. FOR ALL search operations, THE CRUD_System SHALL log search terms and result counts for analytics


### Requirement 18: Cart and Checkout Operations

**User Story:** As a customer, I want to manage my shopping cart and complete checkout, so that I can purchase products seamlessly.

#### Acceptance Criteria

1. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL support POST /api/cart to add products with quantity
2. THE CRUD_System SHALL validate product availability and stock before adding to cart
3. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL support GET /api/cart to retrieve current cart contents
4. THE CRUD_System SHALL return cart with product details, current prices, stock status, and calculated totals
5. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL support PATCH /api/cart/[itemId] to update item quantity
6. WHEN quantity update exceeds available stock, THE CRUD_System SHALL return HTTP 400 with stock limit information
7. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL support DELETE /api/cart/[itemId] to remove items
8. WHEN authenticated as CUSTOMER, THE CRUD_System SHALL support POST /api/cart/checkout to create order from cart
9. THE CRUD_System SHALL validate all cart items have sufficient stock before creating order during checkout
10. WHEN checkout succeeds, THE CRUD_System SHALL create Order, OrderItem records, clear cart, and return order confirmation
11. THE CRUD_System SHALL calculate order totals including subtotal, tax, delivery fees, and discounts if applicable
12. THE CRUD_System SHALL store cart data in Database associated with userId for persistence across sessions


### Requirement 19: Notification System

**User Story:** As a user, I want to receive notifications about important events, so that I stay informed about order status, approvals, and platform updates.

#### Acceptance Criteria

1. WHEN vendor is approved, THE CRUD_System SHALL create in-app notification record for vendor user
2. WHEN order status changes, THE CRUD_System SHALL create in-app notifications for customer and vendor
3. WHEN authenticated, THE CRUD_System SHALL support GET /api/notifications to retrieve user notifications with Pagination
4. THE CRUD_System SHALL support filtering notifications by read/unread status and type
5. WHEN authenticated, THE CRUD_System SHALL support PATCH /api/notifications/[id] to mark notification as read
6. WHEN authenticated, THE CRUD_System SHALL support POST /api/notifications/mark-all-read to mark all as read
7. THE CRUD_System SHALL support GET /api/notifications/unread-count for displaying badge count
8. WHEN new notification is created, THE CRUD_System SHALL send email to user email address
9. THE CRUD_System SHALL format email notifications using branded HTML templates with action links
10. THE CRUD_System SHALL implement notification preferences allowing users to opt-in/opt-out of notification types
11. THE CRUD_System SHALL delete notifications older than 90 days automatically
12. FOR ALL critical actions, THE CRUD_System SHALL create notification records before sending emails to ensure delivery tracking


### Requirement 20: Security Hardening and Rate Limiting

**User Story:** As a security administrator, I want comprehensive security controls and rate limiting, so that the platform is protected against common attacks and abuse.

#### Acceptance Criteria

1. THE CRUD_System SHALL implement Rate_Limiting of 5 login attempts per 15 minutes per IP address
2. THE CRUD_System SHALL implement Rate_Limiting of 10 registration attempts per hour per IP address
3. THE CRUD_System SHALL implement Rate_Limiting of 100 API requests per minute per authenticated user
4. WHEN Rate_Limiting threshold is exceeded, THE CRUD_System SHALL return HTTP 429 Too Many Requests with retry-after header
5. THE CRUD_System SHALL implement CORS headers restricting API access to whitelisted domains
6. THE CRUD_System SHALL set security headers including HSTS, X-Content-Type-Options, X-Frame-Options, and CSP
7. THE CRUD_System SHALL hash all passwords using bcrypt with minimum 12 rounds before storing in Database
8. THE CRUD_System SHALL enforce password requirements of minimum 12 characters, uppercase, lowercase, number, and special character
9. THE CRUD_System SHALL implement JWT_Token rotation refreshing tokens every 24 hours
10. THE CRUD_System SHALL invalidate all user sessions when password is changed
11. THE CRUD_System SHALL sanitize all database query inputs using Prisma parameterized queries to prevent SQL injection
12. THE CRUD_System SHALL validate all file uploads for malicious content and restrict to allowed mime types and maximum size of 5MB

