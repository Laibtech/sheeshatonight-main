'use client';

import React from 'react';
import { MapPin, User, Menu } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export const Header: React.FC = () => {
  const { region, userName } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200/80 px-4 py-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SheeshaTonight" className="h-10 w-auto" />
          <div>
            <div className="text-base md:text-lg font-black tracking-tight text-slate-900">SheeshaTonight</div>
            <p className="text-sm text-slate-500">Customer Dashboard</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 text-slate-600">
          <MapPin size={16} className="text-amber-500" />
          <span className="text-sm font-medium">{region}</span>
        </div>
      </div>
    </header>
  );
};
