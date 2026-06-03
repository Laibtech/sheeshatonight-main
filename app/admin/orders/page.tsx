'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminOrders() {
  const { isAllowed } = useRoleGuard(['ADMIN']);

  if (!isAllowed) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Orders Management</h1>
          <p className="text-slate-600 mb-8">Manage all platform orders and fulfillment</p>
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <p className="text-slate-600">Orders management page coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}
