'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Search, Share2, AlertCircle } from 'lucide-react';
import { SubscriptionModal } from '../../components/SubscriptionModal';

// ── Money Formatter ──
const MoneyFormatter: React.FC<{ amount: number }> = ({ amount }) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
  return (
    <span className="text-lg font-black tracking-tight text-emerald-700">{formatted}</span>
  );
};

// ── Red Flag Indicator ──
const RedFlagIndicator: React.FC<{ flags: string[] }> = ({ flags }) => {
  if (flags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {flags.map((flag, idx) => (
        <span
          key={idx}
          className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide animate-pulse"
          style={{
            background: 'rgba(185,54,84,0.08)',
            color: '#B93654',
            border: '1px solid rgba(185,54,84,0.2)',
          }}
        >
          🚩 {flag}
        </span>
      ))}
    </div>
  );
};

interface TenderRowProps {
  tender: any;
}

const TenderRow: React.FC<TenderRowProps> = ({ tender }) => {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const deadline = tender.submission_date ? new Date(tender.submission_date) : null;
  const isShortDeadline =
    tender.remaining_days !== null && tender.remaining_days !== undefined && tender.remaining_days <= 5;

  const flags: string[] = [];
  if (isShortDeadline) flags.push('Short Deadline');
  if (tender.private) flags.push('Single Source');

  const rawAmount =
    tender.award_result && tender.award_result.length > 0
      ? tender.award_result[0].price
      : tender.estimated_cost?.length > 0
      ? tender.estimated_cost[0].amount
      : tender.rawPayload?.estimated_amount || 0;

  // Hackathon Mock: If amount is 0, generate a stable mock value based on ID
  const amount = rawAmount > 0 
    ? rawAmount 
    : ((parseInt(tender._id?.substring(0, 8) || '1', 16) % 132) + 8) * 1000000;

  const lastSynced = tender.lastSynced ? new Date(tender.lastSynced) : null;
  const isHighRisk = (tender.transparencyScore ?? 100) < 60;

  const scoreColor =
    (tender.transparencyScore ?? 100) >= 90
      ? { border: '#0A3992', text: '#0A3992', bg: 'rgba(10,57,146,0.06)' }
      : (tender.transparencyScore ?? 100) >= 60
      ? { border: '#d97706', text: '#b45309', bg: 'rgba(217,119,6,0.06)' }
      : { border: '#B93654', text: '#B93654', bg: 'rgba(185,54,84,0.06)' };

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className={`group relative block rounded-3xl transition-all duration-300 border bg-white overflow-hidden`}
      style={{
        borderColor: isHighRisk ? 'rgba(185,54,84,0.2)' : 'rgba(226,232,240,0.7)',
        boxShadow: isHighRisk ? '0 4px 20px -4px rgba(185,54,84,0.12), 0 0 0 1px rgba(185,54,84,0.15)' : '0 4px 20px -4px rgba(15,23,42,0.06)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5 rounded-t-3xl"
        style={{
          background: isShortDeadline
            ? 'linear-gradient(90deg, #B93654, #9e2c46)'
            : 'linear-gradient(90deg, #0A3992, #1e4aad)',
        }}
      />

      {/* High-risk badge */}
      {isHighRisk && (
        <div className="absolute top-4 right-4 z-10 rotate-1">
          <span
            className="text-white text-[8px] font-black px-3 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #B93654, #9e2c46)',
              boxShadow: '0 4px 12px -2px rgba(185,54,84,0.4)',
            }}
          >
            🔥 DEEP SCAN
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col md:flex-row gap-5 items-start md:items-center mt-1">
        {/* Thumbnail */}
        <div
          className="shrink-0 w-full md:w-28 h-32 md:h-28 rounded-2xl overflow-hidden border relative cursor-zoom-in bg-slate-50"
          style={{ borderColor: 'rgba(226,232,240,0.6)' }}
          onClick={(e) => {
            e.stopPropagation();
            if (tender.image) window.open(tender.image, '_blank');
          }}
          title="Click to view full image"
        >
          {tender.image ? (
            <img
              src={tender.image}
              alt={tender.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) =>
                (e.currentTarget.src = 'https://placehold.co/300x300/f8fafc/94a3b8?text=No+Image')
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-200" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
              style={{
                background: 'rgba(10,57,146,0.07)',
                color: '#0A3992',
                border: '1px solid rgba(10,57,146,0.12)',
              }}
            >
              {tender.notice_category || 'Tender'}
            </span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <Link
              href={`/tenders?district=${encodeURIComponent(tender.district || '')}`}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-wide hover:text-[#0A3992] transition-colors"
            >
              {tender.district || 'National'}
            </Link>
          </div>

          <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0A3992] transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
            {tender.title}
          </h3>

          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
              {tender.public_entity_name || 'Department of Infrastructure'}
            </p>
            {lastSynced && (
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                • Updated {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        {/* Right details */}
        <div className="flex shrink-0 gap-5 items-center">
          {/* Transparency score */}
          <div className="flex flex-col items-center">
            <div
              className="relative flex items-center justify-center w-14 h-14 rounded-full border-[3px] font-black text-sm shadow-sm transition-transform group-hover:scale-110"
              style={{
                borderColor: scoreColor.border,
                color: scoreColor.text,
                background: scoreColor.bg,
              }}
            >
              {tender.transparencyScore ?? '?'}%
            </div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1.5 text-center">
              Civic Score
            </span>
          </div>

          {/* Amount */}
          <div className="hidden lg:block min-w-[148px]">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
              Est. Value
            </p>
            <span className="text-lg font-black tracking-tight text-emerald-700">Variable</span>
          </div>

          {/* Deadline */}
          <div className="hidden sm:block min-w-[100px]">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
              Deadline
            </p>
            <p className={`font-black text-sm ${isShortDeadline ? 'text-[#B93654]' : 'text-slate-800'}`}>
              {deadline ? deadline.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
            </p>
            <RedFlagIndicator flags={flags} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 min-w-[90px]">
            {(tender.transparencyScore ?? 100) < 60 ? (
              <button
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                  boxShadow: '0 6px 20px -4px rgba(185,54,84,0.4)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const tweetText = encodeURIComponent(
                    `🚨 RED ALERT: Found a suspicious tender "${tender.title}" with a ${tender.transparencyScore}% transparency score. Needs urgent scrutiny! #ThirdEye #Nepal`
                  );
                  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
                }}
              >
                🚨 ALERT
              </button>
            ) : (tender.transparencyScore ?? 100) < 90 ? (
              <button
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  boxShadow: '0 6px 20px -4px rgba(217,119,6,0.35)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const tweetText = encodeURIComponent(
                    `⚠️ WATCHDOG: Monitoring "${tender.title}" (${tender.transparencyScore}% score). #ThirdEye #Accountability`
                  );
                  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
                }}
              >
                ⚠️ WATCH
              </button>
            ) : (
              <button
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #0A3992, #082f7a)',
                  boxShadow: '0 6px 20px -4px rgba(10,57,146,0.35)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const tweetText = encodeURIComponent(
                    `✨ This tender "${tender.title}" has a ${tender.transparencyScore}% transparency score! #ThirdEye #GoodGovernance`
                  );
                  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
                }}
              >
                ✨ SHARE
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsNotifyModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 group/btn"
              style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}
            >
              <Bell size={14} className="group-hover/btn:animate-bounce" /> MONITOR
            </button>

            <button
              className="w-full px-3 py-2.5 rounded-2xl text-[#0A3992] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-[#0A3992]/20"
              style={{ background: 'rgba(10,57,146,0.04)' }}
            >
              INSPECT
            </button>
          </div>
        </div>
      </div>

      <SubscriptionModal 
        isOpen={isNotifyModalOpen} 
        onClose={() => setIsNotifyModalOpen(false)} 
        tender={tender} 
      />
    </motion.div>

  );
};

export default TenderRow;
