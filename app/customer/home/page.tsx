'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';
import { Search, MapPin, Star, ShoppingBag, Heart, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function CustomerHome() {
  const { isAllowed, userRole } = useRoleGuard(['CUSTOMER']);

  if (!isAllowed) {
    return null;
  }

  const { userName } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Header with Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Welcome back, {userName || 'Guest'}!
          </h1>
          <p className="text-slate-600 mt-2">Find and book your favorite sheesha lounges</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search lounges, venues..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Lounges</h2>
              <p className="text-slate-600 text-sm">Today's best deals and popular picks</p>
            </div>
            <a href="/customer/search" className="text-amber-600 font-semibold hover:text-amber-700 text-sm">
              View All →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Bespoke Sheesha',
                location: 'Downtown Dubai',
                rating: 4.8,
                reviews: 324,
                price: 'AED 150-400',
                badge: 'Top Rated',
              },
              {
                name: 'The Ember Room',
                location: 'Marina',
                rating: 4.6,
                reviews: 287,
                price: 'AED 120-350',
                badge: 'New',
              },
              {
                name: 'Luxury Lounge',
                location: 'DIFC',
                rating: 4.9,
                reviews: 456,
                price: 'AED 180-500',
                badge: 'Premium',
              },
            ].map((lounge, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-300 transition group cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-400 text-4xl font-black group-hover:from-amber-200 group-hover:to-orange-200 transition">
                  🌬️
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{lounge.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {lounge.location}
                      </p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-100 transition">
                      <Heart size={18} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(lounge.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                          />
                        ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-900">{lounge.rating}</span>
                    <span className="text-xs text-slate-500">({lounge.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-slate-900">{lounge.price}</p>
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 font-semibold rounded-full">
                      {lounge.badge}
                    </span>
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition text-sm">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '✨', label: 'Premium', count: 24 },
              { emoji: '🎉', label: 'Events', count: 18 },
              { emoji: '👥', label: 'Group Bookings', count: 42 },
              { emoji: '🌙', label: 'Late Night', count: 31 },
            ].map((cat, idx) => (
              <button
                key={idx}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition text-center"
              >
                <p className="text-4xl mb-2">{cat.emoji}</p>
                <p className="font-semibold text-slate-900 text-sm">{cat.label}</p>
                <p className="text-xs text-slate-500 mt-1">{cat.count} available</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 bg-gradient-to-r from-amber-500 to-orange-400 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black mb-2">Loyalty Rewards</h2>
              <p className="text-amber-50 text-sm">Earn points on every booking and unlock exclusive deals</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-3xl font-black">2,450</p>
                <p className="text-xs text-amber-50 mt-1">Points Available</p>
              </div>
              <button className="px-6 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition">
                Redeem Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom padding */}
      <div className="h-4" />
    </div>
  );
}
