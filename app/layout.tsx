import type { Metadata } from 'next';
import './globals.css';
import { AuthHydration } from '@/components/AuthHydration';

export const metadata: Metadata = {
  title: 'SheeshaTonight - Premium Sheesha Rental',
  description: 'Luxury sheesha rental and tobacco marketplace for UAE and UK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <AuthHydration />
        {children}
      </body>
    </html>
  );
}
