'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-5xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-2">Update your account information, contact details, and notification settings.</p>
        </div>

        <GlassCard className="p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Full name</span>
              <input type="text" defaultValue="Maya Al Farsi" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input type="email" defaultValue="maya@sheeshatonight.ae" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Phone</span>
              <input type="text" defaultValue="+971 55 123 4567" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">City</span>
              <input type="text" defaultValue="Dubai" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-3xl bg-amber-500 px-6 py-3 text-white font-semibold hover:bg-amber-600 transition">Save changes</button>
            <button className="rounded-3xl border border-slate-200 px-6 py-3 text-slate-700 hover:bg-slate-100 transition">Change password</button>
          </div>
        </GlassCard>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
