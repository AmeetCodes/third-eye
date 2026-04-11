'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TaxHeatmap } from '../components/TaxHeatmap';
import { BudgetDoublePie } from '../components/BudgetDoublePie';
import { TrendingUp, Wallet, Loader2, BarChart3, PieChart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const BACKEND_URL = 'http://localhost:5000';

export default function BudgetPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/budget/data`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching budget data:', err);
        setError('Failed to load budget data. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0A3992, #082f7a)' }}>
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">
            Processing Arthatantra Data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(185,54,84,0.08)' }}>
            <BarChart3 className="w-8 h-8 text-[#B93654]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Data Unavailable</h2>
          <p className="text-slate-500 font-semibold mb-8">{error || 'No data returned from backend.'}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-black"
            style={{ background: 'linear-gradient(135deg, #0A3992, #082f7a)' }}>
            <ArrowLeft size={16} /> Back Home
          </Link>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-16 pt-32">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 pb-14"
          style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
          <div className="space-y-5">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{
                background: 'rgba(185,54,84,0.06)',
                color: '#B93654',
                border: '1px solid rgba(185,54,84,0.15)',
              }}
            >
              Fiscal Policy Analysis
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-none"
            >
              Artha<span style={{ color: '#0A3992' }}>tantra</span>{' '}
              <span className="text-slate-200 font-light text-4xl mx-2">/</span>{' '}
              <span className="text-[#B93654] italic">2081.82</span>
            </motion.h1>
            <p className="text-slate-500 text-lg font-semibold max-w-2xl leading-relaxed">
              Tracing the flow of Nepal's federal budget from source to application.
              Empowering citizens through radical transparency.
            </p>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div
              className="p-6 rounded-3xl border flex flex-col justify-between min-h-[120px] min-w-[170px]"
              style={{
                background: 'rgba(10,57,146,0.04)',
                borderColor: 'rgba(10,57,146,0.12)',
              }}
            >
              <div className="p-2 rounded-xl w-fit" style={{ background: 'rgba(10,57,146,0.08)' }}>
                <TrendingUp size={16} style={{ color: '#0A3992' }} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Growth Target
                </p>
                <p className="text-xl font-black text-slate-900">
                  {data.summary?.economic_growth_target || 'N/A'}
                </p>
              </div>
            </div>
            <div
              className="p-6 rounded-3xl text-white flex flex-col justify-between min-h-[120px] min-w-[170px]"
              style={{
                background: 'linear-gradient(135deg, #0a1628 0%, #0A3992 100%)',
                boxShadow: '0 12px 40px -8px rgba(10,57,146,0.4)',
              }}
            >
              <div className="p-2 bg-white/10 rounded-xl w-fit">
                <Wallet size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">
                  Total Outlay
                </p>
                <p className="text-xl font-black">Rs. 1,964.11 B</p>
              </div>
            </div>
          </div>
        </div>


        {/* ── Allocation vs Actual Expenditure ── */}
        <section className="space-y-10 pt-14" style={{ borderTop: '1px solid rgba(226,232,240,0.5)' }}>
          <div className="flex items-center gap-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0A3992, #082f7a)',
                boxShadow: '0 8px 24px -4px rgba(10,57,146,0.35)',
              }}
            >
              <PieChart size={22} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Allocation vs Estimated Expenditure</h2>
              <p className="text-slate-400 font-medium text-sm">
                FY 2081/82 (2024/25) utilization capacity across all Government Ministries and Constitutional Bodies.
              </p>
            </div>
          </div>
          
          <BudgetDoublePie />
        </section>

        {/* ── Tax Heatmap ── */}
        <section
          className="space-y-10 pt-14"
          style={{ borderTop: '1px solid rgba(226,232,240,0.5)' }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                boxShadow: '0 8px 24px -4px rgba(185,54,84,0.35)',
              }}
            >
              <PieChart size={22} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tax Matrix</h2>
              <p className="text-slate-400 font-medium text-sm">
                Burden vs. Incentives across major sectors
              </p>
            </div>
          </div>
          <TaxHeatmap highlights={data.tax_highlights} />
        </section>

        {/* ── Footer info ── */}
        <div
          className="pt-14 pb-10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest"
          style={{ borderTop: '1px solid rgba(226,232,240,0.5)' }}
        >
          <p>
            Data from{' '}
            <span className="text-slate-600">{data.metadata?.publisher || 'PPMO Nepal'}</span> •
            2081/82 Edition
          </p>
          <div className="flex gap-5 items-center">
            <Link
              href="/magazine"
              className="transition-colors hover:text-[#0A3992]"
              style={{ color: '#0A3992' }}
            >
              View Official Gazettes
            </Link>
            <span>•</span>
            <Link
              href="/tenders"
              className="transition-colors hover:text-[#B93654]"
              style={{ color: '#B93654' }}
            >
              Bolpatra Live
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
