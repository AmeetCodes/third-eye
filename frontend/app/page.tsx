'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Eye,
  Map as MapIcon,
  TrendingUp,
  Search,
  ArrowRight,
  Activity,
  ShieldCheck,
  Zap,
  Bot,
  Shield,
  Layers,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { MapComponent } from './components/MapComponent';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

export default function HomePage() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTenders: 0,
    activeDistricts: 0,
    lastSyncTime: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tendersRes, statsRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/tenders?limit=50`),
          axios.get(`${BACKEND_URL}/api/tenders/stats`)
        ]);
        setTenders(tendersRes.data.data || []);
        setStats(statsRes.data.stats || { totalTenders: 0, activeDistricts: 0, lastSyncTime: '' });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as const } }
  };

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-10 pb-24 lg:pt-14 lg:pb-36 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 15% 30%, rgba(185,54,84,0.07) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 85% 70%, rgba(10,57,146,0.07) 0%, transparent 70%)
            `
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(185,54,84,0.3), rgba(10,57,146,0.3), transparent)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Left: hero text */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-10"
            >
              {/* Live badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em]"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(185,54,84,0.2)',
                  boxShadow: '0 4px 16px -4px rgba(185,54,84,0.15)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B93654] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B93654]" />
                </span>
                <span className="text-slate-700">Monitoring National Infrastructure</span>
              </div>

              {/* Headline */}
              <div>
                <p className="inline-block text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-3 py-1 rounded-md" style={{ background: 'rgba(10,57,146,0.05)', border: '1px solid rgba(10,57,146,0.1)' }}>
                  The National
                </p>
                <h1 className="text-6xl sm:text-7xl lg:text-[90px] font-black tracking-tighter leading-[0.9]">
                  <span className="block mb-1" style={{ color: '#0A3992' }}>Accountability</span>
                  <span className="relative inline-block" style={{ color: '#B93654' }}>
                    Engine.
                    <span className="absolute bottom-1.5 left-0 right-0 h-3 rounded-full opacity-10"
                      style={{ background: 'linear-gradient(90deg, #B93654, #0A3992)' }} />
                  </span>
                </h1>
              </div>

              <p className="text-xl text-slate-500 font-semibold max-w-lg leading-relaxed">
                Bridging the gap between official government data and ground reality across{' '}
                <span className="text-slate-900 font-black">all 77 districts</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/tenders"
                  className="inline-flex items-center gap-2.5 px-9 py-4.5 font-black rounded-2xl text-white text-sm transition-all hover:-translate-y-1 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #B93654 0%, #9e2c46 100%)',
                    boxShadow: '0 12px 32px -6px rgba(185,54,84,0.4)',
                  }}
                >
                  <Search size={18} strokeWidth={3} /> Discover Tenders
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2.5 px-9 py-4.5 font-black rounded-2xl text-slate-900 text-sm bg-white border-2 transition-all hover:-translate-y-1 hover:border-[#0A3992] hover:text-[#0A3992] active:scale-95"
                  style={{ borderColor: 'rgba(226,232,240,0.8)', boxShadow: '0 4px 16px -4px rgba(15,23,42,0.08)' }}
                >
                  <MapIcon size={18} strokeWidth={3} /> Project Monitor
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-10 border-t"
                style={{ borderColor: 'rgba(226,232,240,0.6)' }}>
                {[
                  { value: loading ? '—' : stats.totalTenders.toLocaleString(), label: 'Live Tenders' },
                  { value: loading ? '—' : stats.activeDistricts, label: 'Districts' },
                  { value: 'Rs. 1860.30B', label: 'Budget Scope' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter tabular-nums">{s.value}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: map */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              <div className="absolute -inset-12 rounded-[6rem] -z-10 opacity-70"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(185,54,84,0.08), rgba(10,57,146,0.06), transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              <div className="glass rounded-[3rem] overflow-hidden border border-white/70 shadow-2xl relative">
                <MapComponent tenders={tenders} height="700px" zoom={6.2} showLegend={true} />
              </div>

              {/* Floating card */}
              <div className="absolute top-8 right-8 z-20 glass rounded-2xl p-5 border border-white/70 shadow-xl max-w-[210px]">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#B93654] pulse-ring" />
                  <p className="text-[10px] font-black text-[#B93654] uppercase tracking-widest">Active Hotspot</p>
                </div>
                <p className="text-sm font-black text-slate-900 leading-snug">
                  Kathmandu Valley has{' '}
                  <span className="text-[#B93654]">42 new tenders</span> today.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BENTO GRID ── */}
      <section className="py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-[10px] font-black uppercase tracking-[0.25em]"
              style={{ background: 'rgba(10,57,146,0.06)', color: '#0A3992', border: '1px solid rgba(10,57,146,0.12)' }}>
              Platform Modules
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
              Everything you need to{' '}
              <span className="text-gradient-nepal">oversee</span>{' '}
              Nepal
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-6 gap-6"
          >
            {/* Project Monitor — large */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-4 card p-10 lg:p-14 flex flex-col justify-between group"
            >
              <div className="max-w-xl">
                <div className="p-4 rounded-2xl w-fit mb-8"
                  style={{ background: 'rgba(185,54,84,0.08)' }}>
                  <Shield size={28} strokeWidth={2} className="text-[#B93654]" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-5 tracking-tighter">Project Monitor</h3>
                <p className="text-slate-500 leading-relaxed font-semibold text-lg max-w-md">
                  A geographical lens into Nepal's development. Track every local project and report
                  issues directly from the map.
                </p>
              </div>
              <Link
                href="/projects"
                className="mt-10 inline-flex items-center gap-2.5 text-[#B93654] font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform"
              >
                Active Monitor Mode <ChevronRight size={16} strokeWidth={3} />
              </Link>
            </motion.div>

            {/* AI Concierge — small */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 rounded-[2rem] p-10 text-white flex flex-col justify-between hover:scale-[1.03] transition-transform cursor-pointer overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #B93654 0%, #7d2038 100%)',
                boxShadow: '0 20px 60px -12px rgba(185,54,84,0.45)',
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
                style={{ background: 'rgba(255,255,255,0.4)' }} />
              <div className="flex justify-between items-start relative z-10">
                <Bot size={36} className="mb-6 opacity-90" strokeWidth={2} />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                  Live AI
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-3 tracking-tighter">Need Help?</h3>
                <p className="text-white/80 font-semibold mb-7 leading-relaxed text-sm">
                  Ask me anything about Nepal's Budget or Procurement system.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-xs border border-white/10 italic font-medium">
                  "Which contractor got the Kathmandu-Terai Fast Track?"
                </div>
              </div>
            </motion.div>

            {/* Budget Tracker */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 card p-10 flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full transition-transform duration-700 group-hover:scale-[2]"
                style={{ background: 'rgba(10,57,146,0.06)' }} />
              <TrendingUp size={28} className="text-[#0A3992] mb-8 group-hover:scale-110 transition-transform" strokeWidth={2} />
              <div>
                <h3 className="text-3xl font-black mb-3 tracking-tighter text-[#0A3992]">Budget Tracker</h3>
                <p className="text-slate-500 text-sm font-semibold mb-8 leading-relaxed">
                  Analyze where your tax money flows. Interactive heatmaps for the current fiscal cycle.
                </p>
                <Link href="/budget" className="inline-flex items-center gap-2 text-slate-700 font-black uppercase tracking-widest text-[11px] hover:text-[#0A3992] transition-colors">
                  Follow the Money <ChevronRight size={14} strokeWidth={3} />
                </Link>
              </div>
            </motion.div>

            {/* Tender Hub — large */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-4 rounded-[2rem] p-10 lg:p-14 text-white relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #0a1628 0%, #0A3992 100%)',
                boxShadow: '0 24px 80px -16px rgba(10,57,146,0.5)',
              }}
            >
              {/* Abstract visual */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Activity size={420} strokeWidth={0.4} />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="max-w-md">
                    <div className="flex items-center gap-2 font-black uppercase tracking-[0.25em] text-[10px] mb-4"
                      style={{ color: 'rgba(100,180,255,0.9)' }}>
                      <Layers size={12} /> National Bidding Stream
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black mb-5 tracking-tighter leading-none italic">
                      Bolpatra <span style={{ color: 'rgba(100,180,255,0.9)' }}>Hub.</span>
                    </h3>
                    <p className="font-semibold leading-relaxed text-white/70">
                      Real-time integration with Nepal's Public Procurement Data.
                    </p>
                  </div>
                  <Link
                    href="/tenders"
                    className="shrink-0 px-7 py-3.5 font-black rounded-xl text-xs uppercase tracking-widest transition-all whitespace-nowrap hover:-translate-y-1"
                    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    View All Tenders →
                  </Link>
                </div>

                <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tenders.slice(0, 4).map((t, i) => (
                    <div key={i}
                      className="p-5 rounded-2xl border transition-all hover:-translate-y-1"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
                    >
                      <p className="font-black mb-1.5 uppercase tracking-[0.2em] text-[9px]"
                        style={{ color: 'rgba(100,180,255,0.8)' }}>
                        {t.district || 'National Notification'}
                      </p>
                      <p className="font-semibold leading-snug text-sm text-white/85 line-clamp-2">{t.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="py-28 relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(226,232,240,0.5)' }}>
        <div className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(248,250,255,0.8) 100%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-[10px] font-black uppercase tracking-[0.25em]"
              style={{ background: 'rgba(185,54,84,0.06)', color: '#B93654', border: '1px solid rgba(185,54,84,0.12)' }}>
              Our Core Principles
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 mb-5">
              Closing the <span className="text-gradient-nepal">Accountability</span> Loop
            </h2>
            <p className="text-slate-500 font-semibold max-w-2xl mx-auto text-lg leading-relaxed">
              Our platform is built on three pillars designed to revolutionize transparency in Nepal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Official APIs',
                desc: 'Sourcing data directly from government e-GP systems to ensure 100% accuracy.',
                icon: <Zap className="text-[#B93654]" size={28} strokeWidth={2} />,
                accent: '#B93654',
                bg: 'rgba(185,54,84,0.06)',
              },
              {
                title: 'Red Flag Alerts',
                desc: 'AI-driven identification of suspicious spending and procurement patterns.',
                icon: <ShieldCheck className="text-[#0A3992]" size={28} strokeWidth={2} />,
                accent: '#0A3992',
                bg: 'rgba(10,57,146,0.06)',
              },
              {
                title: 'Citizen Voice',
                desc: 'Direct issue reporting to hold contractors and authorities accountable.',
                icon: <Eye className="text-slate-700" size={28} strokeWidth={2} />,
                accent: '#0f172a',
                bg: 'rgba(15,23,42,0.04)',
              }
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-10 group text-center"
              >
                <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"
                  style={{ background: p.bg, border: `1px solid ${p.accent}20` }}>
                  {p.icon}
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{p.title}</h4>
                <p className="text-slate-500 font-semibold leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SATYA TATHYA CTA ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, #0a1628 0%, #0A3992 60%, #1e3a8a 100%)',
              boxShadow: '0 32px 80px -16px rgba(10,57,146,0.5)',
            }}
          >
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 50%, rgba(185,54,84,0.8), transparent 50%),
                  radial-gradient(circle at 75% 50%, rgba(255,255,255,0.1), transparent 50%)`
              }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20 text-white/80 backdrop-blur-sm">
                <AlertTriangle size={11} /> Civic Intelligence
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6">
                The Truth Initiative
              </h2>
              <p className="text-white/70 font-semibold text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                Report corruption anonymously. Your identity is protected by end-to-end encryption.
                Your voice creates change.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/satya-tathya/submit"
                  className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-sm transition-all hover:-translate-y-1 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                    boxShadow: '0 12px 32px -6px rgba(185,54,84,0.5)',
                    color: 'white',
                  }}
                >
                  File a Report Anonymously <ArrowRight size={16} strokeWidth={3} />
                </Link>
                <Link
                  href="/satya-tathya/board"
                  className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-sm text-white border-2 border-white/30 hover:bg-white/10 transition-all"
                >
                  View the Wall of Reports
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}