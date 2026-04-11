"use client";

import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportIssueModal({
  tender,
  onClose,
}: {
  tender: any;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Delay');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (file) formData.append('proofImage', file);

    try {
      const res = await fetch(`http://localhost:5000/api/issues/${tender._id}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 3000);
      } else {
        setError('Failed to submit report. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-14 max-w-md w-full text-center overflow-hidden relative"
            style={{ boxShadow: '0 32px 80px -16px rgba(15,23,42,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 opacity-30 -z-10"
              style={{ background: 'radial-gradient(ellipse at top, rgba(22,163,74,0.1), transparent 60%)' }} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 0.1 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8"
              style={{ background: 'rgba(22,163,74,0.1)', border: '2px solid rgba(22,163,74,0.2)' }}
            >
              <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2} />
            </motion.div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Report Seeded</h2>
            <p className="text-slate-500 font-semibold leading-relaxed">
              Thank you for holding the standard. Your evidence is now part of the national record.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden relative"
            style={{ boxShadow: '0 32px 80px -16px rgba(15,23,42,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: 'linear-gradient(90deg, #B93654, #0A3992)' }} />

            {/* Modal header */}
            <div className="flex items-center justify-between p-8 pb-6"
              style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                  <AlertCircle style={{ color: '#B93654' }} size={22} strokeWidth={2} />
                  Raise National Issue
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">
                  Public Accountability Protocol
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border flex items-center justify-center text-slate-400 hover:text-[#B93654] transition-all"
                style={{ borderColor: 'rgba(226,232,240,0.8)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8">
              {/* Subject project */}
              <div className="p-5 rounded-2xl mb-7"
                style={{ background: 'rgba(185,54,84,0.05)', border: '1px solid rgba(185,54,84,0.12)' }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#B93654' }}>
                  Subject Project
                </p>
                <p className="font-black text-slate-900 tracking-tight text-sm leading-snug">{tender.title}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1">{tender.public_entity_name}</p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-5">
                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Issue Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 font-semibold rounded-2xl p-4 border outline-none transition-all cursor-pointer text-sm appearance-none"
                      style={{ borderColor: 'rgba(226,232,240,0.8)' }}
                    >
                      <option value="Delay">Project Delayed</option>
                      <option value="Quality Issue">Poor Material Quality</option>
                      <option value="Corruption">Suspected Mismanagement</option>
                      <option value="Other">Other Issues</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Report Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief summary of the issue..."
                      className="w-full bg-slate-50 text-slate-900 font-semibold rounded-2xl p-4 border outline-none transition-all placeholder:text-slate-300 text-sm"
                      style={{ borderColor: 'rgba(226,232,240,0.8)' }}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Provide details, dates, and observed issues..."
                      className="w-full bg-slate-50 text-slate-900 font-semibold rounded-2xl p-4 border outline-none transition-all placeholder:text-slate-300 resize-none text-sm"
                      style={{ borderColor: 'rgba(226,232,240,0.8)' }}
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Evidence upload */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Evidence Capture
                    </label>
                    <label
                      className="relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[1.75rem] cursor-pointer overflow-hidden transition-all"
                      style={{ borderColor: 'rgba(10,57,146,0.2)', background: 'rgba(10,57,146,0.02)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = '#0A3992';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(10,57,146,0.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,57,146,0.2)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(10,57,146,0.02)';
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {previewUrl ? (
                          <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                          >
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="bg-white px-4 py-2 rounded-full text-xs font-black text-slate-900 shadow-xl">
                                Change Photo
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center p-6"
                          >
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                              style={{ background: 'rgba(10,57,146,0.08)' }}
                            >
                              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#0A3992" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm font-black text-slate-800 mb-1 tracking-tight">Drop Evidence Here</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              JPG, PNG, WEBP · Max 5MB
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {error && (
                    <p className="text-xs font-black text-[#B93654] px-2">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-black py-5 px-4 rounded-2xl text-white text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-3"
                    style={{
                      background: loading ? 'rgba(226,232,240,0.8)' : 'linear-gradient(135deg, #B93654, #9e2c46)',
                      boxShadow: loading ? 'none' : '0 12px 32px -6px rgba(185,54,84,0.4)',
                      color: loading ? '#94a3b8' : 'white',
                    }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={18} strokeWidth={2.5} /> Post Evidence
                      </>
                    )}
                  </button>
                  <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                    Legal Protocol: False reporting is punishable by law
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
