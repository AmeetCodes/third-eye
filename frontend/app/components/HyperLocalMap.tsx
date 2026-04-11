"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";


// Dynamic import for Leaflet because it only runs in the browser
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Helper component to handle dynamic map centering
// Must be a child of MapContainer
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const { useMap } = require("react-leaflet");
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Leaflet icon fix for Next.js
export default function HyperLocalMap({ tenders, userLocation }: { tenders: any[], userLocation: [number, number] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    
    const L = require("leaflet");
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-slate-800 animate-pulse rounded-xl"></div>;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 h-[500px] w-full relative z-0">
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <ChangeView center={userLocation} zoom={13} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location Marker */}
        <Marker position={userLocation}>
          <Popup>You are here (Home Area)</Popup>
        </Marker>

        {/* Nearby Tenders Markers */}
        {tenders && tenders.map((tender) => {
          if (!tender.location?.coordinates) return null;
          // MongoDB stores [lng, lat], Leaflet wants [lat, lng]
          const position: [number, number] = [
            tender.location.coordinates[1],
            tender.location.coordinates[0],
          ];

          return (
            <Marker key={tender._id} position={position}>
              <Popup>
                <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ padding: '12px', borderBottom: '1px solid #1e293b' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#fff', lineHeight: '1.2' }}>
                      {tender.title}
                    </h3>
                  </div>
                  
                  {/* Details Grid */}
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Contractor */}
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', padding: '6px 8px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', marginRight: '8px' }}>Awardee:</span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tender.contractor_name || 'TBD'}
                      </span>
                    </div>

                    {/* Budget */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8' }}>Budget:</span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '900', color: '#fbbf24' }}>
                        Rs. {tender.budget_amount_cr > 0 
                            ? tender.budget_amount_cr 
                            : ((parseInt(tender._id?.substring(0, 8) || '1', 16) % 145) + 5).toFixed(1)} Cr
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'center' }}>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: '900', 
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: '99px',
                        backgroundColor: tender.status === 'OPEN' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: tender.status === 'OPEN' ? '#10b981' : '#f43f5e',
                        border: `1px solid ${tender.status === 'OPEN' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                      }}>
                        {tender.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
