import { 
  BarChart3, 
  Download, 
  ShieldCheck, 
  Flame, 
  Utensils, 
  Recycle, 
  FileCheck2, 
  Award 
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import { useRescueStore } from '../../stores/useRescueStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const ImpactAnalyticsPage: React.FC = () => {
  const { impactMetrics } = useRescueStore();

  const monthlyImpactData = [
    { month: 'Apr', mealsServed: 32000, circularKg: 4500, methaneKg: 2800 },
    { month: 'May', mealsServed: 41000, circularKg: 6200, methaneKg: 3400 },
    { month: 'Jun', mealsServed: 48000, circularKg: 7800, methaneKg: 4200 },
    { month: 'Jul', mealsServed: 54000, circularKg: 8900, methaneKg: 4900 },
    { month: 'Aug', mealsServed: 68000, circularKg: 11200, methaneKg: 5800 },
    { month: 'Sep (MTD)', mealsServed: 74500, circularKg: 13400, methaneKg: 6900 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ISO 14064 VERIFIED LEDGER
            </span>
            <h1 className="text-xl font-bold text-white font-mono">
              ESG & Methane Avoidance Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Certified greenhouse gas accounting, scope 3 emissions avoidance, and verifiable audit records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Generating Board-Ready ESG Audit Report (PDF)...')}
            className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT ESG REPORT (PDF/CSV)</span>
          </button>
        </div>
      </div>

      {/* Top Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Total Verified Meals Rescued"
          value={impactMetrics?.totalMealsRecovered || 482930}
          unit="Meals"
          delta="100% Social Redistribution"
          theme="emerald"
          icon={Utensils}
        />
        <MetricTile
          label="Cumulative Methane Avoided"
          value={impactMetrics?.methaneAvoidedKg || 34770}
          unit="kg CH4"
          delta="28x more potent than CO2"
          theme="cyan"
          icon={Flame}
        />
        <MetricTile
          label="CO2e Greenhouse Gas Offset"
          value={impactMetrics?.co2eAvoidedTons || 425.8}
          unit="Tons CO2e"
          delta="Equivalent to 19,000 trees"
          theme="indigo"
          icon={BarChart3}
        />
        <MetricTile
          label="Zero-Landfill Circular Rate"
          value="99.4"
          unit="%"
          delta="Target: 99.9% by Q4"
          theme="amber"
          icon={Recycle}
        />
      </div>

      {/* Main Growth & Recovery Breakdown Chart */}
      <GlassCard glow="indigo" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base">
              Monthly Food Recovery by Destination Stream (6-Month Trajectory)
            </h3>
            <p className="text-xs text-slate-400">
              Meals Saved for Humans (Emerald) vs Circular Upcycling (Amber) vs Methane Avoided (Cyan)
            </p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyImpactData}>
              <XAxis dataKey="month" stroke="#475569" fontSize={12} fontFamily="monospace" />
              <YAxis stroke="#475569" fontSize={12} fontFamily="monospace" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="mealsServed" name="Meals for People" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="circularKg" name="Circular Biomass (kg)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="methaneKg" name="Methane Avoided (kg)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Audit Certificate & Methodology Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard glow="emerald" className="p-6 space-y-4 border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Third-Party GHG Verification Protocol</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All carbon emissions and methane avoidance calculations strictly adhere to the <strong>UNEP Food Waste Index</strong> and <strong>IPCC Tier-2 Waste Disposal Emissions Factors</strong>.
          </p>
          <div className="space-y-2 text-xs font-mono text-slate-400 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div>• 1 kg Cooked Organic Waste in Landfill = 1.8 kg CH4 / 50.4 kg CO2e over 20-year GWP</div>
            <div>• Real-time digital weight capture at donor loading bay via calibrated scales</div>
            <div>• Continuous geo-tagged chain-of-custody cryptographic receipts</div>
          </div>
        </GlassCard>

        <GlassCard glow="none" className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Corporate Tax Deduction Ledger (Sec 80G)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Commercial enterprise donors can automatically export audited quarterly donation logs to claim statutory corporate social responsibility (CSR) credits and food donation tax relief.
          </p>
          <button
            onClick={() => alert('Downloading Q3 80G Ledger CSV...')}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>DOWNLOAD RECENT 80G COMPLIANCE PACK</span>
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
