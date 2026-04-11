'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, ChevronUp, ChevronDown, MessageSquare, Send, Bell } from 'lucide-react';
import { SubscriptionModal } from '../../components/SubscriptionModal';

// ── Money Formatter ──
const MoneyFormatter: React.FC<{ amount: number }> = ({ amount }) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
  return <span className="text-sm font-black tracking-tight text-[#0A3992]">{formatted}</span>;
};

// ── Deterministic Generator for Mock Stats ──
function getContractorStats(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const random = (seed: number) => {
    const x = Math.sin(hash++ + seed) * 10000;
    return x - Math.floor(x);
  };
  
  const yearsActive = Math.floor(random(1) * 20) + 2; 
  const completedProjects = Math.floor(random(2) * 50) + 5;
  const timelyCompletionRate = Math.floor(random(3) * 40) + 50; // 50-90%
  const satisfactionRate = Math.floor(random(4) * 35) + 60; // 60-95%
  const isBlacklisted = random(5) > 0.95; // 5% chance

  return { yearsActive, completedProjects, timelyCompletionRate, satisfactionRate, isBlacklisted };
}

interface AwardedTenderRowProps {
  tender: any;
}

const AwardedTenderRow: React.FC<AwardedTenderRowProps> = ({ tender }) => {
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  // Mock finding the contractor name. Some backend responses might nest this deeply.
  const contractorName = 
    tender.contractor_name || 
    (tender.award_result && tender.award_result[0] && tender.award_result[0].supplier?.name) || 
    'Unknown Contractor Ltd';

  const amount =
    tender.award_result && tender.award_result.length > 0
      ? tender.award_result[0].price
      : tender.estimated_cost?.length > 0
      ? tender.estimated_cost[0].amount
      : tender.rawPayload?.estimated_amount || 0;

  const stats = useMemo(() => getContractorStats(contractorName), [contractorName]);
  
  // Deterministic starting progress
  const initialProgress = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < (tender.title || '').length; i++) {
        hash = (tender.title || '').charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash) * 10000;
    return Math.max(10, Math.floor((x - Math.floor(x)) * 80));
  }, [tender.title]);

  // Company's Reported Progress (Static, untouchable by citizens)
  const [progress] = useState(initialProgress);
  
  // Reddit-style Upvotes
  const baseScore = useMemo(() => Math.floor(initialProgress * 3.7), [initialProgress]);
  const [score, setScore] = useState(baseScore);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  // Comments & Reviews
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const initialComments = useMemo(() => [
      { id: 1, user: "Kathmandu Resident", text: "They started cordoning off the area last week, but now traffic is terrible.", time: "2 days ago", upvotes: 12 },
      { id: 2, user: "Local Business Owner", text: "Real progress is visible compared to last year's stall.", time: "5 days ago", upvotes: 34 }
  ], []);
  const [comments, setComments] = useState(initialComments);

  const handleUpvote = () => {
      if (userVote === 'up') {
          setScore(s => s - 1);
          setUserVote(null);
      } else {
          setScore(s => s + (userVote === 'down' ? 2 : 1));
          setUserVote('up');
      }
  };

  const handleDownvote = () => {
      if (userVote === 'down') {
          setScore(s => s + 1);
          setUserVote(null);
      } else {
          setScore(s => s - (userVote === 'up' ? 2 : 1));
          setUserVote('down');
      }
  };

  const handlePostComment = () => {
      if (!newComment.trim()) return;
      setComments([{ id: Date.now(), user: 'You (Citizen)', text: newComment, time: 'Just now', upvotes: 1 }, ...comments]);
      setNewComment("");
  };

  const isHighRisk = stats.isBlacklisted || stats.satisfactionRate < 70;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="group relative block rounded-3xl transition-all duration-300 border bg-white overflow-hidden shadow-sm"
      style={{
        borderColor: 'rgba(226,232,240,0.8)',
        boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(10,57,146,0.2)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px -8px rgba(10,57,146,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(226,232,240,0.8)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px -4px rgba(15,23,42,0.06)';
      }}
    >
      {/* Top accent bar indicating it's an awarded contract */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
        style={{ background: 'linear-gradient(90deg, #0A3992, #B93654)' }}
      />

      <div className="p-6">
        {/* Header: Project Details */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 border-b border-slate-100 pb-5">
            <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                        className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
                        style={{ background: 'rgba(10,57,146,0.1)', color: '#0A3992', border: '1px solid rgba(10,57,146,0.2)' }}
                    >
                        Awarded Contract
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {tender.public_entity_name || 'Public Infrastructure'}
                    </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-snug tracking-tight mb-2 pr-4 pl-1">
                    {tender.title}
                </h3>
            </div>
            
            <div className="shrink-0 flex flex-col md:items-end gap-3 min-w-[140px]">
                <div className="flex flex-col md:items-end p-4 rounded-xl bg-slate-50 border border-slate-100 w-full transition-all hover:bg-white hover:shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Value</span>
                    {amount > 0 ? (
                        <MoneyFormatter amount={amount} />
                    ) : (
                        <span className="text-sm font-black text-slate-400 italic">Undisclosed</span>
                    )}
                </div>
                <button 
                    onClick={() => setIsNotifyModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95 group/btn"
                    style={{ background: 'linear-gradient(135deg, #B93654, #9e2c46)', boxShadow: '0 4px 12px -2px rgba(185,54,84,0.3)' }}
                >
                    <Bell size={14} className="group-hover/btn:animate-bounce" /> Monitor Updates
                </button>
            </div>

        </div>

        {/* Middle: Contractor Profile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-7">
            {/* Contractor Main Identity */}
            <div className="col-span-1 md:col-span-4 p-5 rounded-2xl border" style={{ background: 'rgba(248,250,255,0.7)', borderColor: 'rgba(10,57,146,0.15)' }}>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#0A3992] mb-1.5 block">Winning Contractor</span>
                <p className="font-black text-slate-900 text-base leading-snug mb-3">{contractorName}</p>
                {stats.isBlacklisted ? (
                    <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-white bg-[#B93654] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm animate-pulse">
                        <AlertTriangle size={12} strokeWidth={3} /> Blacklist Warning
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 text-[9px] font-black text-[#0A3992] bg-blue-100 px-2.5 py-1 rounded-md uppercase tracking-wider border border-blue-200">
                        <CheckCircle size={12} strokeWidth={3} /> Cleared Record
                    </div>
                )}
            </div>

            {/* Historical Stats derived from the name */}
            <div className="col-span-1 md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex flex-col justify-center p-4 rounded-xl border border-slate-100 bg-white">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-tight">Years<br/>Active</span>
                    <span className="text-xl font-black text-slate-900">{stats.yearsActive}</span>
                </div>
                <div className="flex flex-col justify-center p-4 rounded-xl border border-slate-100 bg-white">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-tight">Projects<br/>Completed</span>
                    <span className="text-xl font-black text-slate-900">{stats.completedProjects}</span>
                </div>
                <div className="flex flex-col justify-center p-4 rounded-xl border border-slate-100 bg-white">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-tight">Timely<br/>Delivery</span>
                    <span className="text-xl font-black text-slate-900 flex items-center gap-1">
                        {stats.timelyCompletionRate}%
                        {stats.timelyCompletionRate > 75 
                            ? <TrendingUp size={14} className="text-[#0A3992]" />
                            : <Clock size={14} className="text-[#B93654]" />
                        }
                    </span>
                </div>
                <div className="flex flex-col justify-center p-4 rounded-xl border relative overflow-hidden" 
                     style={{ 
                         borderColor: isHighRisk ? 'rgba(185,54,84,0.3)' : 'rgba(10,57,146,0.3)',
                         background: isHighRisk ? 'rgba(185,54,84,0.03)' : 'rgba(10,57,146,0.03)'
                     }}>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 leading-tight">Civic<br/>Score</span>
                    <span className="text-2xl font-black" style={{ color: isHighRisk ? '#B93654' : '#0A3992' }}>
                        {stats.satisfactionRate}%
                    </span>
                </div>
            </div>
        </div>

        {/* Bottom: Crowdsourced Progress Tracking */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
            {/* Ambient background blur */}
            <div className="absolute top-0 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: '#0A3992' }} />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-1 block">Live Site Tracking</span>
                            <span className="font-semibold text-slate-300 text-sm">Company Reported Progress</span>
                        </div>
                        <span className="text-3xl font-black tracking-tighter" style={{ color: 'rgba(255,255,255,0.95)' }}>
                            {progress}%
                        </span>
                    </div>
                    {/* The Bar */}
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0.2, duration: 1 }}
                            className="h-full rounded-full relative"
                            style={{ background: 'linear-gradient(90deg, #0A3992, #3a65c7, #60a5fa)' }}
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/20 animate-pulse pointer-events-none" />
                        </motion.div>
                    </div>
                </div>

                {/* Reddit Style Actions */}
                <div className="shrink-0 flex items-center gap-3 w-full md:w-auto mt-6 md:mt-0">
                    <div className="flex items-center bg-slate-950/50 rounded-xl border border-slate-700/50 p-1">
                        <button 
                            onClick={handleUpvote}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${userVote === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <ChevronUp size={20} strokeWidth={3} />
                        </button>
                        <span className={`w-10 text-center font-black ${userVote === 'up' ? 'text-emerald-400' : userVote === 'down' ? 'text-rose-400' : 'text-white'}`}>
                            {score}
                        </span>
                        <button 
                            onClick={handleDownvote}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${userVote === 'down' ? 'text-rose-400 bg-rose-400/10' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <ChevronDown size={20} strokeWidth={3} />
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${showComments ? 'bg-[#0A3992]/20 border-[#0A3992] text-blue-300' : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700'}`}
                    >
                        <MessageSquare size={16} />
                        {comments.length} Reviews
                    </button>
                </div>
            </div>

            {/* Expandable Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 border-t border-slate-700/50 pt-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <input 
                                type="text" 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Leave your field review or report issues..." 
                                className="flex-1 bg-slate-950/40 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0A3992] transition-colors"
                            />
                            <button 
                                onClick={handlePostComment}
                                className="bg-[#0A3992] hover:bg-[#0A3992]/80 text-white p-3 rounded-xl transition-colors active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {comments.map(c => (
                                <div key={c.id} className="bg-slate-950/30 rounded-xl p-4 border border-slate-800/50 hover:border-slate-700/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-200">{c.user}</span>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{c.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <ChevronUp size={14} className="text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-400">{c.upvotes}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400">{c.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-4 text-center md:text-left relative z-10 italic">
                Data updated via the satya-tathya public accountability network
            </p>
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

export default AwardedTenderRow;
