'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { VendorSidebar } from '@/components/vendor/VendorSidebar';
import { TrendingUp, ShoppingCart, Package, AlertCircle, Star, MessageSquare } from 'lucide-react';

export default function VendorDashboard() {
  const { isAllowed, userRole } = useRoleGuard(['VENDOR']);

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <VendorSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">Vendor Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage your business and track performance</p>
          </div>

          {/* Today's Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Today's Sales */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Today's Sales</h3>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">AED 3,240</p>
              <p className="text-sm text-green-600 font-semibold mt-2">↑ 18% vs yesterday</p>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Monthly Revenue</h3>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ShoppingCart size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">AED 48,500</p>
              <p className="text-sm text-blue-600 font-semibold mt-2">↑ 24% vs last month</p>
            </div>

            {/* Active Products */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Active Products</h3>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">24</p>
              <p className="text-sm text-purple-600 font-semibold mt-2">2 pending approval</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Pending Orders</h3>
                <div className="p-3 bg-amber-100 rounded-full">
                  <AlertCircle size={20} className="text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">12</p>
              <p className="text-sm text-amber-600 font-semibold mt-2">Needs attention</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Pending Orders List */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Pending Orders</h2>
              <div className="space-y-3">
                {[
                  { id: 'ORD-001', customer: 'Ahmed Al-Mansouri', venue: 'Al Manara Beach Club', time: '30 mins ago', items: 'Premium Setup + Flavors' },
                  { id: 'ORD-002', customer: 'Fatima Hassan', venue: 'Downtown Dubai', time: '45 mins ago', items: 'Deluxe Setup' },
                  { id: 'ORD-003', customer: 'Mohammed Khan', venue: 'Marina Lounge', time: '1 hour ago', items: 'Standard Setup + Drinks' },
                ].map((order) => (
                  <div key={order.id} className="p-4 border border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{order.customer}</p>
                        <p className="text-xs text-slate-500">{order.venue}</p>
                      </div>
                      <span className="text-xs text-slate-500">{order.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{order.items}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition">
                        Accept Order
                      </button>
                      <button className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Top Sellers</h2>
              <div className="space-y-4">
                {[
                  { name: 'Premium Setup', sales: 156, rating: 4.8 },
                  { name: 'Deluxe Sheesha', sales: 142, rating: 4.7 },
                  { name: 'Classic Blend', sales: 98, rating: 4.6 },
                ].map((product, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-600">{product.sales} sales</p>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-slate-900">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews & Messages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Reviews</h2>
              <div className="space-y-4">
                {[
                  { customer: 'Sara Al-Mansoori', rating: 5, review: 'Excellent service! Very professional team.' },
                  { customer: 'Ali Mahmoud', rating: 4, review: 'Great experience, will order again soon.' },
                ].map((rev, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-slate-900">{rev.customer}</p>
                      <div className="flex gap-1">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{rev.review}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Messages */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Customer Messages</h2>
                <MessageSquare size={20} className="text-amber-600" />
              </div>
              <div className="space-y-3">
                {[
                  { customer: 'Zainab Hassan', message: 'Can I customize the flavors?', unread: true },
                  { customer: 'Omar Khalil', message: 'What\'s your delivery time?', unread: false },
                ].map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${msg.unread ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className={`text-sm font-semibold ${msg.unread ? 'text-blue-900' : 'text-slate-900'}`}>{msg.customer}</p>
                    <p className={`text-xs ${msg.unread ? 'text-blue-700' : 'text-slate-600'}`}>{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
