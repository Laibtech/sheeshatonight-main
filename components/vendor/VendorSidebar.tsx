// Vendor Sidebar Navigation Component
'use client';

import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, BarChart3, Wallet, MessageSquare, Zap, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';

const VENDOR_NAVIGATION = [
  { label: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
  { label: 'Products', href: '/vendor/products', icon: Package },
  { label: 'Inventory', href: '/vendor/inventory', icon: BarChart3 },
  { label: 'Customers', href: '/vendor/customers', icon: Users },
  { label: 'Analytics', href: '/vendor/analytics', icon: Wallet },
  { label: 'Earnings', href: '/vendor/earnings', icon: Wallet },
  { label: 'Promotions', href: '/vendor/promotions', icon: Zap },
  { label: 'Messages', href: '/vendor/messages', icon: MessageSquare },
  { label: 'Notifications', href: '/vendor/notifications', icon: Bell },
  { label: 'Settings', href: '/vendor/settings', icon: Settings },
];

import { Users } from 'lucide-react';

export const VendorSidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const NavContent = () => (
    <>
      <div className="space-y-2">
        {VENDOR_NAVIGATION.map((item) => {
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
      </div>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-700 hover:bg-red-50 transition text-sm font-medium"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex-col p-6 z-40">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-slate-900">Vendor Portal</h2>
          <p className="text-xs text-slate-500 mt-1">Seller Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <NavContent />
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-black text-slate-900">Vendor</h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <nav className="bg-white border-t border-slate-200 p-4 space-y-2 max-h-96 overflow-y-auto">
            <NavContent />
          </nav>
        )}
      </div>
    </>
  );
};
