import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white/90 backdrop-blur-md 
        border border-slate-200/70 
        rounded-3xl shadow-xl 
        p-6 transition-all duration-300 
        hover:border-slate-300/80 hover:shadow-[0_0_40px_rgba(234,179,8,0.12)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
