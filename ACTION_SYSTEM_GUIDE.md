# Action System Implementation Guide

## Overview

The Sheesha Tonight platform now includes a comprehensive action system for managing records across all dashboards. This includes:

- **Approve/Reject** actions
- **Accept/Decline** actions
- **Delete** actions with confirmation
- **Active/Inactive** toggle
- **Real-time updates** with toast notifications
- **Loading states** and visual feedback

## Components

### 1. ActionModal Component

Reusable confirmation modal for all actions.

**Location**: `components/ActionModal.tsx`

**Usage**:
```tsx
<ActionModal
  isOpen={actionModal.isOpen}
  onClose={() => setActionModal({ isOpen: false, ... })}
  title="Approve Vendor"
  message="Are you sure you want to approve this vendor?"
  actionType="approve"
  itemName={vendorName}
  isDangerous={false}
  onConfirm={confirmAction}
/>
```

**Props**:
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal is closed
- `title: string` - Modal title
- `message: string` - Confirmation message
- `actionType: ActionType` - Type of action (approve, reject, delete, etc.)
- `itemName?: string` - Name of the item being acted upon
- `isDangerous?: boolean` - Sets red color for dangerous actions
- `onConfirm: () => Promise<void> | void` - Action handler
- `confirmText?: string` - Custom confirm button text
- `cancelText?: string` - Custom cancel button text

### 2. Enhanced DataTable Component

Updated to support loading states and disabled rows.

**Location**: `components/DataTable.tsx`

**New Props**:
- `loadingIds?: Set<string | number>` - IDs of rows currently loading
- `isLoading?: boolean` - Global loading state

### 3. useActions Hook

Custom hook for managing action API calls and loading states.

**Location**: `lib/hooks/useActions.ts`

**Usage**:
```tsx
const { loading, error, performAction, clearError } = useActions();

// Call action
const result = await performAction(
  'vendor',           // resource type
  'vendor-id-123',   // resource ID
  'approve',         // action type
  'admin'            // scope (admin, vendor, or undefined for orders)
);

if (result.success) {
  // Handle success
} else {
  // Handle error: result.error
}
```

**Supported Resources**:
- `'vendor'` - User vendors (scope: admin)
- `'product'` - Admin products (scope: admin)
- `'user'` - User management (scope: admin)
- `'vendor-product'` - Vendor's own products (scope: vendor)
- `'order'` - Order management (no scope required)

## API Routes

### Admin Endpoints

#### Vendor Actions
**Endpoint**: `POST /api/admin/vendors/[vendorId]`

**Payload**:
```json
{
  "vendorId": "vendor-id",
  "action": "approve" | "reject" | "activate" | "deactivate"
}
```

#### Product Actions
**Endpoint**: `POST /api/admin/products/[productId]`

**Payload**:
```json
{
  "productId": "product-id",
  "action": "approve" | "reject" | "delete" | "feature" | "unfeature"
}
```

#### User Actions
**Endpoint**: `POST /api/admin/users/[userId]`

**Payload**:
```json
{
  "userId": "user-id",
  "action": "approve-kyc" | "reject-kyc" | "activate" | "deactivate" | "delete"
}
```

### Vendor Endpoints

#### Product Actions
**Endpoint**: `POST /api/vendor/products/[productId]`

**Payload**:
```json
{
  "productId": "product-id",
  "action": "toggle-active" | "delete" | "feature" | "unfeature"
}
```

### Order Endpoints

#### Order Actions
**Endpoint**: `POST /api/orders/[orderId]`

**Payload**:
```json
{
  "action": "accept" | "decline" | "cancel" | "ship" | "deliver"
}
```

## Updated Dashboard Pages

### 1. Admin Vendors (`app/admin/vendors/page.tsx`)

**Features**:
- Approve/Reject pending vendors
- Activate/Deactivate verified vendors
- Delete vendors
- Real-time status updates
- Toast notifications

**Actions Available**:
- Pending vendors: Approve, Reject
- Verified vendors: Deactivate, Delete
- Rejected vendors: Reactivate

### 2. Admin Products (`app/admin/products/page.tsx`)

**Features**:
- Approve new product submissions
- Reject products
- Feature approved products
- Delete products
- Dynamic statistics

**Actions Available**:
- Pending products: Approve, Reject, Delete
- Approved products: Feature, Delete

### 3. Vendor Products (`app/vendor/products/page.tsx`)

**Features**:
- Toggle product active/inactive status
- Delete products
- Real-time inventory management
- Loading states during actions

**Actions Available**:
- All products: Pause/Activate, Edit, Delete

### 4. Admin Orders (`app/admin/orders/page.tsx`)

**Features**:
- Accept/Decline pending orders
- Ship orders
- Mark as delivered
- Cancel orders
- Workflow-based actions

**Actions Available**:
- Pending: Accept, Decline, Cancel
- Preparing: Ship, Cancel
- Shipped: Deliver
- Delivered: View only

## Implementation Pattern

Follow this pattern to add actions to any dashboard:

```tsx
'use client';

import { useState, useCallback } from 'react';
import ActionModal from '@/components/ActionModal';
import { useActions } from '@/lib/hooks/useActions';
import Toast from '@/components/Toast';

export default function YourDashboard() {
  const { performAction } = useActions();
  const [items, setItems] = useState([...]);
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: '',
    itemId: '',
    itemName: '',
  });
  const [toast, setToast] = useState({ 
    show: false, 
    message: '', 
    type: 'success' 
  });
  const [loadingIds, setLoadingIds] = useState(new Set());

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAction = useCallback((id, action, name) => {
    setActionModal({ isOpen: true, type: action, itemId: id, itemName: name });
  }, []);

  const confirmAction = useCallback(async () => {
    const { itemId, type } = actionModal;
    setLoadingIds(prev => new Set(prev).add(itemId));

    try {
      const result = await performAction('resource', itemId, type, 'scope');
      
      if (result.success) {
        // Update state
        setItems(prev => 
          prev.map(item => 
            item.id === itemId ? { ...item, status: newStatus } : item
          )
        );
        showToast(`Item ${type}d successfully`, 'success');
        setActionModal({ isOpen: false, type: '', itemId: '', itemName: '' });
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast('Error occurred', 'error');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }, [actionModal, performAction]);

  return (
    <>
      {/* Your table with action buttons */}
      
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: '', itemId: '', itemName: '' })}
        title={`${actionModal.type} Item`}
        message={`Confirm ${actionModal.type}?`}
        actionType={actionModal.type}
        itemName={actionModal.itemName}
        isDangerous={actionModal.type === 'delete'}
        onConfirm={confirmAction}
      />

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
```

## API Client Methods

### Available Methods

```tsx
// Admin API
adminAPI.vendorAction(vendorId, action)
adminAPI.productAction(productId, action)
adminAPI.userAction(userId, action)

// Vendor API
vendorAPI.productAction(productId, action)

// Order API
orderAPI.performAction(orderId, action)
```

## Toast Notifications

Toast component automatically shows success/error messages.

**Location**: `components/Toast.tsx`

**Usage**:
```tsx
{toast.show && <Toast message={toast.message} type={toast.type} />}
```

## Database Schema

Actions update these Prisma models:

### User Model
- `status` field: ACTIVE | INACTIVE
- `kycStatus` field: PENDING | APPROVED | REJECTED
- `kycApprovedAt`, `kycRejectedAt` timestamps

### Product Model
- `status` field: ACTIVE | INACTIVE
- `isFeatured` field: boolean

### Order Model
- `status` field: PENDING | PREPARING | READY_FOR_PICKUP | OUT_FOR_DELIVERY | DELIVERED | CANCELLED
- `acceptedAt`, `cancelledAt`, `deliveredAt` timestamps

## Error Handling

All actions include:
- Loading state management
- Error messages in toast
- Disabled buttons during processing
- Row opacity changes during action
- Graceful error recovery

## Security

- All actions require authentication
- Admin routes verify ADMIN role
- Vendor routes verify owner/VENDOR role
- API middleware enforces permissions
- Actions are logged in database

## Real-time Updates

- Local state updates immediately for UX
- API calls happen asynchronously
- Loading states prevent duplicate actions
- Toast notifications confirm success/failure

## Testing the System

1. **Approve a vendor**: Go to Admin → Vendors → Click Approve on pending vendor
2. **Reject a product**: Go to Admin → Products → Click Reject on pending product
3. **Toggle product status**: Go to Vendor → Products → Click Pause/Activate
4. **Accept an order**: Go to Admin → Orders → Click Accept on pending order
5. **Delete a record**: Click Delete button and confirm in modal

## Next Steps

- Integrate with real database
- Add bulk actions support
- Implement action history/audit logs
- Add scheduled actions
- Create action notifications
