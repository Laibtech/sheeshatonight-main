'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Shield, SlidersHorizontal, Bell } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Platform Configuration</h1>
            <p className="text-slate-600 mt-2">Update marketplace preferences, notification routing, and platform controls.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Security Settings</p>
              </div>
              <p className="text-slate-600">Manage admin security, access policies, and system lock rules.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <SlidersHorizontal className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Platform Options</p>
              </div>
              <p className="text-slate-600">Control commission rates, vendor tiers, and global marketplace behavior.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
              </div>
              <p className="text-slate-600">Configure alerts for admin tasks, support requests, and approvals.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Admin Account</h2>
              <p className="text-slate-500 mt-2">Update your profile details and portal preferences.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Admin email</span>
                <input type="email" defaultValue="admin@sheeshatonight.ae" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-amber-500" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Portal name</span>
                <input type="text" defaultValue="SheeshaTonight Admin" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 outline-none focus:border-amber-500" />
              </label>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold hover:bg-amber-600 transition">Save Changes</button>
              <button className="rounded-3xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100 transition">Reset</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
