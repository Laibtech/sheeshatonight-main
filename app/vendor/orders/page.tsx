'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { VendorSidebar } from '@/components/vendor/VendorSidebar';
import { Clock, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

export default function VendorOrders() {
  const { isAllowed } = useRoleGuard(['VENDOR']);

  if (!isAllowed) return null;

  const orders = [
    { id: 'ORD-001', customer: 'Ahmed Al-Mansouri', location: 'Al Manara Beach Club', amount: 'AED 450', status: 'Delivered', time: '2 hours ago' },
    { id: 'ORD-002', customer: 'Fatima Hassan', location: 'Downtown Dubai', amount: 'AED 280', status: 'In Transit', time: '30 mins ago' },
    { id: 'ORD-003', customer: 'Mohammed Khan', location: 'Marina Lounge', amount: 'AED 520', status: 'Preparing', time: 'Just now' },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'Delivered') return <CheckCircle className="text-green-500" size={20} />;
    if (status === 'In Transit') return <Clock className="text-blue-500" size={20} />;
    return <AlertCircle className="text-amber-500" size={20} />;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <VendorSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Orders</h1>
          <p className="text-slate-600 mb-8">Manage and track all your orders</p>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-300 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-amber-500 font-semibold uppercase">{order.id}</p>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{order.customer}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {order.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-amber-600">{order.amount}</p>
                    <p className="text-xs text-slate-500 mt-1">{order.time}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-semibold text-slate-900">{order.status}</span>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
