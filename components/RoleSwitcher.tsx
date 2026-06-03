'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type UserRole } from '@/lib/store';

interface RoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onRoleChange }) => {
  const router = useRouter();
  const { userRole, switchRole, isLoggedIn } = useAuthStore();
  const roles: { key: UserRole; label: string; icon: string }[] = [
    { key: 'CUSTOMER', label: 'Customer', icon: '👤' },
    { key: 'VENDOR', label: 'Vendor Partner', icon: '🏪' },
    { key: 'ADMIN', label: 'Platform Admin', icon: '⚙️' },
  ];

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    onRoleChange?.(role);
    if (isLoggedIn) {
      const routeMap: Record<UserRole, string> = {
        CUSTOMER: '/customer/home',
        VENDOR: '/vendor/dashboard',
        ADMIN: '/admin/dashboard',
      };
      router.push(routeMap[role]);
    }
  };

  return (
    <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl border border-slate-300/70">
      {roles.map((role) => (
        <button
          key={role.key}
          onClick={() => handleSwitch(role.key)}
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition text-sm md:text-base ${
            userRole === role.key
              ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-lg'
              : 'bg-white text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="mr-2">{role.icon}</span>
          {role.label}
        </button>
      ))}
    </div>
  );
};
