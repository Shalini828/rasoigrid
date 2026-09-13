import React from 'react';
import { clsx } from 'clsx';
import type { RescueStatus, PriorityLevel } from '../../core/types/models';

interface StatusPillProps {
  status?: RescueStatus | string;
  priority?: PriorityLevel | string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  priority,
  size = 'md',
  pulse = false,
}) => {
  let label = status || priority || 'Active';
  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (status) {
    switch (status) {
      case 'available':
        label = 'Surplus Available';
        colorClasses = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
        dotColor = 'bg-emerald-400';
        break;
      case 'dispatching':
        label = 'AI Dispatching';
        colorClasses = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
        dotColor = 'bg-cyan-400';
        break;
      case 'in_transit':
        label = 'Fleet In-Transit';
        colorClasses = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
        dotColor = 'bg-indigo-400';
        break;
      case 'delivered_human':
        label = 'People Recovered';
        colorClasses = 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40';
        dotColor = 'bg-emerald-400';
        break;
      case 'diverted_circular':
        label = 'Circular Bio-Loop';
        colorClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        dotColor = 'bg-amber-400';
        break;
      case 'predicted':
        label = 'AI Forecasted';
        colorClasses = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
        dotColor = 'bg-purple-400';
        break;
      default:
        break;
    }
  } else if (priority) {
    switch (priority) {
      case 'critical':
        label = 'Critical (<2h)';
        colorClasses = 'bg-rose-500/15 text-rose-300 border-rose-500/40';
        dotColor = 'bg-rose-400';
        break;
      case 'high':
        label = 'High Priority';
        colorClasses = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
        dotColor = 'bg-amber-400';
        break;
      case 'medium':
        label = 'Standard Route';
        colorClasses = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
        dotColor = 'bg-blue-400';
        break;
      default:
        label = 'Flexible';
        colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
        dotColor = 'bg-slate-400';
        break;
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-all',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs tracking-wide',
        colorClasses
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', dotColor, pulse && 'animate-ping')} />
      {label}
    </span>
  );
};
