'use client';

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DataTable } from '@/components/DataTable';
import { StatCard } from '@/components/StatCard';
import { Users, CheckCircle, UserPlus } from 'lucide-react';

const customers = [
  { id: 'C-001', name: 'Yara Al-Farsi', email: 'yara@dubai.ae', location: 'Downtown Dubai', orders: 18, status: 'Active' },
  { id: 'C-002', name: 'Omar Nasser', email: 'omar@uae.ae', location: 'JBR', orders: 6, status: 'Paused' },
  { id: 'C-003', name: 'Nadia Saleh', email: 'nadia@abudhabi.ae', location: 'Abu Dhabi', orders: 32, status: 'Active' },
  { id: 'C-004', name: 'Khalid Bin Zayed', email: 'khalid@shesha.ae', location: 'Sharjah', orders: 12, status: 'Active' },
];

export default function AdminCustomers() {
  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Customers</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Customer Management</h1>
              <p className="text-slate-600 mt-2">Review customer profiles, engagement and order history across the platform.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold shadow-lg shadow-amber-500/20 transition hover:bg-amber-600">
              <UserPlus size={18} /> Add Customer
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Customers" value="3,428" trend="+8% this month" icon={<Users />} />
            <StatCard title="Active Profiles" value="2,912" trend="+12%" icon={<CheckCircle />} />
            <StatCard title="Loyalty Members" value="1,204" trend="+9%" icon={<UserPlus />} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Directory</h2>
                <p className="text-slate-500 mt-1">Filter and segment registered customers by location, status, or spending.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input type="text" placeholder="Search customers..." className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-inner outline-none focus:border-amber-500" />
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-amber-500">
                  <option>All locations</option>
                  <option>Dubai</option>
                  <option>Abu Dhabi</option>
                  <option>Sharjah</option>
                </select>
              </div>
            </div>

            <DataTable
              columns={[
                { header: 'Customer ID', accessor: 'id' },
                { header: 'Name', accessor: 'name' },
                { header: 'Email', accessor: 'email' },
                { header: 'Location', accessor: 'location' },
                { header: 'Orders', accessor: 'orders' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span> },
              ]}
              data={customers}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
