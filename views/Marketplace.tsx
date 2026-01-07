
import React, { useState, useEffect } from 'react';
import { MOCK_JOBS, MOCK_CURRENT_USER } from '../constants';
import { Button } from '../components/Button';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Filter, 
  BrainCircuit, 
  CheckCircle, 
  Loader2,
  Briefcase,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  TrendingUp,
  X,
  Info,
  Globe,
  ExternalLink,
  Target,
  ArrowRight,
  Play // Added missing import
} from 'lucide-react';
import { getCompanyInsights } from '../geminiService';
import { AIAssessment } from '../components/AIAssessment';
import { AIInterviewer } from '../components/AIInterviewer';

export const Marketplace: React.FC<{ onDispatch: (data: any) => void }> = ({ onDispatch }) => {
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<{job: any, type: 'logic' | 'interview'} | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [researchCompany, setResearchCompany] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleDispatchComplete = (results: any) => {
    const job = activeChallenge?.job;
    if (!job) return;

    const dispatchData = {
      jobId: job.id,
      companyName: job.companyName,
      jobTitle: job.title,
      score: results.performance || results.interviewQualityScore || 0,
      type: activeChallenge.type,
      results
    };

    setAppliedJobIds(prev => [...prev, job.id]);
    setActiveChallenge(null);
    onDispatch(dispatchData);
    setNotification(`Neural Node Dispatched to ${job.companyName}`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleResearch = async (company: string) => {
    setIsResearching(true);
    try {
      const insights = await getCompanyInsights(company);
      setResearchCompany({ name: company, ...insights });
    } catch (e) {
      console.error(e);
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-2 px-2 relative pb-24 animate-in fade-in duration-700">
      {/* Active Challenge Modals */}
      {activeChallenge?.type === 'logic' && (
        <AIAssessment 
          onCancel={() => setActiveChallenge(null)} 
          onComplete={handleDispatchComplete}
        />
      )}
      {activeChallenge?.type === 'interview' && (
        <AIInterviewer 
          candidateName={MOCK_CURRENT_USER.name}
          resumeData={MOCK_CURRENT_USER.resumeData as any}
          onCancel={() => setActiveChallenge(null)}
          onComplete={handleDispatchComplete}
        />
      )}

      {/* Research Modal */}
      {researchCompany && (
        <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-indigo-50/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{researchCompany.name} Node Research</h3>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Grounded via Neural Search</p>
                </div>
              </div>
              <button onClick={() => setResearchCompany(null)} className="p-2 hover:bg-white rounded-xl text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{researchCompany.text}</p>
              </div>
              {researchCompany.sources?.length > 0 && (
                <div className="pt-8 border-t border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Verification Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {researchCompany.sources.map((chunk: any, i: number) => chunk.web && (
                      <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <ExternalLink size={12} /> {chunk.web.title || 'View Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Success Toast */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-[200] bg-white border-l-8 border-emerald-500 shadow-2xl rounded-3xl p-6 flex items-center gap-4 animate-in slide-in-from-right-10">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm font-black text-gray-900">{notification}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employer will review your neural compatibility</p>
          </div>
        </div>
      )}

      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Direct Node Dispatch</h1>
        <p className="text-gray-500 font-medium">Take specialized challenges and send your neural profile directly to top-tier hiring hubs.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {MOCK_JOBS.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            return (
              <div key={job.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                {isApplied && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center animate-in fade-in"><div className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle size={20} /> Application Indexed</div></div>}
                
                <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
                  <img src={job.companyLogo} className="w-20 h-20 rounded-3xl object-cover border-4 border-gray-50 shadow-md" alt={job.companyName} />
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{job.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-indigo-600">{job.companyName}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-xs text-gray-400 font-bold flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">{job.salary}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Annual Node Value</p>
                  </div>
                </div>

                <div className="bg-indigo-50/30 border border-indigo-100 p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><Target size={24} /></div>
                      <div>
                         <p className="text-sm font-black text-indigo-900">Company Neural Challenge</p>
                         <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Required potential index: {job.minPotentialScore}%</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleResearch(job.companyName)} className="text-indigo-600"><Info size={16} className="mr-2" /> Research</Button>
                      <Button variant="primary" size="sm" onClick={() => setActiveChallenge({ job, type: 'logic' })}><Zap size={16} className="mr-2 fill-white" /> Take Logic Challenge</Button>
                      <Button variant="secondary" size="sm" onClick={() => setActiveChallenge({ job, type: 'interview' })}><Play size={16} className="mr-2" /> Take Video Challenge</Button>
                   </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map(t => <span key={t} className="px-3 py-1.5 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-xl border border-gray-100">{t}</span>)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-gradient-primary p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-150"></div>
              <Cpu size={40} className="mb-6 opacity-60" />
              <h4 className="text-xl font-black mb-2">Automated Node Sharing</h4>
              <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium">When you complete a company challenge, your verified transcript and logic scores are instantly transmitted to the hiring managers neural dashboard.</p>
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs font-bold"><CheckCircle size={14} className="text-emerald-400" /> Instant Shortlisting</div>
                 <div className="flex items-center gap-2 text-xs font-bold"><CheckCircle size={14} className="text-emerald-400" /> No Static Resumes</div>
                 <div className="flex items-center gap-2 text-xs font-bold"><CheckCircle size={14} className="text-emerald-400" /> AI-Grounded Fit</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
