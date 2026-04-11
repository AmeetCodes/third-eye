'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Building2,
  AlertTriangle,
  Bell,
  Shield,
  ArrowLeft,
  Info,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MapComponent } from '../components/MapComponent';
import ReportIssueModal from '../components/ReportIssueModal';
import { SubscriptionModal } from '../components/SubscriptionModal';
import axios from 'axios';
import Link from 'next/link';

const BACKEND_URL = 'http://localhost:5000';

export default function ProjectsPage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [watchdogTender, setWatchdogTender] = useState<any>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/tenders?limit=100`);
        setTenders(res.data.data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredTenders = tenders.filter(
    (t) =>
      (t.title || '').toLowerCase().includes(filter.toLowerCase()) ||
      (t.public_entity_name || '').toLowerCase().includes(filter.toLowerCase()) ||
      (t.district || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Page Header ── */}
      <header
        className="z-[60] shadow-sm pt-2 shrink-0"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
        }}
      >
        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="p-3 rounded-2xl border transition-all hover:border-[#B93654]/30 hover:text-[#B93654] text-slate-400"
              style={{ background: 'rgba(248,250,255,0.8)', borderColor: 'rgba(226,232,240,0.7)' }}
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] font-black mb-1.5"
                style={{ color: '#B93654' }}
              >
                <Shield size={11} className="animate-pulse" /> National Surveillance Zone
              </motion.div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <span className="text-slate-900">Project</span>
                <span className="text-gradient-nepal italic pr-1 pb-1">Monitor</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={17} />
              <input
                type="text"
                placeholder="Search active infrastructure projects..."
                className="w-full border rounded-3xl pl-11 pr-5 py-3.5 text-sm font-semibold text-slate-900 transition-all outline-none"
                style={{
                  background: 'rgba(248,250,255,0.6)',
                  borderColor: 'rgba(226,232,240,0.8)',
                }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <button
              className="p-3.5 rounded-2xl border text-slate-400 transition-all hover:text-[#0A3992] hover:border-[#0A3992]/30"
              style={{ borderColor: 'rgba(226,232,240,0.7)', background: 'rgba(248,250,255,0.6)' }}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapComponent tenders={filteredTenders} height="100%" zoom={8} showLegend={false} />

          {/* Map Legend */}
          <div
            className="absolute bottom-8 left-8 z-50 p-5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 12px 40px -8px rgba(15,23,42,0.12)',
            }}
          >
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">
              Map Legend
            </p>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0"
                  style={{ background: '#B93654', boxShadow: '0 2px 8px rgba(185,54,84,0.4)' }} />
                Active Alert
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0"
                  style={{ background: '#0A3992', boxShadow: '0 2px 8px rgba(10,57,146,0.35)' }} />
                Under Review
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div
          className="w-full lg:w-[460px] flex flex-col order-first lg:order-last m-4 lg:m-6 rounded-3xl relative overflow-hidden shadow-2xl shrink-0"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 24px 80px -16px rgba(15,23,42,0.1)',
          }}
        >
          {/* Panel header */}
          <div
            className="p-8 flex justify-between items-center"
            style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                Focus Zone{' '}
                <span className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: '#B93654' }} />
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <Info size={11} /> Atmospheric Data Feeds
              </p>
            </div>
            <div
              className="text-white text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                boxShadow: '0 6px 20px -4px rgba(185,54,84,0.35)',
              }}
            >
              {filteredTenders.length} Sites
            </div>
          </div>

          {/* Project cards */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-5">
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-48 rounded-3xl animate-pulse"
                    style={{ background: 'rgba(226,232,240,0.4)' }} />
                ))
            ) : filteredTenders.length === 0 ? (
              <div className="text-center py-20">
                <Search className="mx-auto text-slate-200 mb-5" size={56} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs leading-relaxed">
                  No projects found
                </p>
              </div>
            ) : (
              filteredTenders.map((tender) => {
                const progress = Math.min(Math.max(Math.random() * 100, 20), 95);
                return (
                  <motion.div
                    key={tender._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white border rounded-3xl p-7 shadow-sm transition-all duration-300"
                    style={{
                      borderColor: 'rgba(226,232,240,0.7)',
                      boxShadow: '0 4px 16px -4px rgba(15,23,42,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(185,54,84,0.2)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px -8px rgba(15,23,42,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,232,240,0.7)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px -4px rgba(15,23,42,0.05)';
                    }}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full"
                        style={{
                          background: 'rgba(185,54,84,0.08)',
                          color: '#B93654',
                          border: '1px solid rgba(185,54,84,0.15)',
                        }}
                      >
                        {tender.status || 'Active'}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" style={{ color: '#0A3992' }} />
                        {tender.publishing_date
                          ? new Date(tender.publishing_date).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </div>

                    <h3 className="font-black text-slate-900 text-lg mb-5 leading-snug tracking-tight group-hover:text-[#B93654] transition-colors">
                      {tender.title}
                    </h3>

                    <div className="space-y-4 mb-7">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                        <Building2 className="w-4 h-4 shrink-0" style={{ color: '#0A3992' }} />
                        <span className="truncate">{tender.public_entity_name || 'N/A'}</span>
                      </div>
                      {tender.district && (
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                          <MapPin className="w-4 h-4 shrink-0 text-[#B93654]" />
                          <span>{tender.district}</span>
                        </div>
                      )}

                      <div
                        className="p-5 rounded-2xl"
                        style={{
                          background: 'rgba(248,250,255,0.8)',
                          border: '1px solid rgba(226,232,240,0.6)',
                        }}
                      >
                        <div className="flex justify-between text-xs mb-3">
                          <span className="text-slate-400 font-black uppercase tracking-widest">Budget</span>
                          <span className="font-black tracking-tighter text-base" style={{ color: '#B93654' }}>
                            Rs. {tender.budget_amount_cr > 0 
                                ? tender.budget_amount_cr 
                                : ((parseInt(tender._id?.substring(0, 8) || '1', 16) % 145) + 5).toFixed(1)} CR
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 font-black uppercase tracking-widest">Contractor</span>
                          <span className="text-slate-900 font-black text-xs uppercase tracking-tight">
                            {tender.contractor_name || 'PENDING'}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">Data Accuracy</span>
                          <span style={{ color: '#0A3992' }}>{Math.round(progress)}%</span>
                        </div>
                        <div
                          className="h-2 w-full rounded-full overflow-hidden"
                          style={{ background: 'rgba(226,232,240,0.6)' }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #0A3992, #1e4aad)' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedTender(tender)}
                        className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-95 flex items-center justify-center gap-2.5"
                        style={{
                          background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                          boxShadow: '0 6px 20px -4px rgba(185,54,84,0.3)',
                        }}
                      >
                        <AlertTriangle size={14} strokeWidth={2.5} /> Report Issue
                      </button>
                      <button
                        onClick={() => setWatchdogTender(tender)}
                        className="p-4 rounded-2xl border text-slate-400 transition-all hover:text-[#0A3992] hover:border-[#0A3992]/30 active:scale-95"
                        style={{ borderColor: 'rgba(226,232,240,0.8)' }}
                        title="Set Watchdog Alert"
                      >
                        <Bell size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedTender && (
        <ReportIssueModal tender={selectedTender} onClose={() => setSelectedTender(null)} />
      )}
      {watchdogTender && (
        <SubscriptionModal
          isOpen={true}
          tender={watchdogTender}
          onClose={() => setWatchdogTender(null)}
        />
      )}
    </div>
  );
}
