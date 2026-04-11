'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const BACKEND_URL = 'http://localhost:5000';

type Message = { role: 'user' | 'assistant'; content: string };

export const ThirdEyeConcierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Namaste! I am the **Third Eye Concierge**. How can I help you with Nepal's Budget or Procurement system today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/ai/chat`, {
        message: userMessage,
        history: messages.slice(-5),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err: any) {
      console.error('Chat Error:', err);
      const errorDetail = err.response?.data?.details || "Please check your backend connection.";
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            `**Connection Issue:** ${errorDetail}\n\n*Make sure your backend server is running and the GEMINI_API_KEY is active.*`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-4 w-[420px] h-[660px] flex flex-col overflow-hidden rounded-[2rem]"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 32px 80px -16px rgba(15,23,42,0.2)',
            }}
          >
            {/* Header */}
            <div
              className="p-5 flex items-center justify-between shrink-0"
              style={{
                background: 'linear-gradient(135deg, #B93654 0%, #9e2c46 100%)',
                boxShadow: '0 4px 20px -4px rgba(185,54,84,0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/15 p-2.5 rounded-xl border border-white/20 backdrop-blur-sm">
                  <Bot className="text-white w-5 h-5" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white tracking-wider uppercase">Third Eye AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">
                      National Data Sync
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/15 rounded-xl transition-all text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar"
              style={{ background: 'rgba(248,250,255,0.5)' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 mt-auto shrink-0"
                      style={{ background: 'linear-gradient(135deg, #B93654, #9e2c46)' }}
                    >
                      <Bot size={14} className="text-white" strokeWidth={2} />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'rounded-tr-sm text-white font-semibold'
                        : 'rounded-tl-sm text-slate-800 border font-medium'
                    }`}
                    style={
                      m.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, #0A3992, #082f7a)',
                            boxShadow: '0 4px 16px -4px rgba(10,57,146,0.3)',
                          }
                        : {
                            background: 'white',
                            borderColor: 'rgba(226,232,240,0.7)',
                            boxShadow: '0 2px 8px -2px rgba(15,23,42,0.06)',
                          }
                    }
                  >
                    {m.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          // Omit 'node' from props to avoid React unknown prop warning
                          ul: ({ node: _node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                          ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                          li: ({ node: _node, ...props }) => <li className="mb-1" {...props} />,
                          p:  ({ node: _node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                          strong: ({ node: _node, ...props }) => (
                            <strong className="font-black" style={{ color: '#B93654' }} {...props} />
                          ),
                          a: ({ node: _node, ...props }) => (
                            <a className="underline hover:opacity-80 transition-opacity" style={{ color: '#0A3992' }} {...props} />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 shrink-0"
                    style={{ background: 'linear-gradient(135deg, #B93654, #9e2c46)' }}
                  >
                    <Bot size={14} className="text-white" strokeWidth={2} />
                  </div>
                  <div
                    className="p-4 rounded-2xl rounded-tl-sm border flex items-center gap-3 shadow-sm"
                    style={{ background: 'white', borderColor: 'rgba(226,232,240,0.7)' }}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#B93654' }} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                      Analyzing records...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-4 shrink-0"
              style={{ borderTop: '1px solid rgba(226,232,240,0.6)', background: 'rgba(255,255,255,0.7)' }}
            >
              <div
                className="flex items-center gap-3 rounded-2xl p-3 transition-all"
                style={{
                  background: 'white',
                  border: '2px solid rgba(226,232,240,0.7)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#B93654')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(226,232,240,0.7)')}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Budget or Tenders..."
                  className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900 placeholder:text-slate-300 font-semibold"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !query.trim()}
                  className="p-2.5 rounded-xl text-white transition-all active:scale-90 disabled:opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                    boxShadow: '0 4px 12px -2px rgba(185,54,84,0.35)',
                  }}
                >
                  <Send size={16} className="text-white" strokeWidth={2.5} />
                </button>
              </div>
              <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">
                Powered by ThirdEye AI • Government Data Sync
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[1.75rem] flex items-center justify-center relative overflow-hidden"
        style={
          isOpen
            ? {
                background: 'linear-gradient(135deg, #0a1628, #0A3992)',
                boxShadow: '0 12px 32px -6px rgba(10,57,146,0.5)',
              }
            : {
                background: 'linear-gradient(135deg, #B93654, #9e2c46)',
                boxShadow: '0 12px 32px -6px rgba(185,54,84,0.5)',
              }
        }
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700"
          style={{
            background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            transform: 'translateX(-100%)',
          }}
        />
        {isOpen ? (
          <X className="text-white w-6 h-6 relative z-10" strokeWidth={2.5} />
        ) : (
          <MessageSquare className="text-white w-6 h-6 relative z-10" strokeWidth={2} />
        )}
        {/* Notification dot */}
        {!isOpen && (
          <div
            className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
            style={{ background: '#0A3992' }}
          />
        )}
      </motion.button>
    </div>
  );
};
