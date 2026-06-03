'use client';

import React, { useState } from 'react';
import { VendorSidebar } from '@/components/vendor/VendorSidebar';
import { DataTable } from '@/components/DataTable';
import { Package, Plus, Edit3 } from 'lucide-react';

const initialProducts = [
  { id: 'VP-101', name: 'Emerald Sheesha Pack', price: 'AED 360', stock: 18, status: 'Active' },
  { id: 'VP-102', name: 'Gold Hookah Set', price: 'AED 780', stock: 6, status: 'Active' },
  { id: 'VP-103', name: 'Signature Tobacco Blend', price: 'AED 220', stock: 24, status: 'Paused' },
];

export default function VendorProducts() {
  const [products] = useState(initialProducts);

  return (
    <div className="flex h-screen bg-slate-50">
      <VendorSidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Product Management</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Marketplace Inventory</h1>
              <p className="text-slate-600 mt-2">Manage product assets, pricing, and publish status for your vendor store.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold shadow-lg shadow-amber-500/20 transition hover:bg-amber-600">
              <Plus size={18} /> Add Product
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={[
                { header: 'SKU', accessor: 'id' },
                { header: 'Product', accessor: 'name' },
                { header: 'Price', accessor: 'price' },
                { header: 'Stock', accessor: 'stock' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span> },
                { header: 'Action', render: () => <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-white text-sm font-semibold hover:bg-slate-800 transition"><Edit3 size={16} /> Edit</button> },
              ]}
              data={products}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
