'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

const wishlistItems = [
  { id: '1', title: 'Signature Gold Pipe', vendor: 'Luxury Lounge', price: 'AED 520' },
  { id: '2', title: 'Classic Tobacco Bundle', vendor: 'The Ember Room', price: 'AED 180' },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-6xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Wishlist</h1>
          <p className="text-slate-600 mt-2">Keep track of your favorite lounges and packages for easy booking later.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {wishlistItems.map((item) => (
            <GlassCard key={item.id} className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{item.vendor}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{item.price}</span>
                  <button className="rounded-3xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100 transition">Add to cart</button>
                </div>
              </div>
            </GlassCard>
          ))}
          {wishlistItems.length === 0 && (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              Your wishlist is empty. Browse products to add favorites.
            </div>
          )}
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
