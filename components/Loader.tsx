'use client';

import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
    </div>
  );
};
