'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

type ProductDetail = {
  name: string;
  vendor: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
};

const products: Record<string, ProductDetail> = {
  'prod-1': {
    name: 'Luxury Hookah Set',
    vendor: 'Bespoke Sheesha',
    price: 'AED 340',
    rating: 4.9,
    reviews: 118,
    description: 'A premium hookah package with signature tobacco blends, chilled charcoal, and lounge-ready presentation.',
    highlights: ['Private lounge setup', 'Gold trim finish', 'Complimentary flavor sampler'],
  },
  'prod-2': {
    name: 'Classic Tobacco Bundle',
    vendor: 'The Ember Room',
    price: 'AED 180',
    rating: 4.7,
    reviews: 84,
    description: 'A balanced flavor set built for social evenings and effortless ordering with fast local delivery.',
    highlights: ['3 tobacco flavors', 'Free lighting', '30-minute setup'],
  },
  'prod-3': {
    name: 'Signature Gold Pipe',
    vendor: 'Luxury Lounge',
    price: 'AED 520',
    rating: 4.8,
    reviews: 69,
    description: 'The best-in-class pipe rental for premium events, including VIP service and curated tobacco pairings.',
    highlights: ['VIP delivery', 'Custom bowl', 'Expert service'],
  },
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products[params.id] || products['prod-1']!;

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-5xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Product details</p>
                <h1 className="text-4xl font-black text-slate-900 mt-3">{product.name}</h1>
                <p className="text-slate-600 mt-2">{product.vendor}</p>
              </div>
              <div className="rounded-3xl bg-amber-50 px-5 py-4 text-right">
                <p className="text-sm text-slate-500">Starting price</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{product.price}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 text-slate-600">
                <p>{product.description}</p>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-700">Highlights</p>
                  <ul className="mt-3 space-y-2 text-slate-600">
                    {product.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="text-amber-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <GlassCard className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Rating</span>
                    <span className="text-sm font-semibold text-slate-900">{product.rating} / 5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Reviews</span>
                    <span className="text-sm font-semibold text-slate-900">{product.reviews}</span>
                  </div>
                  <button className="w-full rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold hover:bg-amber-600 transition">Add to cart</button>
                  <button className="w-full rounded-3xl border border-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-100 transition">Save to wishlist</button>
                </div>
              </GlassCard>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Delivery</p>
              <p className="mt-4 text-slate-700 font-semibold">45 min average</p>
            </GlassCard>
            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Availability</p>
              <p className="mt-4 text-slate-700 font-semibold">Book now</p>
            </GlassCard>
            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Package</p>
              <p className="mt-4 text-slate-700 font-semibold">Lounge experience</p>
            </GlassCard>
          </div>
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
