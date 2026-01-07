
import React, { useEffect, useState } from 'react';
import { PotentialScores } from '../types';
import { Shield, Zap, BookOpen, Repeat, Eye, BrainCircuit, Sparkles } from 'lucide-react';

interface ScoreCardProps {
  scores: PotentialScores;
  title?: string;
  variant?: 'large' | 'compact';
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ scores, title = "Neural Performance Index", variant = 'large' }) => {
  const [offset, setOffset] = useState(502.6);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const targetOffset = circumference - (circumference * scores.potential) / 100;
    setOffset(targetOffset);
  }, [scores.potential, circumference]);

  const isLarge = variant === 'large';

  return (
    <div className={`bg-white ${isLarge ? 'p-8 rounded-3xl' : 'p-6 rounded-2xl'} border border-slate-100 flex flex-col items-center relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow`}>
      {/* Subtle Background Neural Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="flex items-center gap-2 mb-8 relative z-10">
        <BrainCircuit size={14} className="text-indigo-600" />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      
      <div className="relative mb-10 group cursor-default z-10">
        {/* Subtler Core Glass Effect */}
        <div className={`absolute inset-6 rounded-full bg-slate-50 border border-slate-100 z-10 flex flex-col items-center justify-center shadow-inner`}>
           <div className="relative z-20 flex flex-col items-center">
             <div className="relative">
                <span className={`${isLarge ? 'text-6xl' : 'text-4xl'} font-black text-slate-900 tracking-tighter leading-none`}>
                  {scores.potential}
                </span>
             </div>
             <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-2 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
               Core Score
             </span>
           </div>
        </div>

        <svg className={`${isLarge ? 'w-64 h-64' : 'w-48 h-48'} transform -rotate-90 relative z-0`}>
          <circle
            cx={isLarge ? "128" : "96"}
            cy={isLarge ? "128" : "96"}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="transparent"
          />
          
          <circle
            cx={isLarge ? "128" : "96"}
            cy={isLarge ? "128" : "96"}
            r={radius}
            stroke="url(#professional-gradient)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="professional-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>

        {/* Minimalist Tech Orbitals */}
        <div className="absolute inset-[-10px] border border-slate-100 rounded-full animate-spin-slow opacity-20"></div>
      </div>

      <div className={`grid ${isLarge ? 'grid-cols-2' : 'grid-cols-1'} gap-3 w-full relative z-10`}>
        <MetricBadge icon={<Zap size={12} />} label="Logic" value={scores.performance} color="blue" />
        <MetricBadge icon={<BookOpen size={12} />} label="Learning" value={scores.learning} color="purple" />
        <MetricBadge icon={<Repeat size={12} />} label="Agility" value={scores.adaptability} color="indigo" />
        <MetricBadge icon={<Shield size={12} />} label="Reliability" value={scores.trust} color="emerald" />
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
      `}</style>
    </div>
  );
};

interface MetricBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  className?: string;
}

const MetricBadge: React.FC<MetricBadgeProps> = ({ icon, label, value, color, className = "" }) => {
  const colors: Record<string, string> = {
    blue: "text-blue-700 bg-blue-50/50 border-blue-100",
    purple: "text-purple-700 bg-purple-50/50 border-purple-100",
    indigo: "text-indigo-700 bg-indigo-50/50 border-indigo-100",
    emerald: "text-emerald-700 bg-emerald-50/50 border-emerald-100"
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${colors[color]} transition-colors hover:bg-white cursor-default ${className}`}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-white shadow-sm shrink-0">
          {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">{label}</span>
      </div>
      <span className="text-xs font-black tracking-tight">{value}%</span>
    </div>
  );
};
