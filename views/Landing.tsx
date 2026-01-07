
import React from 'react';
import { Button } from '../components/Button';
import { ScoreCard } from '../components/ScoreCard';
import { MOCK_CURRENT_USER } from '../constants';
import { ArrowRight, CheckCircle, Globe, ShieldCheck, Cpu, BarChart3, BrainCircuit } from 'lucide-react';

interface LandingProps {
  onStart: (tab?: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#fcfcfd] overflow-x-hidden">
      <nav className="max-w-7xl mx-auto px-8 py-8 flex justify-between items-center relative z-10 animate-in fade-in slide-in-from-top duration-700">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 transition-transform group-hover:scale-110">
            <Cpu size={28} />
          </div>
          <span className="text-3xl font-black tracking-tighter text-gray-900">mini hr</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-widest text-gray-400">
          <button onClick={() => onStart('apm')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">
            <BarChart3 size={14} /> Neural APM
          </button>
          <button onClick={() => onStart('dashboard')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">
            <BrainCircuit size={14} /> Assessment Engine
          </button>
          <button onClick={() => onStart('feed')} className="hover:text-indigo-600 transition-colors flex items-center gap-2">
            <ShieldCheck size={14} /> Integrity Cloud
          </button>
        </div>
        <Button variant="secondary" size="sm" className="rounded-2xl px-8 shadow-sm" onClick={() => onStart('home')}>Sync Node</Button>
      </nav>

      <section className="max-w-7xl mx-auto px-8 pt-24 pb-32 grid lg:grid-cols-2 gap-24 items-center">
        <div className="animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50/50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-10 border border-indigo-100">
            <ShieldCheck size={16} />
            <span>AI-Verified Meritocracy Active</span>
          </div>
          <h1 className="text-7xl font-black text-gray-900 leading-[0.95] mb-10 tracking-tighter">
            Hire for <span className="text-gradient">Potential</span>, Not Performance.
          </h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-xl font-medium">
            mini hr uses adaptive logic simulations and neural interview analysis to map human growth velocity before you ever see a resume.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Button size="lg" className="rounded-3xl px-10 shadow-2xl shadow-indigo-500/20" onClick={() => onStart('dashboard')}>
              Go to Portal <ArrowRight className="ml-3" size={24} />
            </Button>
            <Button variant="outline" size="lg" className="rounded-3xl px-10 border-gray-200 text-gray-600" onClick={() => onStart('feed')}>Explore Network</Button>
          </div>

          <div className="mt-20 flex items-center gap-16">
            <StatItem label="Verified Nodes" value="128k+" />
            <StatItem label="Neural Partners" value="1,800+" />
            <StatItem label="Predictive Acc." value="98.2%" />
          </div>
        </div>

        <div className="relative animate-in fade-in slide-in-from-right duration-1000 delay-200">
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] opacity-60"></div>
          <div className="animate-float relative z-10">
            <ScoreCard scores={MOCK_CURRENT_USER.scores!} />
          </div>
          
          <div className="absolute top-12 -right-12 bg-white/90 backdrop-blur-md p-6 rounded-[32px] shadow-2xl flex items-center gap-4 border border-white animate-bounce-slow z-20">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <div>
              <div className="text-sm font-black text-gray-900">Integrity Score</div>
              <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">100% Verified</div>
            </div>
          </div>

          <div className="absolute -bottom-12 -left-12 bg-white/90 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white max-w-[240px] z-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Reasoning Node</span>
            </div>
            <p className="text-sm font-bold text-gray-700 leading-snug">
              "Candidate displays extreme strategic adaptability under high logic-load environments."
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(1deg); }
        }
        .animate-float { animation: float 8s infinite ease-in-out; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        .animate-bounce-slow { animation: bounce-slow 5s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

const StatItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="group cursor-default">
    <div className="text-4xl font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{value}</div>
    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</div>
  </div>
);
