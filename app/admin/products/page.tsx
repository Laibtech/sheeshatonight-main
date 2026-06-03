'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DataTable } from '@/components/DataTable';
import { StatCard } from '@/components/StatCard';
import { ShieldCheck, Tag, Database } from 'lucide-react';

const initialProducts = [
  { id: 'P-001', title: 'Luxury Sheesha Setup', vendor: 'Bespoke Sheesha', category: 'Premium', price: 'AED 450', status: 'Pending' },
  { id: 'P-002', title: 'Turkish Tobacco Pack', vendor: 'The Ember Room', category: 'Flavors', price: 'AED 120', status: 'Approved' },
  { id: 'P-003', title: 'Gold Hookah Kit', vendor: 'Luxury Lounge', category: 'Equipment', price: 'AED 780', status: 'Pending' },
];

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);

  const approveProduct = (id: string) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, status: 'Approved' } : product)));
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Product Approval</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Review New Marketplace Products</h1>
              <p className="text-slate-600 mt-2">Approve inventory submissions from vendor partners and manage product metadata.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
              <ShieldCheck size={18} /> Review Pending
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Submitted" value="128" trend="+14%" icon={<Tag />} />
            <StatCard title="Approved" value="74" trend="+9%" icon={<ShieldCheck />} />
            <StatCard title="Vendors Submitting" value="34" trend="+6%" icon={<Database />} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <DataTable
              columns={[
                { header: 'Product ID', accessor: 'id' },
                { header: 'Title', accessor: 'title' },
                { header: 'Vendor', accessor: 'vendor' },
                { header: 'Category', accessor: 'category' },
                { header: 'Price', accessor: 'price' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{row.status}</span> },
                {
                  header: 'Action',
                  render: (row) => (
                    <button
                      onClick={() => approveProduct(row.id)}
                      disabled={row.status === 'Approved'}
                      className="rounded-2xl bg-amber-500 px-4 py-2 text-white text-sm font-semibold disabled:opacity-50 disabled:bg-slate-300"
                    >
                      {row.status === 'Approved' ? 'Approved' : 'Approve'}
                    </button>
                  ),
                },
              ]}
              data={products}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
