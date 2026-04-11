'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface TaxHighlight {
  highlight: string;
  type: 'incentive' | 'burden';
  sector: string;
}

interface TaxHeatmapProps {
  highlights: TaxHighlight[];
}

export const TaxHeatmap: React.FC<TaxHeatmapProps> = ({ highlights }) => {
  const [filter, setFilter] = useState<'all' | 'incentive' | 'burden'>('all');

  const filtered = highlights?.filter(h => filter === 'all' || h.type === filter) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter buttons */}
        <div className="flex gap-2 p-1.5 rounded-2xl border bg-slate-50/80 shadow-sm"
          style={{ borderColor: 'rgba(226,232,240,0.8)' }}>
          {(['all', 'incentive', 'burden'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-white/50 border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
           <div className="col-span-full py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
             No tax data available for this filter.
           </div>
        ) : (
          filtered.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-3xl border transition-all duration-300 group hover:-translate-y-1"
              style={{
                background: h.type === 'incentive' ? 'rgba(22,163,74,0.03)' : 'rgba(185,54,84,0.03)',
                borderColor: h.type === 'incentive' ? 'rgba(22,163,74,0.15)' : 'rgba(185,54,84,0.15)',
                boxShadow: '0 4px 16px -4px rgba(15,23,42,0.05)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = h.type === 'incentive' 
                  ? '0 12px 32px -8px rgba(22,163,74,0.15)' 
                  : '0 12px 32px -8px rgba(185,54,84,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px -4px rgba(15,23,42,0.05)';
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
                  style={{ 
                    background: h.type === 'incentive' ? 'rgba(22,163,74,0.1)' : 'rgba(185,54,84,0.1)',
                    color: h.type === 'incentive' ? '#15803d' : '#B93654'
                  }}>
                  {h.sector}
                </span>
                {h.type === 'incentive' ? (
                  <TrendingUp className="text-green-600 w-5 h-5 shrink-0" strokeWidth={2.5} />
                ) : (
                  <TrendingDown className="w-5 h-5 shrink-0" style={{ color: '#B93654' }} strokeWidth={2.5} />
                )}
              </div>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                {h.highlight}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
