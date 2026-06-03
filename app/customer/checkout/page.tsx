'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-5xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
          <p className="text-slate-600 mt-2">Review your booking, confirm your details, and place your order.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <GlassCard className="p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Order</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-3">Luxury Hookah Set</h2>
                  <p className="text-slate-500 mt-2">Bespoke Sheesha • AED 340</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">Confirmed</span>
              </div>
              <div className="space-y-4 text-slate-600">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Delivery</p>
                    <p className="mt-2">Express lounge delivery</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Date</p>
                    <p className="mt-2">Tonight at 10:30 PM</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Guests</p>
                    <p className="mt-2">4 people</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Promo</p>
                    <p className="mt-2">AED 25 off</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-xl font-bold text-slate-900">Payment</h2>
              <div className="mt-6 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Card number</span>
                  <input type="text" defaultValue="**** **** **** 4821" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Expiry</span>
                    <input type="text" defaultValue="12/27" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">CVV</span>
                    <input type="password" defaultValue="•••" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
                  </label>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-8">
              <h2 className="text-xl font-bold text-slate-900">Summary</h2>
              <div className="mt-6 space-y-4 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Order subtotal</span>
                  <span className="font-semibold text-slate-900">AED 340</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service fee</span>
                  <span className="font-semibold text-slate-900">AED 15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Promo savings</span>
                  <span className="font-semibold text-emerald-700">- AED 25</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between font-bold text-slate-900">
                  <span>Total</span>
                  <span>AED 330</span>
                </div>
              </div>
              <button className="mt-8 w-full rounded-3xl bg-amber-500 px-6 py-4 text-white font-semibold hover:bg-amber-600 transition">Place order</button>
            </GlassCard>

            <GlassCard className="p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Need help?</p>
              <p className="mt-4 text-slate-600">Reach out to support for live order updates and concierge assistance.</p>
              <button className="mt-6 rounded-3xl border border-slate-200 px-6 py-3 text-slate-700 hover:bg-slate-100 transition">Chat with support</button>
            </GlassCard>
          </div>
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
