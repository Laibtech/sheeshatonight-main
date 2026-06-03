'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-5xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Wallet</h1>
          <p className="text-slate-600 mt-2">Manage your balance, gift credits, and saved payment options.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <GlassCard className="p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Balance</p>
            <p className="mt-4 text-5xl font-black text-slate-900">AED 410</p>
            <p className="text-slate-500 mt-2">Available credit for instant bookings and offers.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Saved cards</p>
                <p className="mt-3 font-semibold text-slate-900">2 cards</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Rewards</p>
                <p className="mt-3 font-semibold text-slate-900">AED 80</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-slate-900">Recent activity</h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Redeemed reward</p>
                <p className="text-sm text-slate-500 mt-1">AED 25 discount on next booking</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">Top-up</p>
                <p className="text-sm text-slate-500 mt-1">AED 200 added from card</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
