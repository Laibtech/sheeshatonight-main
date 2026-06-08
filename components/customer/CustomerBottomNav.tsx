// Customer Bottom Navigation Component
'use client';

import React from 'react';
import Image from 'next/image';
import { Home, Grid, Search, ShoppingBag, Heart, Clock, MapPin, Wallet, User, Bell, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';

const CUSTOMER_NAVIGATION = [
  { label: 'Home', href: '/customer/home', icon: Home },
  { label: 'Categories', href: '/customer/categories', icon: Grid },
  { label: 'Search', href: '/customer/search', icon: Search },
  { label: 'Cart', href: '/customer/cart', icon: ShoppingBag },
  { label: 'Wishlist', href: '/customer/wishlist', icon: Heart },
  { label: 'Orders', href: '/customer/orders', icon: Clock },
  { label: 'Track Order', href: '/customer/track', icon: MapPin },
  { label: 'Wallet', href: '/customer/wallet', icon: Wallet },
  { label: 'Profile', href: '/customer/profile', icon: User },
  { label: 'Notifications', href: '/customer/notifications', icon: Bell },
];

export const CustomerBottomNav: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const primaryItems = CUSTOMER_NAVIGATION.slice(0, 5);
  const menuItems = CUSTOMER_NAVIGATION.slice(5);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-slate-50 border-t border-slate-200 z-40 lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 px-2 transition ${
                  isActive
                    ? 'bg-amber-50 text-amber-600'
                    : 'text-slate-600 hover:text-amber-500'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-semibold mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex-col p-6 z-40">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-black text-slate-900">Customer</h2>
          <p className="text-xs text-slate-500 mt-1">Shopping Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto space-y-2">
          {CUSTOMER_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-700 hover:bg-red-50 transition text-sm font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Padding for mobile */}
      <div className="lg:hidden h-24" />
    </>
  );
};
