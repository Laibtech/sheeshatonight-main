// Admin Sidebar Navigation Component
'use client';

import React from 'react';
import { LayoutDashboard, ShoppingCart, Store, Users, Package, BarChart3, Wallet, FileText, Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useState } from 'react';

const ADMIN_NAVIGATION = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders Management', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Vendors Management', href: '/admin/vendors', icon: Store },
  { label: 'Customers Management', href: '/admin/customers', icon: Users },
  { label: 'Product Approval', href: '/admin/products', icon: Package },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Finance', href: '/admin/finance', icon: Wallet },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'CMS Management', href: '/admin/cms', icon: Settings },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC = () => {
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
        {ADMIN_NAVIGATION.map((item) => {
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
          <h2 className="text-xl font-black text-slate-900">Admin Panel</h2>
          <p className="text-xs text-slate-500 mt-1">Management System</p>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <NavContent />
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-black text-slate-900">Admin</h1>
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
