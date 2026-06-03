'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BarChart3, ShoppingCart, Store, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
  const { isAllowed, userRole } = useRoleGuard(['ADMIN']);

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back, Admin! Here's your platform overview.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Total Revenue</h3>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">AED 2.4M</p>
              <p className="text-sm text-green-600 font-semibold mt-2">↑ 12% vs last month</p>
            </div>

            {/* Active Vendors */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Active Vendors</h3>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Store size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">342</p>
              <p className="text-sm text-blue-600 font-semibold mt-2">↑ 8% this month</p>
            </div>

            {/* Active Customers */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Active Customers</h3>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">1,240</p>
              <p className="text-sm text-purple-600 font-semibold mt-2">↑ 15% this month</p>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">Total Orders</h3>
                <div className="p-3 bg-amber-100 rounded-full">
                  <ShoppingCart size={20} className="text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">8,542</p>
              <p className="text-sm text-amber-600 font-semibold mt-2">↑ 24% this month</p>
            </div>
          </div>

          {/* Action Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-orange-600" size={24} />
                <h2 className="text-lg font-bold text-slate-900">Pending Approvals</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Vendor KYC Approvals</p>
                    <p className="text-xs text-slate-500">23 pending vendors</p>
                  </div>
                  <button className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 transition">
                    Review
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Product Approvals</p>
                    <p className="text-xs text-slate-500">45 pending products</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
                    Review
                  </button>
                </div>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-red-600" size={24} />
                <h2 className="text-lg font-bold text-slate-900">Support Tickets</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">High Priority</p>
                    <p className="text-xs text-slate-500">12 urgent tickets</p>
                  </div>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition">
                    Handle
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Open Tickets</p>
                    <p className="text-xs text-slate-500">89 open tickets</p>
                  </div>
                  <button className="px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'ORD-001', customer: 'Ahmed Al-Mansouri', vendor: 'Bespoke Sheesha', amount: 'AED 450', status: 'Delivered' },
                    { id: 'ORD-002', customer: 'Fatima Al-Khaleej', vendor: 'The Ember Room', amount: 'AED 280', status: 'In Transit' },
                    { id: 'ORD-003', customer: 'Mohammed Hassan', vendor: 'Luxury Lounge', amount: 'AED 520', status: 'Preparing' },
                  ].map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{order.id}</td>
                      <td className="py-3 px-4 text-slate-600">{order.customer}</td>
                      <td className="py-3 px-4 text-slate-600">{order.vendor}</td>
                      <td className="py-3 px-4 font-semibold text-amber-600">{order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
