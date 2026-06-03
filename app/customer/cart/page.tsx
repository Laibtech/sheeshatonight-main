'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, CreditCard } from 'lucide-react';

export default function CartPage() {
  const { isAllowed } = useRoleGuard(['CUSTOMER']);

  if (!isAllowed) return null;

  const cartItems = [
    { id: 1, name: 'Luxury Lounge Premium Setup', price: 450, quantity: 1, venue: 'DIFC' },
    { id: 2, name: 'Deluxe Accessories Pack', price: 120, quantity: 2, venue: 'Marina' },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-2xl mx-auto p-4 lg:p-6">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Shopping Cart</h1>
        <p className="text-slate-600 mb-8">{cartItems.length} items in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-2xl">
                  🎟️
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {item.venue}
                  </p>
                  <p className="text-sm font-semibold text-amber-600 mt-2">AED {item.price}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button className="text-slate-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 h-fit">
            <h2 className="font-bold text-slate-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">AED {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (5%)</span>
                <span className="font-semibold text-slate-900">AED {tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-black text-amber-600">AED {total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-400 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition flex items-center justify-center gap-2">
              <CreditCard size={18} />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </main>
      <div className="h-4" />
    </div>
  );
}
