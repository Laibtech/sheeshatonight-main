'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Check, X, Clock, Store, User } from 'lucide-react';

export default function AdminVendors() {
  const { isAllowed } = useRoleGuard(['ADMIN']);

  if (!isAllowed) return null;

  const vendors = [
    { id: 1, name: 'Bespoke Sheesha', owner: 'Ahmed Al-Khaleej', status: 'Verified', orders: 342, rating: 4.8 },
    { id: 2, name: 'Luxury Lounge', owner: 'Fatima Hassan', status: 'Verified', orders: 287, rating: 4.9 },
    { id: 3, name: 'The Ember Room', owner: 'Mohammed Khan', status: 'Pending', orders: 0, rating: 0 },
  ];

  const getStatusBadge = (status: string) => {
    if (status === 'Verified') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1"><Check size={12} />Verified</span>;
    }
    if (status === 'Pending') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1"><Clock size={12} />Pending</span>;
    }
    return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1"><X size={12} />Rejected</span>;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Vendors Management</h1>
          <p className="text-slate-600 mb-8">Manage vendor accounts and approvals</p>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Vendor Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Owner</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Orders</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Rating</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Store size={16} className="text-amber-600" />
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                      <User size={14} />
                      {vendor.owner}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(vendor.status)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{vendor.orders}</td>
                    <td className="px-6 py-4 font-semibold text-amber-600">{vendor.rating || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded hover:bg-blue-200 transition">
                          View
                        </button>
                        {vendor.status === 'Pending' && (
                          <>
                            <button className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded hover:bg-green-200 transition">
                              Approve
                            </button>
                            <button className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition">
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
