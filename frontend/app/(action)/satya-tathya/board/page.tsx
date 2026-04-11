"use client";
import React, { useState } from 'react';
import { Shield, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import AnonAvatar from '@/app/components/AnonymousAvatar';
import StatusBadge from '@/app/components/StatusBadge';
import { StatusBadgeProps } from '@/app/components/StatusBadge';

// ── Mock Data ──
const mockReports = [
  {
    id: 'SATYA-F4B3C1A9',
    title: 'Substandard Materials in Road Construction',
    location: 'Ward 12, Pokhara, Gandaki',
    status: 'Verified & Action Taken',
    category: 'Infrastructure',
    submitted: '2024-06-15',
    summary:
      'A citizen report, backed by photographic evidence, revealed that a contractor was using a lower grade of asphalt than specified in the tender for the new Lakeside-Pame road. The report was verified by the municipal engineering department, leading to a halt in construction and a penalty for the contractor.',
    isFame: true,
  },
  {
    id: 'SATYA-9D8E7F6A',
    title: 'Ghost Employee in Municipal Office',
    location: 'Janakpur, Madhesh',
    status: 'Under Investigation',
    category: 'Bureaucracy',
    submitted: '2024-07-01',
    summary:
      'An anonymous tip alleged that a listed municipal staff member has not been at the office for over a year, yet continues to draw a salary. The CIAA has been notified and is investigating the claim.',
    isFame: false,
  },
  {
    id: 'SATYA-1A2B3C4D',
    title: 'Diversion of School Lunch Program Funds',
    location: 'Rural Municipality, Karnali',
    status: 'Pending Verification',
    category: 'Social Welfare',
    submitted: '2024-07-20',
    summary:
      "A report claims that funds allocated for a primary school's daily lunch program are being systematically diverted by the school administration. Evidence submitted includes copies of alleged fake receipts.",
    isFame: false,
  },
  {
    id: 'SATYA-5E6F7G8H',
    title: 'Illegal Sand Mining in Riverbed',
    location: 'Banke, Lumbini',
    status: 'Verified & Cease Order Issued',
    category: 'Environment',
    submitted: '2024-05-30',
    summary:
      'Local residents provided video evidence of unauthorized sand and gravel extraction from the Rapti riverbed at night. The District Coordination Committee verified the activity and issued a cease and desist order.',
    isFame: true,
  },
  {
    id: 'SATYA-9I8J7K6L',
    title: 'Bribery Demanded for Building Permit',
    location: 'Kathmandu, Bagmati',
    status: 'Rejected',
    category: 'Bureaucracy',
    submitted: '2024-06-10',
    summary:
      'A citizen claimed a municipal engineer demanded a bribe to approve a building permit. However, the evidence was insufficient, and the case was closed due to lack of actionable proof.',
    isFame: false,
  },
];

// ── Report Card ──
const ReportCard = ({ report }: { report: (typeof mockReports)[0] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
    style={{
      borderLeft: `5px solid ${report.isFame ? '#0A3992' : '#B93654'}`,
      borderTop: '1px solid rgba(226,232,240,0.6)',
      borderRight: '1px solid rgba(226,232,240,0.6)',
      borderBottom: '1px solid rgba(226,232,240,0.6)',
      boxShadow: '0 4px 20px -4px rgba(15,23,42,0.07)',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px -12px rgba(15,23,42,0.12)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px -4px rgba(15,23,42,0.07)';
    }}
  >
    <div className="p-7">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest"
              style={{
                background: report.isFame ? 'rgba(10,57,146,0.07)' : 'rgba(185,54,84,0.07)',
                color: report.isFame ? '#0A3992' : '#B93654',
              }}
            >
              {report.category}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{report.location}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">{report.title}</h3>
        </div>
        <StatusBadge status={report.status as StatusBadgeProps['status']} />
      </div>

      <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-6">{report.summary}</p>

      <div
        className="flex justify-between items-center pt-5"
        style={{ borderTop: '1px solid rgba(226,232,240,0.6)' }}
      >
        <div className="flex items-center gap-3">
          <AnonAvatar seed={report.id} />
          <div>
            <p className="text-sm font-black text-slate-800">Anonymous Report</p>
            <p className="text-xs text-slate-400 font-semibold">
              Submitted {new Date(report.submitted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black font-mono text-slate-300 tracking-wide">{report.id}</span>
      </div>
    </div>
  </motion.div>
);

// ── Main Page ──
export default function SatyaTathyaBoardPage() {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedReports = mockReports
    .filter((report) => {
      const matchesSearch =
        !searchQuery ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (filter === 'all') return true;
      if (filter === 'fame') return report.isFame;
      if (filter === 'shame') return !report.isFame && report.status !== 'Rejected';
      if (filter === 'verified') return report.status.includes('Verified');
      if (filter === 'investigation') return report.status.includes('Investigation');
      return true;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.submitted).getTime() - new Date(a.submitted).getTime();
      if (sort === 'oldest') return new Date(a.submitted).getTime() - new Date(b.submitted).getTime();
      return 0;
    });

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <header className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-black uppercase tracking-widest"
            style={{
              background: 'rgba(185,54,84,0.06)',
              color: '#B93654',
              border: '1px solid rgba(185,54,84,0.15)',
            }}
          >
            Public Record
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter">
            Wall of{' '}
            <span style={{ color: '#0A3992' }}>Fame</span>
            {' '}
            <span className="text-slate-300 font-light">&</span>
            {' '}
            <span style={{ color: '#B93654' }}>Shame</span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 font-semibold max-w-3xl mx-auto leading-relaxed">
            Publicly verified outcomes of anonymous reports from the SatyaTathya platform.
            Celebrating civic wins and highlighting persistent issues.
          </p>
        </header>

        {/* ── Filters ── */}
        <div
          className="sticky top-20 z-10 py-4 mb-10 -mx-4 px-4"
          style={{ background: 'rgba(248,250,255,0.9)', backdropFilter: 'blur(16px)' }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-2xl w-full sm:w-auto sm:min-w-[320px]"
              style={{
                background: 'white',
                border: '1px solid rgba(226,232,240,0.7)',
                boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)',
              }}
            >
              <Search className="w-4 h-4 text-slate-300 shrink-0" />
              <input
                type="text"
                placeholder="Search by title or location..."
                className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-900 placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Category filter */}
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none rounded-2xl py-3 pl-5 pr-10 font-bold text-slate-700 text-sm transition-all outline-none cursor-pointer"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(226,232,240,0.7)',
                    boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)',
                  }}
                >
                  <option value="all">All Reports</option>
                  <option value="fame">Wall of Fame</option>
                  <option value="shame">Wall of Shame</option>
                  <option value="verified">Verified</option>
                  <option value="investigation">Under Investigation</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-2xl py-3 pl-5 pr-10 font-bold text-slate-700 text-sm transition-all outline-none cursor-pointer"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(226,232,240,0.7)',
                    boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)',
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Results count ── */}
        <div className="mb-8 flex items-center gap-3">
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
            {filteredAndSortedReports.length} Reports
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(226,232,240,0.6)' }} />
        </div>

        {/* ── Reports Grid ── */}
        {filteredAndSortedReports.length === 0 ? (
          <div className="text-center py-20">
            <Shield size={48} className="mx-auto mb-5 text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No reports match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}

        {/* ── Load More ── */}
        <div className="text-center mt-14">
          <button
            className="px-10 py-4 font-black text-sm uppercase tracking-widest rounded-2xl text-white transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #0A3992, #082f7a)',
              boxShadow: '0 8px 24px -4px rgba(10,57,146,0.35)',
            }}
          >
            Load More Reports
          </button>
        </div>
      </div>
    </div>
  );
}
