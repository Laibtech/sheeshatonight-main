'use client';

import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { CustomerBottomNav } from '@/components/customer/CustomerBottomNav';

type CustomerPageProps = {
  params: {
    slug: string[];
  };
};

const formatTitle = (segments: string[]) =>
  segments
    .map((segment) =>
      segment
        .split(/[-_]/g)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    )
    .join(' / ');

export default function CustomerFallbackPage({ params }: CustomerPageProps) {
  const { isAllowed } = useRoleGuard(['CUSTOMER']);

  if (!isAllowed) return null;

  const pageTitle = formatTitle(params.slug);

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerBottomNav />
      <main className="max-w-6xl mx-auto p-6 lg:p-8 pt-24 lg:pt-28">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500 mb-4">Customer Page</p>
          <h1 className="text-4xl font-black text-slate-900 mb-4">{pageTitle}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            This page is ready and available. The requested route is <span className="font-semibold text-slate-900">/customer/{params.slug.join('/')}</span>.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Use the bottom navigation to explore more customer features.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm text-slate-500">If you expect a dedicated design for this page, I can add it next.</p>
            </div>
          </div>
        </div>
      </main>
      <div className="h-4 lg:hidden" />
    </div>
  );
}
