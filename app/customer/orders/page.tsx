'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { CheckCircle, Clock, Package, MapPin, Calendar } from 'lucide-react';

export default function CustomerOrders() {
  const { isAllowed } = useRoleGuard(['CUSTOMER']);

  if (!isAllowed) return null;

  const orders = [
    {
      id: 'ORD-001',
      venue: 'Luxury Lounge',
      date: '2024-01-15',
      amount: 'AED 450',
      status: 'Delivered',
      items: 'Premium Setup + Flavors',
    },
    {
      id: 'ORD-002',
      venue: 'Bespoke Sheesha',
      date: '2024-01-14',
      amount: 'AED 280',
      status: 'Completed',
      items: 'Deluxe Setup',
    },
    {
      id: 'ORD-003',
      venue: 'The Ember Room',
      date: '2024-01-13',
      amount: 'AED 320',
      status: 'Completed',
      items: 'Premium Setup + Drinks',
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'Delivered' || status === 'Completed') {
      return <CheckCircle className="text-green-500" size={20} />;
    }
    return <Clock className="text-blue-500" size={20} />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-4xl mx-auto p-4 lg:p-6">
        <h1 className="text-3xl font-black text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-600 mb-8">View and manage all your bookings</p>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-300 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-amber-500 font-semibold uppercase">{order.id}</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{order.venue}</h3>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-2">
                    <Calendar size={14} />
                    {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-amber-600">{order.amount}</p>
                  <div className="flex items-center gap-1 mt-2 justify-end">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-semibold text-slate-900">{order.status}</span>
                  </div>
                </div>
              </div>
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Package size={14} />
                  {order.items}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition text-sm">
                  Reorder
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition text-sm">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className="h-4" />
    </div>
  );
}
