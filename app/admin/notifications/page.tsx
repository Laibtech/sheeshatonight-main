'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Bell, CheckCircle, XCircle } from 'lucide-react';

const initialNotifications = [
  { id: 'N-001', title: 'New vendor application received', time: '12m ago', unread: true },
  { id: 'N-002', title: 'Commission payout completed', time: '1h ago', unread: true },
  { id: 'N-003', title: 'Product approval pending review', time: '3h ago', unread: false },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markRead = (id: string) => {
    setNotifications(notifications.map((notice) => (notice.id === id ? { ...notice, unread: false } : notice)));
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Notifications</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Admin Alerts</h1>
              <p className="text-slate-600 mt-2">Stay on top of marketplace events and platform updates.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
              <Bell size={18} /> Mark all read
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notice) => (
              <div key={notice.id} className={`rounded-3xl border p-6 shadow-sm transition ${notice.unread ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{notice.title}</p>
                    <p className="text-sm text-slate-500 mt-2">{notice.time}</p>
                  </div>
                  <button
                    onClick={() => markRead(notice.id)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Mark read
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
