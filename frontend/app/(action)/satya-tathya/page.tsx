"use client";
import React from 'react';
import Link from 'next/link';
import { Shield, FileText, CheckSquare, Eye, ArrowRight, Lock, Users, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_STATS = [
  { value: '1,204', label: 'Reports Filed', description: 'Total anonymous reports submitted.', icon: FileText },
  { value: '789', label: 'Cases Verified', description: 'Reports that passed initial review.', icon: CheckSquare },
  { value: '152', label: 'Actions Taken', description: 'Cases leading to official action.', icon: Award },
  { value: '99.8%', label: 'Anonymity Rate', description: 'Our commitment to protecting your identity.', icon: Lock },
];

const HOW_IT_WORKS = [
  {
    icon: FileText,
    step: '01',
    title: 'Submit Your Report Securely',
    description: 'Use our end-to-end encrypted form to detail the incident. Attach photos or documents. We never track your IP or personal information.',
  },
  {
    icon: Shield,
    step: '02',
    title: 'Receive a Unique Case Key',
    description: 'After submission, get a unique untraceable key. This is the only way to track your case. Lose the key and the link to your report is lost forever.',
  },
  {
    icon: CheckSquare,
    step: '03',
    title: 'Independent Verification',
    description: 'Our team of independent reviewers — journalists and legal experts — verify your report against public data.',
  },
  {
    icon: Eye,
    step: '04',
    title: 'Public Reporting & Action',
    description: 'Verified reports are published on our Wall of Reports. Critical cases are escalated to authorities like the CIAA.',
  },
];

export default function SatyaTathyaLandingPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `
              linear-gradient(135deg, rgba(185,54,84,0.08) 0%, rgba(10,57,146,0.08) 100%),
              radial-gradient(ellipse 60% 70% at 50% 0%, rgba(185,54,84,0.1), transparent 70%)
            `,
          }}
        />
        {/* Top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #B93654, #0A3992)' }}
        />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8 text-[10px] font-black uppercase tracking-widest"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(185,54,84,0.2)',
                color: '#B93654',
                boxShadow: '0 4px 20px -4px rgba(185,54,84,0.15)',
              }}
            >
              <Lock size={11} /> End-to-End Encrypted • Zero Trace
            </div>

            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              <span className="text-gradient-nepal">SatyaTathya</span>
              <span className="block text-slate-900 text-3xl lg:text-4xl font-medium mt-3 italic tracking-normal opacity-60">
                The Truth Initiative
              </span>
            </h1>

            <p className="text-xl text-slate-500 font-semibold max-w-2xl mx-auto leading-relaxed mb-12">
              A secure and anonymous platform for citizens to report corruption, waste, and malpractice
              in public services. Your voice matters. Your identity is protected.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/satya-tathya/submit"
                className="inline-flex items-center gap-2.5 px-10 py-4.5 font-black rounded-2xl text-white text-sm transition-all hover:-translate-y-1 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                  boxShadow: '0 12px 32px -6px rgba(185,54,84,0.45)',
                }}
              >
                <FileText size={18} strokeWidth={2.5} /> File a Report Anonymously
                <ArrowRight size={16} strokeWidth={3} />
              </Link>
              <Link
                href="/satya-tathya/board"
                className="inline-flex items-center gap-2.5 px-10 py-4.5 font-black rounded-2xl text-sm text-slate-900 border-2 transition-all hover:border-[#0A3992] hover:text-[#0A3992] hover:-translate-y-1"
                style={{ borderColor: 'rgba(226,232,240,0.8)' }}
              >
                <Eye size={18} strokeWidth={2} /> View the Wall of Reports
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(226,232,240,0.5)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Impact at a Glance</h2>
            <p className="mt-3 text-slate-500 font-semibold">Real outcomes from civic participation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ background: index % 2 === 0 ? 'rgba(185,54,84,0.08)' : 'rgba(10,57,146,0.08)' }}
                >
                  <stat.icon
                    size={26}
                    style={{ color: index % 2 === 0 ? '#B93654' : '#0A3992' }}
                    strokeWidth={2}
                  />
                </div>
                <p
                  className="text-5xl font-black tracking-tighter mb-2"
                  style={{ color: index % 2 === 0 ? '#B93654' : '#0A3992' }}
                >
                  {stat.value}
                </p>
                <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{stat.label}</h3>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(226,232,240,0.5)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-[10px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(10,57,146,0.06)', color: '#0A3992', border: '1px solid rgba(10,57,146,0.12)' }}
            >
              The Process
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              Your Shield Against Corruption
            </h2>
            <p className="mt-4 text-lg text-slate-500 font-semibold">
              Designed with your security and anonymity as the highest priority.
            </p>
          </div>

          <div className="space-y-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card p-8 flex gap-7 items-start group"
              >
                <div className="shrink-0 relative">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110"
                    style={{
                      background:
                        i % 2 === 0
                          ? 'linear-gradient(135deg, #B93654, #9e2c46)'
                          : 'linear-gradient(135deg, #0A3992, #082f7a)',
                      boxShadow:
                        i % 2 === 0
                          ? '0 8px 24px -4px rgba(185,54,84,0.35)'
                          : '0 8px 24px -4px rgba(10,57,146,0.35)',
                    }}
                  >
                    <step.icon size={24} strokeWidth={2} />
                  </div>
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                    style={{ background: i % 2 === 0 ? '#B93654' : '#0A3992' }}
                  >
                    {step.step.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                    {step.step}. {step.title}
                  </h3>
                  <p className="text-slate-500 font-semibold leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[3rem] overflow-hidden text-center p-16"
            style={{
              background: 'linear-gradient(135deg, #0a1628 0%, #0A3992 100%)',
              boxShadow: '0 32px 80px -16px rgba(10,57,146,0.5)',
            }}
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 25% 50%, rgba(185,54,84,0.8), transparent 50%)',
              }}
            />
            <div className="relative z-10">
              <Users size={40} className="mx-auto mb-6 text-white/60" strokeWidth={1.5} />
              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-5">
                Ready to Make a Difference?
              </h2>
              <p className="text-white/70 font-semibold mb-10 max-w-xl mx-auto leading-relaxed">
                Your information can shine a light on corruption and help build a more transparent Nepal.
              </p>
              <Link
                href="/satya-tathya/submit"
                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-sm text-white transition-all hover:-translate-y-1 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                  boxShadow: '0 12px 32px -6px rgba(185,54,84,0.5)',
                }}
              >
                File a Secure Report Now <ArrowRight size={16} strokeWidth={3} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
