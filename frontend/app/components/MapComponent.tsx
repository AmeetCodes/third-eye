'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Dynamic import for Leaflet (prevent SSR issues)
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

const LeafletAutoPan = dynamic(() => 
    import('react-leaflet').then(mod => {
        const { useMap } = mod;
        return function AutoPanHandler({ coords, zoom }: { coords: Array<[number, number]>, zoom: number }) {
            const map = useMap();
            React.useEffect(() => {
                if (coords.length === 1) {
                    map.flyTo(coords[0], 11, { duration: 1.5 });
                } else if (coords.length > 1) {
                    map.flyTo([28.3949, 84.1240], zoom, { duration: 1.5 });
                }
            }, [coords, map, zoom]);
            return null;
        };
    }), 
    { ssr: false }
);

const DISTRICT_COORDS: Record<string, [number, number]> = {
    'Kathmandu': [27.7172, 85.3240],
    'Pokhara': [28.2096, 83.9856],
    'Lalitpur': [27.6710, 85.3240],
    'Bhaktapur': [27.6710, 85.4298],
    'Biratnagar': [26.4525, 87.2718],
    'Bharatpur': [27.6833, 84.4333],
    'Butwal': [27.7006, 83.4484],
    'Birgunj': [27.0130, 84.8773],
    'Dharan': [26.8123, 87.2831],
    'Hetauda': [27.4267, 85.0333],
    'Janakpur': [26.7271, 85.9229],
    'Nepalgunj': [28.0500, 81.6167],
    'Banke': [28.0500, 81.6167],
    'Itahari': [26.6667, 87.2833],
};

interface MapProps {
    tenders: any[];
    height?: string;
    zoom?: number;
    showLegend?: boolean;
}

export const MapComponent: React.FC<MapProps> = ({ tenders, height = '400px', zoom = 6.2, showLegend = true }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const districtStats = useMemo(() => {
        const stats: Record<string, { count: number }> = {};
        tenders.forEach(t => {
            const rawDistrict = t.district || 'Unknown';
            // Normalize case so "pokhara" matches "Pokhara"
            const normalized = Object.keys(DISTRICT_COORDS).find(k => k.toLowerCase() === rawDistrict.toLowerCase()) || rawDistrict;
            if (!stats[normalized]) stats[normalized] = { count: 0 };
            stats[normalized].count += 1;
        });
        return stats;
    }, [tenders]);

    // Gather active coordinates to auto-pan
    const activeCoords = useMemo(() => {
        return Object.keys(districtStats)
            .map(d => DISTRICT_COORDS[d])
            .filter(Boolean);
    }, [districtStats]);


    if (!isMounted) return <div style={{ height }} className="bg-slate-100 animate-pulse rounded-[3rem]" />;

    return (
        <div className="relative w-full rounded-[3rem] overflow-hidden border shadow-inner bg-slate-50" 
             style={{ height, borderColor: 'rgba(226,232,240,0.8)' }}>
            <MapContainer 
                // @ts-ignore
                center={[28.3949, 84.1240]} 
                zoom={zoom} 
                className="h-full w-full z-10"
                scrollWheelZoom={false}
            >
                <TileLayer
                    // @ts-ignore
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LeafletAutoPan coords={activeCoords as any[]} zoom={zoom} />
                
                {Object.entries(districtStats).map(([district, data]) => {
                    const coords = DISTRICT_COORDS[district];
                    if (!coords) return null;

                    const isActive = data.count > 10;
                    const L = require('leaflet');

                    const blueIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    const redIcon = new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    return (
                        <Marker
                            key={district}
                            // @ts-ignore
                            position={coords}
                            icon={isActive ? redIcon : blueIcon}
                        >
                            <Popup>
                                <div className="p-1 min-w-[160px]">
                                    <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
                                        {isActive ? (
                                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#B93654' }} />
                                        ) : (
                                            <span className="w-2 h-2 rounded-full" style={{ background: '#0A3992' }} />
                                        )}
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">{district}</h3>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border" style={{ borderColor: 'rgba(226,232,240,0.6)' }}>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Tenders</span>
                                        <span className="text-lg font-black" style={{ color: isActive ? '#B93654' : '#0A3992' }}>{data.count}</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {showLegend && (
                <div className="absolute bottom-5 left-5 z-20 p-4 rounded-2xl shadow-lg border"
                     style={{ 
                         background: 'rgba(255,255,255,0.92)', 
                         backdropFilter: 'blur(16px)',
                         borderColor: 'rgba(226,232,240,0.7)',
                         boxShadow: '0 8px 32px -8px rgba(15,23,42,0.12)'
                     }}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Activity Legend</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <MapPin size={16} color="#0A3992" strokeWidth={3} className="drop-shadow-sm" />
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Standard Zone</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin size={16} color="#B93654" strokeWidth={3} className="drop-shadow-sm animate-pulse" />
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">High Activity</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
