
import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, HistoryItem } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { Button } from '../components/Button';
import { AIAssessment } from '../components/AIAssessment';
import { AIInterviewer } from '../components/AIInterviewer';
import { 
  History, 
  CheckCircle, 
  Send,
  Zap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Camera,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

interface CandidateDashboardProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onDispatch?: (data: any) => void;
}

const HistoryRow: React.FC<{ 
  data: HistoryItem; 
  index: number; 
  expanded: boolean; 
  onToggle: () => void; 
  isInterview: boolean; 
  onShare: () => void; 
}> = ({ data, expanded, onToggle, isInterview }) => (
  <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="p-6 flex items-center justify-between cursor-pointer" onClick={onToggle}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isInterview ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
          {isInterview ? <MessageSquare size={18} /> : <Zap size={18} />}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{data.label}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{data.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-lg font-black text-gray-900">{data.score}%</p>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Score</p>
        </div>
        {expanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </div>
    </div>
    {expanded && (
      <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/30">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{data.notes}</p>
        {data.transcripts && data.transcripts.length > 0 && (
          <div className="space-y-2 mt-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transcript Snippets</p>
            {data.transcripts.map((t, i) => (
              <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 text-xs text-gray-500 italic">
                "{t}"
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ user, onUpdateUser, onDispatch }) => {
  const [historyTab, setHistoryTab] = useState<'logic' | 'interview' | 'sent'>('logic');
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<'logic' | 'interview' | null>(null);

  const appliedHistory = user.appliedHistory || [];

  const filteredHistory = useMemo(() => {
    if (historyTab === 'logic') return user.attemptHistory || [];
    if (historyTab === 'interview') return user.interviewHistory || [];
    return [];
  }, [user, historyTab]);

  const handleLogicComplete = (results: any) => {
    if (onDispatch) {
      onDispatch({
        type: 'logic',
        score: results.performance,
        companyName: 'General Self-Assessment',
        jobTitle: 'Logic Protocol #'+((user.attemptHistory?.length || 0) + 1),
        results
      });
    }
    setActiveModule(null);
  };

  const handleInterviewComplete = (results: any) => {
    if (onDispatch) {
      onDispatch({
        type: 'interview',
        score: results.interviewQualityScore,
        companyName: 'General Self-Assessment',
        jobTitle: 'Interview Protocol #'+((user.interviewHistory?.length || 0) + 1),
        results
      });
    }
    setActiveModule(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-2 px-2 relative animate-in fade-in duration-700 pb-24">
      {/* Module Overlays */}
      {activeModule === 'logic' && (
        <AIAssessment onCancel={() => setActiveModule(null)} onComplete={handleLogicComplete} />
      )}
      {activeModule === 'interview' && (
        <AIInterviewer 
          candidateName={user.name} 
          resumeData={user.resumeData} 
          onCancel={() => setActiveModule(null)} 
          onComplete={handleInterviewComplete} 
        />
      )}

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 text-center relative overflow-hidden">
             <div className="relative inline-block mb-6 group cursor-pointer">
               <img src={user.avatar} className="w-32 h-32 rounded-[40px] object-cover border-8 border-gray-50 shadow-xl transition-transform group-hover:scale-105" alt={user.name} />
               <div className="absolute inset-0 bg-indigo-600/20 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Camera size={24} className="text-white" />
               </div>
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-1">{user.name}</h2>
             <p className="text-indigo-600 font-bold text-sm mb-6">{user.headline}</p>
             <div className="flex justify-center gap-8 border-t border-gray-50 pt-6">
                <div>
                   <p className="text-lg font-black text-gray-900">{user.connections}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nodes</p>
                </div>
                <div className="w-px h-8 bg-gray-100"></div>
                <div>
                   <p className="text-lg font-black text-gray-900">{user.following}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Following</p>
                </div>
             </div>
          </div>
          <ScoreCard scores={user.scores!} />
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
             <div className="bg-gradient-primary p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <BrainCircuit size={40} className="mb-6 opacity-60" />
                <h4 className="text-xl font-black mb-2">Logic Assessment</h4>
                <p className="text-white/70 text-sm mb-6">Complete a normal exam to measure your logical growth velocity.</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="!bg-white !text-indigo-900 font-black w-full"
                  onClick={() => setActiveModule('logic')}
                >
                  Start Normal Exam <ArrowRight size={16} className="ml-2" />
                </Button>
             </div>
             <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                <MessageSquare size={40} className="mb-6 text-indigo-100" />
                <h4 className="text-xl font-black text-gray-900 mb-2">AI Agent Interview</h4>
                <p className="text-gray-400 text-sm mb-6">Listen to and talk with the AI agent to verify soft skills.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="font-black w-full"
                  onClick={() => setActiveModule('interview')}
                >
                  Talk with Agent <ArrowRight size={16} className="ml-2" />
                </Button>
             </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-4"><History className="text-indigo-600" /> Node History</h3>
              <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-2 overflow-x-auto">
                <button onClick={() => setHistoryTab('logic')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${historyTab === 'logic' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400'}`}>Logic Exam</button>
                <button onClick={() => setHistoryTab('interview')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${historyTab === 'interview' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400'}`}>AI Conversations</button>
                <button onClick={() => setHistoryTab('sent')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${historyTab === 'sent' ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-400'}`}>Sent Dispatches</button>
              </div>
            </div>

            <div className="space-y-4">
              {historyTab === 'sent' ? (
                appliedHistory.length === 0 ? (
                  <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-[32px] text-gray-400 font-bold flex flex-col items-center gap-4">
                     <Send size={40} className="opacity-20" />
                     <p>No active node dispatches to companies.</p>
                  </div>
                ) : (
                  appliedHistory.map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-emerald-50/30 rounded-[28px] border border-emerald-100/50">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
                             <CheckCircle size={20} />
                          </div>
                          <div>
                             <p className="font-bold text-gray-900 text-sm">{app.jobTitle}</p>
                             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{app.companyName} Hub • Indexed {app.timestamp}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black text-gray-900">{app.scoreSent}%</p>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md">Status: {app.status}</span>
                       </div>
                    </div>
                  ))
                )
              ) : (
                filteredHistory.map((a: HistoryItem, i: number) => (
                   <HistoryRow 
                    key={a.id || i} 
                    data={a} 
                    index={i} 
                    expanded={expandedAttempt === (a.id || i.toString())} 
                    onToggle={() => setExpandedAttempt(expandedAttempt === (a.id || i.toString()) ? null : (a.id || i.toString()))} 
                    isInterview={historyTab === 'interview'} 
                    onShare={() => {}} 
                   />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
