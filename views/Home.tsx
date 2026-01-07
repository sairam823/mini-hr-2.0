
import React, { useState, useEffect } from 'react';
import { ScoreCard } from '../components/ScoreCard';
import { Button } from '../components/Button';
import { GoogleGenAI } from '@google/genai';
import { 
  Zap, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Briefcase,
  History,
  Loader2,
  BrainCircuit
} from 'lucide-react';

interface HomeProps {
  user: any;
  onAction: (action: 'assessment' | 'interview' | 'jobs') => void;
}

export const Home: React.FC<HomeProps> = ({ user, onAction }) => {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateBriefing = async () => {
      setIsGenerating(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Generate a one-sentence professional growth strategy for ${user.name} based on these potential metrics: Adaptability ${user.scores.adaptability}%, Learning Velocity ${user.scores.learning}%, Logic ${user.scores.performance}%. Tone: High-tech, encouraging, concise.`,
        });
        setBriefing(response.text || "Neural profile optimized. Recommended focus: Advanced systems orchestration.");
      } catch (e) {
        console.error("AI Error:", e);
      } finally {
        setIsGenerating(false);
      }
    };
    generateBriefing();
  }, [user.scores, user.name]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Welcome Hero */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-1 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100 mb-6">
              Executive Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              Focus, <span className="text-indigo-600">{user.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed max-w-xl">
              Platform metrics indicate optimal growth velocity. Review your strategic insights below.
            </p>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-600" size={16} />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Strategy Sync</span>
            </div>
            {isGenerating ? (
              <div className="flex items-center gap-3 text-indigo-400 text-sm font-medium">
                <Loader2 size={16} className="animate-spin" />
                <span>Generating high-fidelity insights...</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                "{briefing}"
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => onAction('jobs')} className="shadow-lg">
              Explore Matches <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => onAction('assessment')}>
              New Assessment
            </Button>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weekly Velocity</p>
              <div className="flex items-center justify-center gap-2 text-indigo-600">
                <TrendingUp size={24} />
                <span className="text-3xl font-black tracking-tighter">+120 pts</span>
              </div>
            </div>
            <div className="w-full h-px bg-slate-100"></div>
            <div className="grid grid-cols-2 gap-8">
               <StatBox label="Sessions" value="12" />
               <StatBox label="Ranking" value="Top 5%" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Score Overview */}
        <div className="lg:col-span-4">
          <ScoreCard scores={user.scores!} />
        </div>

        {/* Right: Quick Actions & Recent Activity */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Growth Nodes</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ready for sync</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <QuickActionCard 
              icon={<Zap size={24} className="text-indigo-600" />} 
              title="Logic Simulation"
              desc="Validate structural reasoning models."
              onClick={() => onAction('assessment')}
              color="indigo"
            />
            <QuickActionCard 
              icon={<Play size={24} className="text-indigo-600 fill-indigo-600" />} 
              title="Identity Sync"
              desc="Verified conversational interview with mini hr-01."
              onClick={() => onAction('interview')}
              color="indigo"
            />
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <History className="text-indigo-600" size={20} />
                 Recent Activity Logs
               </h3>
               <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
             </div>
             <div className="space-y-2">
               <ActivityRow icon={<CheckCircle2 size={16} />} title="System Architecture Proficiency Indexed" time="2h ago" type="skill" />
               <ActivityRow icon={<Briefcase size={16} />} title="Opportunity Dispatch: Stripe Global" time="1d ago" type="job" />
               <ActivityRow icon={<CheckCircle2 size={16} />} title="Frontend Excellence: 98th Percentile" time="3d ago" type="skill" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="text-center">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl font-black text-slate-900 tracking-tighter">{value}</p>
  </div>
);

const QuickActionCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, onClick: () => void, color: string }> = ({ icon, title, desc, onClick, color }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-5 text-left hover:border-indigo-200 hover:shadow-md transition-all group"
  >
    <div className={`w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </button>
);

const ActivityRow: React.FC<{ icon: React.ReactNode, title: string, time: string, type: string }> = ({ icon, title, time, type }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${type === 'skill' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{title}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{time}</p>
      </div>
    </div>
    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Details</button>
  </div>
);
