'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { BottomNavBar } from '@/components/BottomNavBar';
import { GlassCard } from '@/components/GlassCard';
import { OrderCard } from '@/components/OrderCard';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { Clock, Truck, Trophy } from 'lucide-react';
import { MOCK_ORDERS } from '@/lib/constants';

export default function CustomerDashboard() {
  const { userName, region } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* Role Switcher */}
        <div className="mb-8">
          <RoleSwitcher />
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            Welcome, {userName}
          </h1>
          <p className="text-slate-600">Here's your sheesha tonight, curated for {region}</p>
        </div>

        {/* Live Insights Card */}
        <GlassCard className="mb-8 p-8 border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">Next Pickup</p>
              <h2 className="text-2xl font-black text-slate-900 mt-2">Bespoke Sheesha Co.</h2>
              <p className="text-sm text-slate-600 mt-1">Tonight • 8:00 PM</p>
            </div>
            <div className="border-l border-r border-slate-200/90 px-6">
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">Status</p>
              <p className="text-xl font-bold text-amber-500 mt-2">Ready to Pickup</p>
              <p className="text-sm text-slate-600 mt-1">0.8 km away</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">Est. Delivery</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">9:30 PM</h3>
              <p className="text-sm text-slate-600 mt-1">Tonight</p>
            </div>
          </div>
        </GlassCard>

        {/* Tracking Timelines */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-slate-900 mb-4">Your Orders</h2>
          {MOCK_ORDERS.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard className="p-6">
            <Clock size={24} className="text-amber-500 mb-3" />
            <p className="text-sm text-slate-600">Active Orders</p>
            <p className="text-2xl font-black text-slate-900 mt-1">2</p>
          </GlassCard>
          <GlassCard className="p-6">
            <Truck size={24} className="text-amber-500 mb-3" />
            <p className="text-sm text-slate-600">Completed</p>
            <p className="text-2xl font-black text-slate-900 mt-1">24</p>
          </GlassCard>
          <GlassCard className="p-6">
            <Trophy size={24} className="text-amber-500 mb-3" />
            <p className="text-sm text-slate-600">Loyalty Points</p>
            <p className="text-2xl font-black text-slate-900 mt-1">1,240</p>
          </GlassCard>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
