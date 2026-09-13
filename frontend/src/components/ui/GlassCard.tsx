import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'emerald' | 'cyan' | 'amber' | 'coral' | 'indigo' | 'none';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: 'border-slate-800/80 bg-slate-900/60 shadow-lg',
    emerald: 'border-emerald-500/25 bg-slate-900/70 shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]',
    cyan: 'border-cyan-500/25 bg-slate-900/70 shadow-[0_0_25px_-5px_rgba(6,182,212,0.15)]',
    amber: 'border-amber-500/25 bg-slate-900/70 shadow-[0_0_25px_-5px_rgba(245,158,11,0.15)]',
    coral: 'border-rose-500/25 bg-slate-900/70 shadow-[0_0_25px_-5px_rgba(244,63,94,0.15)]',
    indigo: 'border-indigo-500/25 bg-slate-900/70 shadow-[0_0_25px_-5px_rgba(99,102,241,0.15)]',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'backdrop-blur-md rounded-xl border p-5 transition-all duration-300',
          glowStyles[glow],
          interactive && 'hover:border-emerald-500/40 hover:bg-slate-900/90 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
