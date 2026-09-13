import React from 'react';
import { clsx } from 'clsx';

interface LivePulseProps {
  color?: 'emerald' | 'amber' | 'coral' | 'cyan' | 'indigo';
  label?: string;
  size?: 'sm' | 'md';
}

export const LivePulse: React.FC<LivePulseProps> = ({
  color = 'emerald',
  label = 'LIVE',
  size = 'md',
}) => {
  const colorMap = {
    emerald: {
      ping: 'bg-emerald-400',
      dot: 'bg-emerald-500',
      text: 'text-emerald-400',
      container: 'bg-emerald-500/10 border-emerald-500/30',
    },
    amber: {
      ping: 'bg-amber-400',
      dot: 'bg-amber-500',
      text: 'text-amber-400',
      container: 'bg-amber-500/10 border-amber-500/30',
    },
    coral: {
      ping: 'bg-rose-400',
      dot: 'bg-rose-500',
      text: 'text-rose-400',
      container: 'bg-rose-500/10 border-rose-500/30',
    },
    cyan: {
      ping: 'bg-cyan-400',
      dot: 'bg-cyan-500',
      text: 'text-cyan-400',
      container: 'bg-cyan-500/10 border-cyan-500/30',
    },
    indigo: {
      ping: 'bg-indigo-400',
      dot: 'bg-indigo-500',
      text: 'text-indigo-400',
      container: 'bg-indigo-500/10 border-indigo-500/30',
    },
  };

  const scheme = colorMap[color];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 uppercase font-mono tracking-wider font-semibold',
        size === 'sm' ? 'text-[10px]' : 'text-xs',
        scheme.container,
        scheme.text
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={clsx(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            scheme.ping
          )}
        />
        <span className={clsx('relative inline-flex rounded-full h-2 w-2', scheme.dot)} />
      </span>
      {label}
    </span>
  );
};
