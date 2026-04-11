"use client";
import '@/app/globals.css';
import { EyeIcon, Menu, X, TrendingUp, FileText, Map } from 'lucide-react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThirdEyeConcierge } from './components/ThirdEyeConcierge';
import { PartnerShowcase } from './components/PartnerShowcase';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const GlobalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { href: '/tenders', label: 'Tender Discovery(Bolpatra)', icon: FileText },
    { href: '/projects', label: 'Project Monitor', icon: Map },
    { href: '/budget', label: 'Budget Tracker', icon: TrendingUp },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] rounded-2xl transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(28px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.8)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 8px 32px -8px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex justify-between h-[68px] items-center px-6">
        {/* Logo */}
        <div className="shrink-0 flex items-center gap-3">
          <div className="relative group overflow-hidden rounded-xl border border-slate-100 shadow-sm leading-[0]">
            <img
              src="/thirdeye.jpeg"
              alt="ThirdEye Logo"
              className="w-10 h-10 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <Link href="/" className="text-xl font-black tracking-tighter group">
            <span className="text-gradient-nepal text-2xl">ThirdEye</span>
          </Link>
          <span className="hidden lg:inline text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] border-l border-slate-200 pl-3 ml-1">
            civic platform
          </span>
        </div>

        {/* Desktop Navigation & Ad Space */}
        <div className="hidden sm:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-[#B93654] hover:bg-red-50/80 transition-all duration-200"
            >
              <item.icon size={13} strokeWidth={2.5} />
              {item.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-slate-200 mx-2" />
          
          <Link
            href="/satya-tathya"
            className="px-5 py-2.5 bg-gradient-to-r from-[#B93654] to-[#9e2c46] text-white text-[11px] font-black uppercase tracking-[0.15em] rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            style={{ boxShadow: '0 6px 20px -4px rgba(185,54,84,0.4)' }}
          >
            SatyaTathya
          </Link>

          {/* Corporate Sponsorship Ad */}
          <div className="ml-2 pl-4 border-l border-slate-200 flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity cursor-pointer hidden lg:flex">
            <div className="flex flex-col items-end justify-center leading-tight">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Enterprise Partner</span>
                <span className="text-[10px] font-black text-slate-800 tracking-tight">Nabil Bank ESG</span>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-inner border border-green-700/20"
                 style={{ background: 'linear-gradient(135deg, #0A5F38, #053D23)' }}>
                <span className="text-white font-black text-[11px] tracking-tighter">NB</span>
            </div>
          </div>
        </div>

        {/* Hamburger */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden absolute top-[76px] left-0 w-full rounded-2xl p-4 shadow-2xl border border-white/60 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)' }}
          >
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-700 hover:text-[#B93654] hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <item.icon size={16} strokeWidth={2} className="text-[#0A3992]" />
                  {item.label}
                </Link>
              ))}
              <Link
                href="/satya-tathya"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-[#B93654] to-[#9e2c46] transition-all"
              >
                SatyaTathya — Civic Reports
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const GlobalFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="relative border-t text-slate-500 pt-20 pb-10 mt-auto overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(248,250,255,0) 0%, rgba(248,250,255,1) 30%)',
        borderTopColor: 'rgba(226,232,240,0.6)',
      }}
    >
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px] -z-10 opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(185,54,84,0.12), transparent)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px] -z-10 opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(10,57,146,0.1), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 pb-16 border-b border-slate-100 mb-10">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative group overflow-hidden rounded-xl border border-slate-100 shadow-sm leading-[0]">
                <img
                  src="/thirdeye.jpeg"
                  alt="ThirdEye Logo"
                  className="w-10 h-10 object-cover"
                />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">ThirdEye</span>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
              Nepal's civic intelligence platform. Bridging the gap between official government data
              and ground reality across all 77 districts.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full w-fit"
              style={{ background: 'rgba(185,54,84,0.06)', border: '1px solid rgba(185,54,84,0.15)' }}>
              <span className="w-2 h-2 rounded-full bg-[#B93654] animate-pulse" />
              <span className="text-[10px] font-black text-[#B93654] uppercase tracking-widest">Live National Data</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-20">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em]">Platform</h4>
              <ul className="space-y-3">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/tenders', label: 'Tender Discovery' },
                  { href: '/projects', label: 'Project Monitor' },
                  { href: '/budget', label: 'Budget Tracker' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-xs font-semibold text-slate-500 hover:text-[#B93654] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em]">Civic Hub</h4>
              <ul className="space-y-3">
                {[
                  { href: '/satya-tathya', label: 'SatyaTathya' },
                  { href: '/satya-tathya/submit', label: 'File Report' },
                  { href: '/satya-tathya/board', label: 'Wall of Reports' },
                  { href: '/magazine', label: 'Official Gazettes' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-xs font-semibold text-slate-500 hover:text-[#0A3992] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <p>© {currentYear} ThirdEye Platform • Built for Nepal 🇳🇵</p>
          <div className="flex items-center gap-6">
            <span>Transparency First</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Zero Compromise</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className + ' flex flex-col min-h-screen'}>
        <AuthProvider>
          <GlobalNavbar />
          <PartnerShowcase />
          <main className="grow pt-24 md:pt-[110px]">
            {children}
          </main>
          <GlobalFooter />
          <ThirdEyeConcierge />
        </AuthProvider>
      </body>
    </html>
  );
}