"use client";
import React, { useState } from 'react';
import { Shield, UploadCloud, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Case Key generator (client-side placeholder) ──
const generateCaseKeyHash = (): string => {
  const randomBytes = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')
  ).join('');
  return 'SATYA-' + randomBytes.substring(0, 12).toUpperCase();
};

// ── Evidence Uploader ──
const EvidenceUploader: React.FC = () => (
  <div
    className="mt-2 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:-translate-y-0.5"
    style={{
      borderColor: 'rgba(10,57,146,0.2)',
      background: 'rgba(10,57,146,0.03)',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = '#0A3992';
      (e.currentTarget as HTMLElement).style.background = 'rgba(10,57,146,0.06)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,57,146,0.2)';
      (e.currentTarget as HTMLElement).style.background = 'rgba(10,57,146,0.03)';
    }}
  >
    <UploadCloud className="w-10 h-10 mx-auto mb-4" style={{ color: '#0A3992' }} strokeWidth={1.5} />
    <p className="text-sm font-bold text-slate-700 mb-1">
      Drag & drop evidence files here, or click to browse
    </p>
    <p className="text-xs text-slate-400 font-semibold mb-4">
      Max 5 files (PDFs, Images, Videos) • Maximum 25MB total
    </p>
    <div
      className="p-3 rounded-xl text-left"
      style={{
        background: 'rgba(185,54,84,0.05)',
        border: '1px solid rgba(185,54,84,0.15)',
      }}
    >
      <p className="text-xs font-semibold text-slate-500 flex items-start gap-2">
        <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#B93654' }} strokeWidth={2} />
        <span>
          <strong className="text-[#B93654] font-black">Privacy Warning:</strong> All files are
          end-to-end encrypted immediately upon upload. Do NOT include personally identifying
          information in filenames or content.
        </span>
      </p>
    </div>
  </div>
);

// ── Submission Success Modal ──
interface SubmissionModalProps {
  caseKey: string;
  onClose: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({ caseKey, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(caseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center p-4 z-50"
      style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 text-center overflow-hidden relative"
        style={{ boxShadow: '0 32px 80px -16px rgba(15,23,42,0.3)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'linear-gradient(90deg, #B93654, #0A3992)' }} />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white"
          style={{
            background: 'linear-gradient(135deg, #0A3992, #082f7a)',
            boxShadow: '0 12px 32px -6px rgba(10,57,146,0.5)',
          }}
        >
          <CheckCircle size={40} strokeWidth={2} />
        </motion.div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">Report Submitted!</h2>
        <p className="text-slate-500 font-semibold mb-8 leading-relaxed">
          Your report has been received and encrypted securely. Verification is now pending.
        </p>

        <div
          className="p-6 rounded-2xl mb-6 text-left"
          style={{
            background: 'rgba(10,57,146,0.05)',
            border: '1px solid rgba(10,57,146,0.15)',
          }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#0A3992' }}>
            Your Unique Case Key
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 font-mono text-xl font-black tracking-wider p-3 rounded-xl bg-white border text-center"
              style={{ borderColor: 'rgba(10,57,146,0.15)', color: '#0A3992' }}
            >
              {revealed ? caseKey : caseKey.replace(/[A-Z0-9]/g, '•')}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setRevealed(!revealed)}
                className="p-2.5 rounded-xl border text-slate-400 hover:text-[#0A3992] transition-all"
                style={{ borderColor: 'rgba(226,232,240,0.8)' }}
                title={revealed ? 'Hide key' : 'Reveal key'}
              >
                {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl text-white transition-all"
                style={{ background: copied ? '#16a34a' : '#0A3992' }}
                title="Copy key"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
          {copied && (
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-2 text-center">
              ✓ Copied to clipboard!
            </p>
          )}
        </div>

        <p className="text-sm text-slate-500 font-semibold leading-relaxed mb-8">
          <strong className="text-slate-800">Save this key securely.</strong> You will need it to check
          the status of your report without logging in or providing personal details.
        </p>

        <button
          onClick={onClose}
          className="w-full px-8 py-4 font-black rounded-2xl text-white text-sm uppercase tracking-widest transition-all hover:-translate-y-0.5 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #0A3992, #082f7a)',
            boxShadow: '0 8px 24px -4px rgba(10,57,146,0.4)',
          }}
        >
          Close & Check Status
        </button>
      </motion.div>
    </div>
  );
};

// ── Main Page ──
export default function SubmitPage() {
  const [formData, setFormData] = useState({ projectID: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [caseKey, setCaseKey] = useState('');
  const [trackKey, setTrackKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedKey = generateCaseKeyHash();
      setCaseKey(generatedKey);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ projectID: '', description: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <AnimatePresence>
        {isSubmitted && (
          <SubmissionModal caseKey={caseKey} onClose={() => setIsSubmitted(false)} />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <header className="mb-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-black uppercase tracking-widest"
            style={{
              background: 'rgba(185,54,84,0.06)',
              color: '#B93654',
              border: '1px solid rgba(185,54,84,0.15)',
            }}
          >
            <Shield size={11} /> Secure Anonymous Submission
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter">
            Civic Watchdog{' '}
            <span className="text-[#B93654] text-3xl sm:text-4xl font-semibold italic tracking-normal">
              (SatyaTathya)
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-500 font-semibold max-w-2xl mx-auto leading-relaxed">
            Anonymously report corruption, waste, or misuse of public funds. Your identity is protected.
          </p>
        </header>

        {/* ── Report Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-xl"
          style={{
            borderTop: '4px solid #B93654',
            boxShadow: '0 16px 60px -12px rgba(15,23,42,0.12)',
            border: '1px solid rgba(226,232,240,0.6)',
          }}
        >
          <div className="p-8 sm:p-12">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">File Your Report</h2>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Project ID */}
              <div>
                <label htmlFor="projectID" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
                  Associated Project / Tender ID <span className="normal-case font-semibold text-slate-300">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="projectID"
                  id="projectID"
                  value={formData.projectID}
                  onChange={handleChange}
                  placeholder="e.g. BIKAS-10293 or BOLPATRA-4567"
                  className="w-full border rounded-2xl p-4 text-sm font-semibold text-slate-900 transition-all outline-none"
                  style={{
                    background: 'rgba(248,250,255,0.6)',
                    borderColor: 'rgba(226,232,240,0.8)',
                  }}
                  disabled={isSubmitting}
                />
                <p className="mt-2 text-xs text-slate-400 font-semibold">
                  Providing the project ID helps streamline verification.
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
                  Detailed Description <span className="normal-case font-semibold">(Required)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={7}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the Who, What, Where, and When of the incident. Be specific regarding dates, locations (municipality, ward), and the entities involved."
                  className="w-full border rounded-2xl p-4 text-sm font-semibold text-slate-900 resize-none transition-all outline-none"
                  style={{
                    background: 'rgba(248,250,255,0.6)',
                    borderColor: 'rgba(226,232,240,0.8)',
                  }}
                  disabled={isSubmitting}
                />
                <p className="mt-2 text-xs text-[#B93654] font-bold">
                  ⚠ Do not include personal identifying information about yourself.
                </p>
              </div>

              {/* Evidence uploader */}
              <EvidenceUploader />

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.description.trim()}
                className="w-full flex justify-center items-center py-4 px-6 rounded-2xl text-lg font-black text-white transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: isSubmitting
                    ? 'rgba(226,232,240,0.8)'
                    : 'linear-gradient(135deg, #B93654, #9e2c46)',
                  boxShadow: isSubmitting ? 'none' : '0 12px 32px -6px rgba(185,54,84,0.4)',
                  color: isSubmitting ? '#94a3b8' : 'white',
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Encrypting & Submitting...
                  </>
                ) : (
                  'Submit Anonymous Report'
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* ── Track Status ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white p-8 rounded-3xl border shadow-sm"
          style={{
            borderColor: 'rgba(226,232,240,0.7)',
            boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)',
          }}
        >
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-4 tracking-tight">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #0A3992, #082f7a)' }}
            >
              <Shield size={16} strokeWidth={2.5} />
            </div>
            Check Report Status
          </h3>
          <p className="text-slate-500 font-semibold text-sm mb-5 leading-relaxed">
            Enter your unique <strong className="text-slate-800">Case Key</strong> to track the
            verification process, maintaining full anonymity.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={trackKey}
              onChange={(e) => setTrackKey(e.target.value)}
              placeholder="Enter your SATYA-KEY here"
              className="flex-1 border rounded-2xl p-4 text-sm font-semibold text-slate-900 transition-all outline-none"
              style={{
                background: 'rgba(248,250,255,0.6)',
                borderColor: 'rgba(226,232,240,0.8)',
              }}
            />
            <button
              className="px-7 py-4 font-black rounded-2xl text-white text-sm transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg, #0A3992, #082f7a)',
                boxShadow: '0 8px 24px -4px rgba(10,57,146,0.35)',
              }}
            >
              Track Status
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}