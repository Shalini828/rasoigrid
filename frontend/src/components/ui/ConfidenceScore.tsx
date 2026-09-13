import React from 'react';
import { clsx } from 'clsx';
import { Sparkles } from 'lucide-react';

interface ConfidenceScoreProps {
  score: number; // 0 - 100
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const getColors = (val: number) => {
    if (val >= 90) return { text: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-500/10' };
    if (val >= 75) return { text: 'text-cyan-400', stroke: '#06b6d4', bg: 'bg-cyan-500/10' };
    if (val >= 60) return { text: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', stroke: '#f43f5e', bg: 'bg-rose-500/10' };
  };

  const colors = getColors(score);

  return (
    <div className="inline-flex items-center gap-1.5 font-mono">
      <div className={clsx('flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700/60', colors.bg)}>
        <Sparkles className={clsx('w-3 h-3', colors.text)} />
        <span className={clsx('font-bold', size === 'sm' ? 'text-xs' : 'text-sm', colors.text)}>
          {score.toFixed(0)}%
        </span>
      </div>
      {showLabel && (
        <span className="text-[11px] text-slate-400 font-sans">
          AI Confidence
        </span>
      )}
    </div>
  );
};
