'use client';

import React from 'react';

interface AnonAvatarProps {
    seed: string;
    size?: number;
}

/**
 * Generates a deterministic avatar from a seed string (e.g., a report ID).
 * Uses simple hashing to pick a background color and initials.
 */
const AnonymousAvatar: React.FC<AnonAvatarProps> = ({ seed, size = 36 }) => {
    // Hash the seed to pick a consistent color
    const colors = [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];

    return (
        <div
            title="Anonymous Reporter"
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}
        >
            <svg
                width={size * 0.55}
                height={size * 0.55}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Silhouette icon */}
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
        </div>
    );
};

export default AnonymousAvatar;
