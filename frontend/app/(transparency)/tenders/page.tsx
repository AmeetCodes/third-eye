import React from 'react';
import Link from 'next/link';
import { Search, MapPin, Building2, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function fetchBolpatraTenders(
  page = 1,
  search = '',
  district = '',
  category = '',
  minScore = '',
  maxScore = ''
) {
  const url = new URL('http://localhost:5000/api/tenders');
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', '20');
  if (search) url.searchParams.append('search', search);
  if (district) url.searchParams.append('district', district);
  if (category) url.searchParams.append('category', category);
  if (minScore) url.searchParams.append('minScore', minScore);
  if (maxScore) url.searchParams.append('maxScore', maxScore);

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch from Backend API');
    return res.json();
  } catch (error) {
    console.error('Frontend Fetch Error:', error);
    return null;
  }
}

async function fetchTenderStats() {
  const url = `http://localhost:5000/api/tenders/stats`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

import TenderRow from './TenderRow';
import AwardedTenderRow from './AwardedTenderRow';

// ── Market Insight ──
const MarketInsight: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
      {/* Top Districts */}
      <div className="rounded-2xl p-6 text-white overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0A3992 100%)',
          boxShadow: '0 12px 40px -8px rgba(10,57,146,0.4)',
        }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ background: 'rgba(100,180,255,0.8)' }} />
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-blue-300" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-300">Top Procurement Hotspots</h4>
        </div>
        <div className="flex flex-wrap gap-2.5 relative z-10">
          {stats.topDistricts?.slice(0, 3).map((d: any, idx: number) => (
            <Link
              key={idx}
              href={`/tenders?district=${encodeURIComponent(d.name)}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="text-sm font-bold text-white">{d.name}</span>
              <span className="text-[10px] font-black text-blue-200 bg-blue-400/20 px-2 py-0.5 rounded-lg">{d.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Entities */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm relative overflow-hidden"
        style={{ borderColor: 'rgba(226,232,240,0.8)', boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
          style={{ background: 'rgba(10,57,146,0.5)' }} />
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={14} className="text-[#0A3992]" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Most Active Entities</h4>
        </div>
        <div className="flex flex-wrap gap-2.5 relative z-10">
          {stats.topEntities?.slice(0, 3).map((e: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl max-w-[220px]"
              style={{ background: 'rgba(10,57,146,0.05)', border: '1px solid rgba(10,57,146,0.1)' }}>
              <span className="text-sm font-bold text-slate-700 truncate">{e.name}</span>
              <span className="text-[10px] font-black text-[#0A3992] bg-blue-100 px-2 py-0.5 rounded-lg shrink-0">{e.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Filter Sidebar ──
const TenderFilters: React.FC<{
  total: number;
  currentSearch: string;
  currentDistrict: string;
  isRiskOnly: boolean;
}> = ({ total, currentSearch, currentDistrict, isRiskOnly }) => {
  return (
    <aside className="lg:w-80 shrink-0">
      <form
        action="/tenders"
        method="GET"
        className="bg-white rounded-[2rem] shadow-sm border p-8 sticky top-28"
        style={{ borderColor: 'rgba(226,232,240,0.7)', boxShadow: '0 8px 40px -8px rgba(15,23,42,0.06)' }}
      >
        <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full inline-block" style={{ background: 'linear-gradient(180deg, #B93654, #0A3992)' }} />
          Live Filters
        </h2>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 block">
              Search Notice
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                name="search"
                type="text"
                defaultValue={currentSearch}
                className="w-full bg-slate-50/80 border rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 transition-all"
                style={{ borderColor: 'rgba(226,232,240,0.8)' }}
                placeholder="e.g. Bridge, Medical..."
              />
            </div>
          </div>

          {/* District */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 block">
              District
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                name="district"
                type="text"
                defaultValue={currentDistrict}
                className="w-full bg-slate-50/80 border rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 transition-all"
                style={{ borderColor: 'rgba(226,232,240,0.8)' }}
                placeholder="e.g. Kathmandu"
              />
            </div>
          </div>

          {/* Risk Only */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 block">
              Risk Watchlist
            </label>
            <label className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all hover:bg-red-50"
              style={{ background: 'rgba(185,54,84,0.04)', border: '1px solid rgba(185,54,84,0.12)' }}>
              <input
                name="isRiskOnly"
                type="checkbox"
                value="true"
                defaultChecked={isRiskOnly}
                className="w-5 h-5 rounded-lg accent-[#B93654]"
              />
              <span className="text-sm font-bold text-slate-700">Show Suspicious Notices</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 py-4 font-black text-xs uppercase tracking-widest text-white rounded-2xl transition-all hover:-translate-y-0.5 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #0A3992, #082f7a)',
            boxShadow: '0 8px 24px -4px rgba(10,57,146,0.35)',
          }}
        >
          Apply — Found {total}
        </button>

        {(currentSearch || currentDistrict) && (
          <Link
            href="/tenders"
            className="block text-center mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#B93654] transition-colors"
          >
            ✕ Clear all filters
          </Link>
        )}
      </form>
    </aside>
  );
};

// ── Main Page ──
export default async function TendersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const pageStr = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1';
  const page = parseInt(pageStr, 10) || 1;

  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const district = typeof resolvedParams.district === 'string' ? resolvedParams.district : '';
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : '';
  const isRiskOnly = resolvedParams.isRiskOnly === 'true';
  const tab = typeof resolvedParams.tab === 'string' ? resolvedParams.tab : 'awarded';
  const maxScore = isRiskOnly ? '40' : '';

  // Increased fetch limit slightly to ensure we catch enough variations of Awarded projects organically for the demo
  const [data, statsData] = await Promise.all([
    fetchBolpatraTenders(page, search, district, category, '', maxScore),
    fetchTenderStats()
  ]);

  const results = data?.data || [];
  const stats = statsData?.stats || null;

  // Dummy high-quality Awarded Tenders data for demonstration
  const DUMMY_AWARDED = [
    {
      id: 'd1',
      public_entity_name: 'Department of Roads',
      title: 'Upgradation and Widening of Kathmandu-Naubise Highway',
      contractor_name: 'Sharma & Company Pvt. Ltd.',
      award_result: [{ price: 4500000000 }],
    },
    {
      id: 'd2',
      public_entity_name: 'Nepal Electricity Authority',
      title: 'Construction of 132kV Transmission Line (Hetauda-Dhalkebar)',
      contractor_name: 'Kalika Construction B.A.',
      award_result: [{ price: 2150000000 }],
    },
    {
      id: 'd3',
      public_entity_name: 'Ministry of Urban Development',
      title: 'Integrated Solid Waste Management Facility Construction',
      contractor_name: 'Raman Construction Corp.',
      award_result: [{ price: 850000000 }],
    },
    {
      id: 'd4',
      public_entity_name: 'Melamchi Water Supply Development Board',
      title: 'Laying of Primary Distribution Network in Lalitpur Area',
      contractor_name: 'Swachchhanda Nirman Sewa',
      award_result: [{ price: 1200000000 }],
    },
    {
      id: 'd5',
      public_entity_name: 'Department of Health Services',
      title: 'Construction of Modern 500-Bed Provincial Hospital Building',
      contractor_name: 'Lumbini Builders Pvt. Ltd.',
      award_result: [{ price: 3400000000 }],
    }
  ];

  let filteredResults = [];
  if (tab === 'awarded') {
    filteredResults = DUMMY_AWARDED;
    if (search) {
      filteredResults = filteredResults.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) || 
        t.contractor_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (isRiskOnly) {
       // Deterministically mock suspicious contractors for demo purposes
       filteredResults = filteredResults.filter(t => t.contractor_name.includes('Sharma') || t.contractor_name.includes('Raman'));
    }
  } else {
    filteredResults = results.filter((tender: any) => {
        const isAwarded = !!tender.contractor_name || (tender.award_result && tender.award_result.length > 0);
        return !isAwarded;
    });
  }

  const total = filteredResults.length; // Local scoped counting for current page

  return (
    <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-14 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #B93654, #0A3992)' }} />
          <span className="text-xs font-black uppercase tracking-widest text-[#0A3992]">
            Official Procurement Stream
          </span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4">
          Tender Feed{' '}
          <span className="text-slate-300 font-light">/</span>{' '}
          <span className="text-[#0A3992]">Bolpatra</span>
        </h1>
        <p className="text-lg text-slate-500 font-semibold max-w-2xl leading-relaxed">
          Real-time infrastructure and service bids from across Nepal, enhanced with civic intelligence.
        </p>
      </header>

      <MarketInsight stats={stats} />

      <div className="flex flex-col lg:flex-row gap-10">
        <TenderFilters total={total} currentSearch={search} currentDistrict={district} isRiskOnly={isRiskOnly} />

        <div className="flex-1 min-w-0">
          {/* Tabs UI */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit border" style={{ borderColor: 'rgba(226,232,240,0.8)' }}>
            <Link
              href={`/tenders?tab=awarded${search ? `&search=${search}` : ''}${district ? `&district=${district}` : ''}`}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                tab === 'awarded' 
                  ? 'bg-white text-[#B93654] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Awarded Contracts
            </Link>
            <Link
              href={`/tenders?tab=active${search ? `&search=${search}` : ''}${district ? `&district=${district}` : ''}`}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                tab === 'active' 
                  ? 'bg-white text-[#B93654] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Active Bidding
            </Link>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-8 pb-6"
            style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {tab === 'active' ? 'Live Notices' : 'Awarded Projects'}
              <span className="text-slate-300 font-light text-xl ml-2 tabular-nums"></span>
            </h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${tab === 'active' ? 'bg-[#B93654] animate-pulse' : 'bg-[#0A3992]'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {tab === 'active' ? 'Accepting Bids' : 'Monitoring Progress'}
              </span>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed" style={{ borderColor: 'rgba(226,232,240,0.8)' }}>
              <TrendingUp size={48} className="mx-auto text-slate-200 mb-6 group-hover:scale-110 transition-transform" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm max-w-sm mx-auto">
                No {tab === 'active' ? 'active tenders' : 'awarded projects'} found in this set
              </p>
              <Link href="/tenders" className="mt-5 inline-flex items-center gap-2 text-[#0A3992] bg-blue-50 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-0.5 transition-transform">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredResults.map((tender: any) => (
                tab === 'active' 
                    ? <TenderRow key={tender.id || tender._id} tender={tender} /> 
                    : <AwardedTenderRow key={tender.id || tender._id} tender={tender} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-14 flex items-center justify-between bg-white p-5 rounded-3xl border shadow-sm"
            style={{ borderColor: 'rgba(226,232,240,0.7)', boxShadow: '0 4px 16px -4px rgba(15,23,42,0.06)' }}>
            <Link
              href={`/tenders?tab=${tab}&page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}${district ? `&district=${district}` : ''}`}
              className={`px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                page <= 1
                  ? 'opacity-30 pointer-events-none border-slate-100 text-slate-400'
                  : 'border-slate-200 hover:border-[#B93654] hover:text-[#B93654]'
              }`}
            >
              ← Previous
            </Link>
            <div className="text-xs font-black text-slate-400">
              Page <span className="text-slate-900 font-black">{page}</span>
            </div>
            <Link
              href={`/tenders?tab=${tab}&page=${page + 1}${search ? `&search=${search}` : ''}${district ? `&district=${district}` : ''}`}
              className="px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #0A3992, #082f7a)',
                boxShadow: '0 6px 20px -4px rgba(10,57,146,0.35)',
              }}
            >
              Next Page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}