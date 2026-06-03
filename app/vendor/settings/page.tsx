'use client';

import React from 'react';
import { VendorSidebar } from '@/components/vendor/VendorSidebar';

export default function VendorSettings() {
  return (
    <div className="flex h-screen bg-slate-50">
      <VendorSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Vendor Preferences</h1>
            <p className="text-slate-600 mt-2">Configure shop settings, notifications, and account controls for your vendor profile.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Shop Name</span>
                <input type="text" defaultValue="Luxury Lounge" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-amber-500" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Contact Email</span>
                <input type="email" defaultValue="vendor@sheeshatonight.ae" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-amber-500" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Business Hours</span>
                <input type="text" defaultValue="5:00 PM - 2:00 AM" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-amber-500" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Notification Email</span>
                <input type="email" defaultValue="alerts@sheeshatonight.ae" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-amber-500" />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold hover:bg-amber-600 transition">Save Settings</button>
              <button className="rounded-3xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100 transition">Reset</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
