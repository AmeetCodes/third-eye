'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Mail, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: any;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  tender,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus('IDLE');
    try {
      const response = await axios.post(`${BACKEND_URL}/api/notifications/subscribe`, {
        tenderId: tender._id,
        email: email.trim(),
      });

      setStatus('SUCCESS');
      setMessage(response.data.message || 'Watchdog activated! You will receive alerts.');

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setStatus('IDLE');
          setEmail('');
        }, 500);
      }, 3000);
    } catch (err: any) {
      setStatus('ERROR');
      setMessage(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 md:p-12 overflow-hidden"
          style={{ boxShadow: '0 32px 80px -16px rgba(15,23,42,0.2)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: 'linear-gradient(90deg, #B93654, #0A3992)' }} />

          {/* Background blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -z-10 opacity-30"
            style={{ background: 'rgba(185,54,84,0.15)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] -z-10 opacity-30"
            style={{ background: 'rgba(10,57,146,0.15)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2.5 rounded-xl text-slate-400 hover:text-[#B93654] transition-all"
            style={{ border: '1px solid rgba(226,232,240,0.7)' }}
          >
            <X size={20} />
          </button>

          {status === 'SUCCESS' ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white"
                style={{
                  background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                  boxShadow: '0 12px 32px -6px rgba(185,54,84,0.45)',
                }}
              >
                <CheckCircle2 size={44} strokeWidth={2} />
              </motion.div>
              <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
                Watchdog Active 🔔
              </h2>
              <p className="text-slate-500 font-semibold leading-relaxed">{message}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 mb-7">
                <div
                  className="p-4 rounded-2xl text-white"
                  style={{
                    background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                    boxShadow: '0 8px 24px -4px rgba(185,54,84,0.35)',
                  }}
                >
                  <Bell className="animate-bounce" size={22} strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#B93654] uppercase tracking-[0.25em]">
                    Citizen Watchdog Protocol
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter mt-0.5 leading-none">
                    Monitor Site.
                  </h2>
                </div>
              </div>

              <p className="text-slate-500 text-base leading-relaxed mb-8 font-semibold">
                Enter your email to receive an{' '}
                <span style={{ color: '#B93654' }} className="font-black">Instant Alert</span>{' '}
                when this tender concludes. Full transparency on the award, budget, and timeline.
              </p>

              {/* Target tender */}
              <div
                className="p-5 rounded-2xl mb-8"
                style={{
                  background: 'rgba(248,250,255,0.8)',
                  border: '1px solid rgba(226,232,240,0.7)',
                }}
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Target Infrastructure
                </p>
                <p className="text-base font-black text-slate-900 tracking-tight leading-snug">
                  {tender.title}
                </p>
                {tender.district && (
                  <p className="text-xs font-semibold text-slate-400 mt-1">{tender.district}</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-[#B93654] transition-colors">
                    <Mail size={18} strokeWidth={2} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full border rounded-2xl py-4 pl-12 pr-5 text-slate-900 text-sm font-semibold outline-none transition-all placeholder:text-slate-300"
                    style={{
                      background: 'rgba(248,250,255,0.6)',
                      borderColor: 'rgba(226,232,240,0.8)',
                    }}
                  />
                </div>

                {status === 'ERROR' && (
                  <p className="text-xs font-black text-[#B93654] px-2">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-black py-4 rounded-2xl text-white text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
                  style={{
                    background: loading
                      ? 'rgba(226,232,240,0.8)'
                      : 'linear-gradient(135deg, #B93654, #9e2c46)',
                    boxShadow: loading ? 'none' : '0 12px 32px -6px rgba(185,54,84,0.4)',
                    color: loading ? '#94a3b8' : 'white',
                  }}
                >
                  {loading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck size={22} strokeWidth={2} /> Verify & Activate
                    </>
                  )}
                </button>
              </form>

              <p className="mt-7 text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">
                🔒 Data security compliant with transparency protocols
              </p>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
