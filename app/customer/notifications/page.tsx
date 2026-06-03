'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

const notifications = [
  { title: 'Your lounge booking is arriving soon', time: '5 min ago', type: 'info' },
  { title: 'AED 25 reward added to your wallet', time: '1h ago', type: 'success' },
  { title: 'New signature flavor launched', time: 'Yesterday', type: 'promo' },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-5xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-2">Stay in the loop with updates about orders, offers, and new lounge experiences.</p>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <GlassCard key={notification.title} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{notification.title}</p>
                  <p className="text-sm text-slate-500 mt-2">{notification.time}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ backgroundColor: notification.type === 'success' ? '#10b981' : notification.type === 'promo' ? '#f97316' : '#3b82f6' }}>
                  {notification.type === 'success' ? 'Success' : notification.type === 'promo' ? 'Promo' : 'Update'}
                </span>
              </div>
            </GlassCard>
          ))}
          {notifications.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              No notifications yet. Check back later for updates.
            </div>
          )}
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
