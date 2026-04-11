"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  FileText,
  Shield,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function MagazinePage() {
  const pdfUrl = '/Public Procurement Magazine, 2082_eqf38rn.pdf';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Public Procurement Magazine 2082',
          text: 'Official public procurement magazine from Nepal Government',
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen text-slate-900">
      {/* ── Header ── */}
      <header
        className="fixed top-0 left-0 right-0 h-20 z-50 px-6 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
          boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)',
        }}
      >
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="p-2.5 rounded-xl text-slate-500 hover:text-[#0A3992] transition-colors"
            style={{ background: 'rgba(248,250,255,0.8)' }}
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-center gap-4">
            <div
              className="p-2.5 rounded-2xl text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                boxShadow: '0 6px 20px -4px rgba(185,54,84,0.35)',
              }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                सार्वजनिक खरिद पत्रिका{' '}
                <span className="text-slate-300 font-light mx-1">|</span>{' '}
                <span style={{ color: '#B93654' }}>२०८२</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                Public Procurement Magazine • Nepal Official
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div
            className="hidden md:flex items-center rounded-xl p-1 gap-1"
            style={{ background: 'rgba(248,250,255,0.8)', border: '1px solid rgba(226,232,240,0.7)' }}
          >
            <button
              className="p-2.5 rounded-lg text-slate-400 hover:text-[#0A3992] hover:bg-white transition-all"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              className="p-2.5 rounded-lg text-slate-400 hover:text-[#0A3992] hover:bg-white transition-all"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
          </div>

          <a
            href={pdfUrl}
            download
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all hover:border-[#0A3992] hover:text-[#0A3992]"
            style={{
              borderColor: 'rgba(226,232,240,0.8)',
              boxShadow: '0 2px 8px -2px rgba(15,23,42,0.06)',
            }}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span> PDF
          </a>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black text-white transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #0A3992, #082f7a)',
              boxShadow: '0 6px 20px -4px rgba(10,57,146,0.35)',
            }}
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="pt-28 pb-24 px-4 flex flex-col items-center min-h-screen">
        {/* Section header */}
        <div className="w-full max-w-5xl mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #B93654, #0A3992)' }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#0A3992' }}>
              Official PPMO Publication
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Fiscal Year <span style={{ color: '#B93654' }}>2082/83</span> Gazette
          </h2>
        </div>

        {/* PDF Viewer */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden group"
          style={{
            aspectRatio: '16/11',
            boxShadow: '0 32px 80px -16px rgba(15,23,42,0.15)',
            border: '1px solid rgba(226,232,240,0.7)',
          }}
        >
          <iframe
            src={`${pdfUrl}#toolbar=0&view=FitH`}
            className="w-full h-full border-none"
            title="Public Procurement Magazine 2082"
          />

          {/* Navigation overlay */}
          <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center bg-gradient-to-r from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-4 bg-white shadow-2xl rounded-full text-slate-900 hover:scale-110 transition-all border"
              style={{ borderColor: 'rgba(226,232,240,0.7)' }}
            >
              <ChevronLeft size={28} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center bg-gradient-to-l from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-4 bg-white shadow-2xl rounded-full text-slate-900 hover:scale-110 transition-all border"
              style={{ borderColor: 'rgba(226,232,240,0.7)' }}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Direct link overlay */}
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white"
              style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)' }}
            >
              <ExternalLink size={14} /> Open in New Tab
            </a>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <div className="card p-6 flex items-center gap-4">
            <div
              className="p-3 rounded-2xl shrink-0"
              style={{ background: 'rgba(185,54,84,0.07)' }}
            >
              <FileText size={22} style={{ color: '#B93654' }} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Document Specs
              </p>
              <p className="text-sm font-bold text-slate-800 font-mono">184 Pages · ~20 MB</p>
            </div>
          </div>

          <div className="card p-6 flex items-center gap-4">
            <div
              className="p-3 rounded-2xl shrink-0"
              style={{ background: 'rgba(10,57,146,0.07)' }}
            >
              <BookOpen size={22} style={{ color: '#0A3992' }} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Edition
              </p>
              <p className="text-sm font-bold text-slate-800">Fiscal Year 2082/83</p>
            </div>
          </div>

          <div
            className="rounded-3xl p-6 flex items-center gap-4 text-white"
            style={{
              background: 'linear-gradient(135deg, #0a1628, #0A3992)',
              boxShadow: '0 12px 40px -8px rgba(10,57,146,0.4)',
            }}
          >
            <div className="p-3 bg-white/10 rounded-2xl shrink-0">
              <Shield size={22} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">
                Verified
              </p>
              <p className="text-sm font-bold">Official PPMO Source</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Decorative gradients */}
      <div
        className="fixed top-40 -left-64 w-[500px] h-[500px] rounded-full -z-10 opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(185,54,84,0.1), transparent)', filter: 'blur(120px)' }}
      />
      <div
        className="fixed bottom-0 -right-64 w-[500px] h-[500px] rounded-full -z-10 opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(10,57,146,0.08), transparent)', filter: 'blur(120px)' }}
      />
    </div>
  );
}
