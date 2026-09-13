import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricTileProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  subtext?: string;
  icon?: LucideIcon;
  theme?: 'emerald' | 'cyan' | 'amber' | 'coral' | 'indigo';
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  unit,
  delta,
  subtext,
  icon: Icon,
  theme = 'emerald',
}) => {
  const iconColorStyles = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    coral: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  };

  return (
    <GlassCard glow={theme} className="relative overflow-hidden p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {Icon && (
          <div className={clsx('p-2 rounded-lg border', iconColorStyles[theme])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
        {delta && (
          <span className="inline-flex items-center text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            {delta}
          </span>
        )}
        {subtext && <span className="truncate text-slate-400">{subtext}</span>}
      </div>
    </GlassCard>
  );
};
