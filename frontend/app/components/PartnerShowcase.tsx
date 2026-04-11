'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Stethoscope, Truck, Award } from 'lucide-react';

const PARTNERS = [
  { name: 'Sharma & Co. JV', category: 'Infrastructure Giant', icon: Building2, color: '#0A3992' },
  { name: 'Nepal Meditech', category: 'Surgical Elite', icon: Stethoscope, color: '#B93654' },
  { name: 'MAW Enterprises (JCB)', category: 'Strategic Equipment', icon: Truck, color: '#d97706' },
  { name: 'Kalika Construction', category: 'National Grade-A', icon: Building2, color: '#059669' },
  { name: 'Hospital Solutions NP', category: 'Medical Supply', icon: Stethoscope, color: '#7c3aed' },
  { name: 'Tundi Construction', category: 'Roads & Bridges', icon: Building2, color: '#2563eb' },
  { name: 'Surgical Solutions', category: 'Health Infrastructure', icon: Stethoscope, color: '#db2777' },
  { name: 'Caterpillar Nepal', category: 'Heavy Machinery', icon: Truck, color: '#ea580c' },
];

export const PartnerShowcase = () => {
  // Double the list for seamless infinite scroll
  const scrollingPartners = [...PARTNERS, ...PARTNERS];

  return (
    <div className="fixed top-[84px] left-0 w-full z-40 overflow-hidden py-1.5"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226,232,240,0.5)',
      }}
    >
      <div className="flex items-center gap-1.5 px-6 mb-1 opacity-50">
         <Award size={10} className="text-slate-400" />
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">Strategic Elite Partners</span>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{ x: [0, -1920] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 40,
              ease: 'linear',
            },
          }}
          className="flex whitespace-nowrap gap-6 pl-6"
        >
          {scrollingPartners.map((partner, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all hover:scale-105 cursor-pointer group"
              style={{
                background: 'rgba(255,255,255,0.9)',
                borderColor: 'rgba(226,232,240,0.8)',
                boxShadow: '0 4px 12px -2px rgba(15,23,42,0.04)',
              }}
            >
              <div className="p-2 rounded-xl text-white shadow-sm" style={{ background: partner.color }}>
                <partner.icon size={14} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-900 tracking-tight group-hover:text-[#B93654] transition-colors uppercase italic">
                  {partner.name}
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                  {partner.category}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Fade edges */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white/80 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/80 to-transparent pointer-events-none" />
    </div>
  );
};
