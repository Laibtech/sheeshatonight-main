'use client';

import React from 'react';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { GlassCard } from '@/components/GlassCard';

const faqs = [
  { question: 'How do I change my booking time?', answer: 'Open your order details and select the reschedule option to update your time.' },
  { question: 'How can I apply a promo code?', answer: 'Enter your code at checkout and confirm the discount before placing your order.' },
  { question: 'What is the cancellation policy?', answer: 'Cancellations within 30 minutes are fully refundable. Later cancellations may incur a fee.' },
];

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-5xl mx-auto p-4 lg:p-6 pt-24 lg:pt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Customer Support</h1>
          <p className="text-slate-600 mt-2">Need help with an order or membership? Our support team is ready to assist.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {faqs.map((faq) => (
              <GlassCard key={faq.question} className="p-6">
                <p className="font-semibold text-slate-900">{faq.question}</p>
                <p className="mt-3 text-slate-600">{faq.answer}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Support request</p>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Contact concierge</h2>
            <p className="mt-4 text-slate-600">Send a message to our team for order assistance, VIP requests, or billing questions.</p>
            <div className="mt-6 space-y-4">
              <input type="text" placeholder="Subject" className="w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
              <textarea placeholder="Describe your request" className="w-full min-h-[180px] rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
              <button className="w-full rounded-3xl bg-amber-500 px-6 py-4 text-white font-semibold hover:bg-amber-600 transition">Send request</button>
            </div>
          </GlassCard>
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
