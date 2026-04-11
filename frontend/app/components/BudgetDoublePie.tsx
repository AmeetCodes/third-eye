'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PresentationControls, ContactShadows, Environment, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// Hardcoded data transcribed from the official FY 2081/82 image with hyper-vibrant neon tokens
const budgetData = [
  { name: 'Office of the PM', allocated: 559.17, spent: 458.52, color: '#888888', note: 'Cabinet operations, policy coordination' },
  { name: 'Ministry of Finance', allocated: 22286.06, spent: 19388.87, color: '#0044ff', note: 'Includes provincial & local fiscal transfers, debt servicing' },
  { name: 'Ministry of Industry', allocated: 928.22, spent: 631.19, color: '#ffaa00', note: 'SEZs, industrial zones, trade facilitation' },
  { name: 'Ministry of Energy', allocated: 8755.99, spent: 5428.71, color: '#00ddff', note: 'Hydropower, irrigation, transmission lines' },
  { name: 'Ministry of Law', allocated: 54.53, spent: 45.26, color: '#6600ff', note: 'Legal reform, court infrastructure' },
  { name: 'Ministry of Agriculture', allocated: 5729.05, spent: 4296.79, color: '#77ff00', note: 'Fertilizer subsidy, PMAMP, crop insurance' },
  { name: 'Ministry of Water', allocated: 2663.47, spent: 1731.26, color: '#0088ff', note: 'Melamchi, rural water supply, WASH' },
  { name: 'Ministry of Home Affairs', allocated: 19924.34, spent: 17533.42, color: '#ff0033', note: 'Police, civil administration, disaster mgmt' },
  { name: 'Ministry of Tourism', allocated: 1191.15, spent: 774.25, color: '#ff0066', note: 'TIA expansion, trekking, civil aviation' },
  { name: 'Foreign Affairs', allocated: 677.42, spent: 596.13, color: '#cc00ff', note: 'Embassies, consulates, foreign aid' },
  { name: 'Ministry of Forests', allocated: 1570.91, spent: 1131.06, color: '#00ff44', note: 'Chure conservation, carbon trading, forest mgmt' },
  { name: 'Land Management', allocated: 682.62, spent: 477.83, color: '#aabbaa', note: 'Land reform, cooperatives, poverty programs' },
  { name: 'Physical Infrastructure', allocated: 15053.21, spent: 9483.52, color: '#4400ff', note: 'Roads, bridges, expressways, highways' },
  { name: 'Women & Children', allocated: 160.45, spent: 134.78, color: '#ff6688', note: 'Child protection, senior citizen welfare' },
  { name: 'Youth & Sports', allocated: 350.48, spent: 252.35, color: '#00ffaa', note: 'Sports infrastructure, youth programs' },
  { name: 'Ministry of Defense', allocated: 5987.14, spent: 5448.30, color: '#994400', note: 'Nepal Army operations, infrastructure' },
  { name: 'Urban Development', allocated: 9263.54, spent: 6206.57, color: '#00bbff', note: 'Urban infrastructure, housing, settlement' },
  { name: 'Ministry of Education', allocated: 20366.20, spent: 17514.93, color: '#ff7700', note: 'Schools, universities, mid-day meals, scholarships' },
  { name: 'Info & Communications', allocated: 735.29, spent: 522.06, color: '#bb00ff', note: 'Digital Nepal Framework, IT parks' },
  { name: 'Federal Affairs', allocated: 917.14, spent: 752.05, color: '#667788', note: 'Civil service, federal coordination' },
  { name: 'Ministry of Health', allocated: 8623.89, spent: 7244.07, color: '#ff0022', note: 'Health insurance, hospitals, free medicines' },
  { name: 'Labor & Employment', allocated: 809.97, spent: 664.18, color: '#ff4400', note: 'PM Employment Program, social security fund' },
  { name: 'Others (Constitutions)', allocated: 58740.06, spent: 48166.85, color: '#445566', note: 'Social security allowances, grants to 753 local govts' },
];

const TOTAL_ALLOCATED = 186030.30;
const TOTAL_SPENT = 148882.95;

// Helper to draw a single 3D wedge
function PieSlice({ 
  entry, 
  thetaStart, 
  thetaLength, 
  radius, 
  height, 
  isActive, 
  isSpentChart,
  onClick, 
  onPointerEnter, 
  onPointerLeave 
}: any) {
  const midAngle = thetaStart + thetaLength / 2;
  const extrudeAmount = isActive ? 1.0 : 0;
  
  const x = Math.sin(midAngle) * extrudeAmount;
  const z = Math.cos(midAngle) * extrudeAmount;

  // Vibrant Cool Palette for Expenditure Chart to ensure no collisions
  const SPENT_COLORS = [
    '#0ea5e9', // Sky
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#3b82f6', // blue
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#14b8a6', // Teal
    '#4f46e5', // Royal
    '#2dd4bf', // Aquamarine
    '#0284c7', // Deep Sky
    '#9333ea', // Purple
  ];

  const index = entry.index || 0;
  let baseColor = isSpentChart 
    ? new THREE.Color(SPENT_COLORS[index % SPENT_COLORS.length])
    : new THREE.Color(entry.color);

  if (isActive) baseColor.lerp(new THREE.Color(0xffffff), 0.2);

  const percentage = (thetaLength / (Math.PI * 2)) * 100;
  const showLabel = percentage >= 2.0;

  // Push lines outward cleanly
  const extension = isActive ? 1.4 : 1.1;
  const edgeX = Math.sin(midAngle) * radius;
  const edgeZ = Math.cos(midAngle) * radius;
  const labelX = Math.sin(midAngle) * (radius * extension + 1.5);
  const labelZ = Math.cos(midAngle) * (radius * extension + 1.5);

  return (
    <group position={[x, isActive ? Math.max(0.4, height * 0.1) : 0, z]}>
      <mesh 
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <cylinderGeometry args={[radius, radius, height, 48, 1, false, thetaStart, thetaLength]} />
        <meshStandardMaterial 
          color={baseColor} 
          roughness={0.6} 
          metalness={0.1}
          emissive={baseColor}
          emissiveIntensity={isSpentChart ? 0.2 : 0.1}
        />
      </mesh>

      {showLabel && (
          <group>
              <Line 
                  points={[
                      [edgeX * 0.8, height/2, edgeZ * 0.8], 
                      [edgeX, height/2 + 0.5, edgeZ], 
                      [labelX, height/2 + 0.8, labelZ]
                  ]} 
                  color={isSpentChart ? "#0369a1" : "#1e293b"} 
                  lineWidth={1.5} 
              />
              <Html position={[labelX, height/2 + 0.8, labelZ]} center className="pointer-events-none z-10">
                  <div className="flex flex-col items-center">
                      <div 
                        className="px-2.5 py-1 whitespace-nowrap bg-white text-[11px] font-black uppercase tracking-wider shadow-md rounded border-b-[3px]"
                        style={{ 
                            color: isSpentChart ? "#0369a1" : entry.color, 
                            borderColor: isSpentChart ? "#0369a1" : entry.color 
                        }}
                      >
                          {entry.name}
                      </div>
                      <div className="text-[12px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 mt-0.5 rounded shadow-sm opacity-90">
                          {percentage.toFixed(1)}%
                      </div>
                  </div>
              </Html>
          </group>
      )}
    </group>
  );
}

// 3D Pie Chart WebGL Sub-Component
function Chart3D({ dataKey, activeIndex, setActiveIndex, onSelectSlice, isSpentChart = false }: any) {
  // Precalculate geometries
  const slices = useMemo(() => {
    let currentAngle = 0;
    const total = budgetData.reduce((sum, d: any) => sum + d[dataKey], 0);

    return budgetData.map((d: any, i) => {
      const thetaLength = (d[dataKey] / total) * Math.PI * 2;
      const thetaStart = currentAngle;
      currentAngle += thetaLength;
      
      const utilization = Math.min((d.spent / d.allocated) || 0, 1.0);
      const visualHeight = isSpentChart ? (2.0 * utilization + 0.2) : 2.5; // Slightly taller base for visibility

      return { ...d, thetaStart, thetaLength, visualHeight, index: i };
    });
  }, [dataKey, isSpentChart]);

  return (
    <group rotation={[Math.PI / 6, 0, 0]}>
      {slices.map((slice) => (
        <PieSlice 
          key={slice.name}
          entry={slice}
          thetaStart={slice.thetaStart}
          thetaLength={slice.thetaLength}
          radius={5.5}
          height={slice.visualHeight}
          isActive={activeIndex === slice.index}
          isSpentChart={isSpentChart}
          onClick={(e: any) => {
            e.stopPropagation();
            onSelectSlice(slice);
            setActiveIndex(slice.index);
          }}
          onPointerEnter={(e: any) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            setActiveIndex(slice.index);
          }}
          onPointerLeave={(e: any) => {
            e.stopPropagation();
            document.body.style.cursor = 'default';
            setActiveIndex(null);
          }}
        />
      ))}
      <ContactShadows position={[0, -1.0, 0]} opacity={0.6} scale={22} blur={2.0} far={4} color="#000000" />
    </group>
  );
}


export function BudgetDoublePie() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<any | null>(null);

  return (
    <div className="w-full flex-col flex lg:flex-row gap-8 lg:gap-14 relative">
      {/* ── Active Info Panel (Glassmorphism Overlay based on Clicks) ── */}
      <AnimatePresence>
        {selectedSlice && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
            className="absolute -top-6 left-1/2 z-50 w-[90%] md:w-[600px] p-6 rounded-3xl text-white shadow-2xl border"
            style={{ 
                background: 'rgba(15,23,42,0.95)', 
                backdropFilter: 'blur(20px)',
                borderColor: selectedSlice.color,
                boxShadow: `0 24px 60px -12px ${selectedSlice.color}88`
            }}
          >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full" style={{ background: selectedSlice.color }} />
                    <h4 className="text-xl font-black">{selectedSlice.name}</h4>
                </div>
                <button 
                    onClick={() => { setSelectedSlice(null); setActiveIndex(null); }}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                >
                    ✕
                </button>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 mb-4">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">What does this money buy?</p>
                <p className="text-lg font-medium tracking-tight text-slate-200">
                    "{selectedSlice.note}"
                </p>
            </div>

            <div className="flex gap-10">
                <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Allocated Goal</span>
                    <p className="text-xl font-black">Rs. {new Intl.NumberFormat('en-IN').format(selectedSlice.allocated)} Cr</p>
                </div>
                <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Actually Spent</span>
                    <p className="text-xl font-black text-sky-400">Rs. {new Intl.NumberFormat('en-IN').format(selectedSlice.spent)} Cr</p>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WebGL Allocated Budget Chart ── */}
      <div className="flex-1 bg-white p-6 lg:p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group min-h-[550px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="relative z-10 mb-6 flex justify-between items-start pointer-events-none">
            <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-800" /> Allocated Budget
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">FY 2081/82 Goal Limits</p>
            </div>
            <div className="text-right">
                <span className="text-slate-900 font-black text-xl tracking-tighter">Rs. {new Intl.NumberFormat('en-IN').format(TOTAL_ALLOCATED)}</span>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Crores</p>
            </div>
        </div>

        {/* 3D Context Boundary */}
        <div className="absolute inset-0 top-24 z-0">
            <Canvas camera={{ position: [0, 10, 16], fov: 45 }} shadows>
                <ambientLight intensity={1.5} color="#ffffff" />
                <directionalLight position={[10, 20, 10]} intensity={3.5} castShadow color="#ffffff" />
                <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#e2e8f0" />
                <Environment preset="city" />
                <PresentationControls 
                    global={false} 
                    rotation={[0, 0, 0]} 
                    polar={[-Math.PI / 4, Math.PI / 4]} 
                    azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                    <Chart3D 
                        dataKey="allocated" 
                        isSpentChart={false}
                        activeIndex={activeIndex} 
                        setActiveIndex={setActiveIndex} 
                        onSelectSlice={setSelectedSlice} 
                    />
                </PresentationControls>
            </Canvas>
        </div>
      </div>

      {/* ── WebGL Actual Expenditure Chart ── */}
      <div className="flex-1 bg-white p-6 lg:p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group min-h-[550px]">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 mb-6 flex justify-between items-start pointer-events-none">
            <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#0A3992]" /> Actual Expenditure
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Estimated Tax Utilization</p>
            </div>
            <div className="text-right">
                <span className="text-[#0A3992] font-black text-xl tracking-tighter">Rs. {new Intl.NumberFormat('en-IN').format(TOTAL_SPENT)}</span>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 font-bold">Total Crores (80% Util.)</p>
            </div>
        </div>

        {/* 3D Context Boundary */}
        <div className="absolute inset-0 top-24 z-0">
            <Canvas camera={{ position: [0, 10, 16], fov: 45 }} shadows>
                <ambientLight intensity={1.5} color="#ffffff" />
                <directionalLight position={[10, 20, 10]} intensity={3.5} castShadow color="#ffffff" />
                <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#e2e8f0" />
                <Environment preset="city" />
                <PresentationControls 
                    global={false} 
                    rotation={[0, 0, 0]} 
                    polar={[-Math.PI / 4, Math.PI / 4]} 
                    azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                    <Chart3D 
                        dataKey="spent" 
                        isSpentChart={true}
                        activeIndex={activeIndex} 
                        setActiveIndex={setActiveIndex} 
                        onSelectSlice={setSelectedSlice} 
                    />
                </PresentationControls>
            </Canvas>
        </div>
      </div>
    </div>
  );
}
