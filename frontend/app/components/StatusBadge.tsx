import React from 'react';

export type Status =
  | 'Active'
  | 'Stalled'
  | 'Completed'
  | 'Pending Verification'
  | 'Under Investigation'
  | 'Red Flagged'
  | 'Verified & Action Taken'
  | 'Verified & Cease Order Issued'
  | 'Rejected'
  | string;

export interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStyle = (): React.CSSProperties => {
    switch (status) {
      case 'Completed':
      case 'Verified & Action Taken':
      case 'Verified & Cease Order Issued':
        return {
          background: 'rgba(22,163,74,0.08)',
          color: '#15803d',
          border: '1px solid rgba(22,163,74,0.2)',
        };
      case 'Active':
        return {
          background: 'rgba(10,57,146,0.08)',
          color: '#0A3992',
          border: '1px solid rgba(10,57,146,0.2)',
        };
      case 'Stalled':
        return {
          background: 'rgba(245,158,11,0.08)',
          color: '#b45309',
          border: '1px solid rgba(245,158,11,0.2)',
        };
      case 'Red Flagged':
        return {
          background: 'rgba(185,54,84,0.08)',
          color: '#B93654',
          border: '1px solid rgba(185,54,84,0.2)',
        };
      case 'Pending Verification':
        return {
          background: 'rgba(100,116,139,0.08)',
          color: '#475569',
          border: '1px solid rgba(100,116,139,0.2)',
        };
      case 'Under Investigation':
        return {
          background: 'rgba(124,58,237,0.08)',
          color: '#6d28d9',
          border: '1px solid rgba(124,58,237,0.2)',
        };
      case 'Rejected':
        return {
          background: 'rgba(239,68,68,0.08)',
          color: '#dc2626',
          border: '1px solid rgba(239,68,68,0.2)',
        };
      default:
        return {
          background: 'rgba(15,23,42,0.06)',
          color: '#475569',
          border: '1px solid rgba(15,23,42,0.1)',
        };
    }
  };

  return (
    <span
      className="inline-flex items-center px-3 py-1.5 text-[10px] font-black rounded-2xl uppercase tracking-widest whitespace-nowrap"
      style={getStyle()}
    >
      {status}
    </span>
  );
}