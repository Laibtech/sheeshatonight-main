'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

const steps = [
  { title: 'Order placed', time: '9:42 PM', completed: true },
  { title: 'Preparing lounge', time: '9:55 PM', completed: true },
  { title: 'On the way', time: '10:10 PM', completed: true },
  { title: 'Arriving soon', time: '10:25 PM', completed: false },
];

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-5xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Track Your Order</h1>
          <p className="text-slate-600 mt-2">Follow every step from confirmation to arrival and see when your lounge set will be ready.</p>
        </div>

        <GlassCard className="p-8">
          <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Current status</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">Arriving soon</p>
              </div>
              <div className="rounded-3xl bg-white px-5 py-4 shadow-sm">
                <p className="text-sm text-slate-500">Estimated arrival</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">10:25 PM</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold text-white" style={{ backgroundColor: step.completed ? '#f59e0b' : '#cbd5e1' }}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
