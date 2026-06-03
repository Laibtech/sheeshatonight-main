'use client';

import React from 'react';
import { RoleGuard } from '@/components/RoleGuard';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['VENDOR']}>{children}</RoleGuard>;
}
