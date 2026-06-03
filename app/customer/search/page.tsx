'use client';

import React, { useState } from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { ProductCard } from '@/components/ProductCard';

type Product = {
  id: string;
  name: string;
  vendor: string;
  price: string;
  rating: number;
  reviews: number;
  badge: string;
};

const products: Product[] = [
  { id: 'prod-1', name: 'Luxury Hookah Set', vendor: 'Bespoke Sheesha', price: 'AED 340', rating: 4.9, reviews: 118, badge: 'Premium' },
  { id: 'prod-2', name: 'Classic Tobacco Bundle', vendor: 'The Ember Room', price: 'AED 180', rating: 4.7, reviews: 84, badge: 'Top Seller' },
  { id: 'prod-3', name: 'Signature Gold Pipe', vendor: 'Luxury Lounge', price: 'AED 520', rating: 4.8, reviews: 69, badge: 'Exclusive' },
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-6xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Product Listing</h1>
          <p className="text-slate-600 mt-2">Discover the latest sheesha packages available in your area.</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Search products, vendors, flavors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-700 outline-none focus:border-amber-500 shadow-sm"
          />
          <button className="rounded-3xl bg-amber-500 px-6 py-4 text-white font-semibold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition">Filter</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} actionLabel="View" />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              No products matched your search.
            </div>
          )}
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
