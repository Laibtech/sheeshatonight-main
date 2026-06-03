'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

const categories = [
  { title: 'Premium Lounges', description: 'Luxury venues with curated menus', icon: '✨' },
  { title: 'Late Night', description: 'Orders ready after 11 PM', icon: '🌙' },
  { title: 'Group Bookings', description: 'Group-friendly sheesha packages', icon: '👥' },
  { title: 'Signature Flavors', description: 'Top-rated tobacco blends', icon: '🔥' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-6xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Browse Categories</h1>
          <p className="text-slate-600 mt-2">Find the perfect sheesha experience by mood, venue type, or flavor profile.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <GlassCard key={category.title} className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{category.title}</h2>
                  <p className="text-sm text-slate-500 mt-2">{category.description}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Popular Filters</h2>
          <div className="flex flex-wrap gap-3">
            {['Free delivery', 'VIP package', 'Top rated', 'New arrivals'].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">{tag}</span>
            ))}
          </div>
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
