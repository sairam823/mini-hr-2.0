
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './Button';
import { BrainCircuit, Clock, ShieldAlert, CheckCircle2, Loader2, Zap, ArrowRight, AlertTriangle, ShieldX, Target, XCircle, Shield, Camera, Eye } from 'lucide-react';
import { generateAssessmentQuestions } from '../geminiService';

interface AIAssessmentProps {
  onComplete: (results: any) => void;
  onCancel: () => void;
}

export const AIAssessment: React.FC<AIAssessmentProps> = ({ onComplete, onCancel }) => {
  const [status, setStatus] = useState<'setup' | 'testing' | 'submitting' | 'failed'>('setup');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [trustScore, setTrustScore] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreFetching, setIsPreFetching] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [livePerformance, setLivePerformance] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const qStartTime = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const preFetchedQuestions = useRef<any[] | null>(null);

  // Pre-fetch questions as soon as the setup screen is mounted to eliminate start-time latency
  useEffect(() => {
    const preFetch = async () => {
      try {
        const qs = await generateAssessmentQuestions('Neural Logic');
        preFetchedQuestions.current = qs;
      } catch (e) {
        console.error("Failed to pre-fetch questions:", e);
      } finally {
        setIsPreFetching(false);
      }
    };
    preFetch();
  }, []);

  const logViolation = useCallback((msg: string, penalty: number) => {
    setTrustScore(prev => {
      const next = Math.max(0, prev - penalty);
      if (next <= 20) {
        setStatus('failed');
        setTimeout(onCancel, 4000);
      }
      return next;
    });
    setAlert(msg);
    setTimeout(() => setAlert(null), 3000);
  }, [onCancel]);

  useEffect(() => {
    if (status === 'testing') {
      const handleBlur = () => logViolation("Focus Lost: Background Task Detected", 30);
      const handleVisibility = () => { if (document.hidden) logViolation("Tab Desync: Unauthorized Navigation", 50); };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey || e.metaKey || e.key === 'Tab') {
          e.preventDefault();
          logViolation("Keyboard Intrusion: System Override Blocked", 20);
        }
      };

      window.addEventListener('blur', handleBlur);
      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('blur', handleBlur);
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [status, logViolation]);

  const startTest = async () => {
    setIsProcessing(true);
    try {
      // Hardware and Questions initialization in parallel
      const streamPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // If questions aren't pre-fetched yet, wait for them
      if (!preFetchedQuestions.current) {
        const qs = await generateAssessmentQuestions('Neural Logic');
        preFetchedQuestions.current = qs;
      }

      const stream = await streamPromise;
      streamRef.current = stream;
      
      setQuestions(preFetchedQuestions.current!);
      qStartTime.current = Date.now();
      setStatus('testing');
      
      // Delay setting video source until state has changed to 'testing'
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);

    } catch (e) { 
      console.error(e); 
      setAlert("Hardware Access Denied: Camera/Mic required.");
    } finally { 
      setIsProcessing(false); 
    }
  };

  const handleSelect = (idx: number) => {
    if (feedback !== null) return;
    
    const elapsed = (Date.now() - qStartTime.current) / 1000;
    const isCorrect = idx === questions[currentIdx].correctIndex;
    
    if (isCorrect) {
      setFeedback('correct');
      setLivePerformance(prev => Math.min(100, prev + (100 / questions.length)));
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      const newTimes = [...timePerQuestion, elapsed];
      const newAnswers = [...answers, idx];

      if (currentIdx < questions.length - 1) {
        setAnswers(newAnswers);
        setTimePerQuestion(newTimes);
        setCurrentIdx(prev => prev + 1);
        qStartTime.current = Date.now();
      } else {
        finishTest(newAnswers, newTimes);
      }
    }, 800);
  };

  const finishTest = (finalAnswers: number[], times: number[]) => {
    setStatus('submitting');
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    setTimeout(() => {
      const correctCount = finalAnswers.filter((ans, idx) => ans === questions[idx].correctIndex).length;
      const performance = Math.round((correctCount / questions.length) * 100);
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      onComplete({ performance, learningVelocity: performance, adaptability: avgTime < 15 ? 95 : 75, trustScore });
    }, 1500);
  };

  useEffect(() => {
      return () => {
          if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
          }
      };
  }, []);

  if (status === 'setup') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
        <div className="w-24 h-24 bg-indigo-50 rounded-[40px] flex items-center justify-center text-indigo-600 mb-10 border border-indigo-100 shadow-inner">
          <BrainCircuit size={48} className="animate-pulse" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Logic Lockdown Protocol</h2>
        <p className="text-gray-500 max-w-md mb-12 leading-relaxed font-medium">
          Adaptive simulation session initiated. Your camera and microphone will be active to ensure neural integrity. <br/>
          <span className="text-indigo-600 font-bold">Penalty: Tab switches result in immediate session scrubbing.</span>
        </p>
        <div className="flex gap-4 w-full max-w-md">
          <Button variant="outline" fullWidth onClick={onCancel}>Abort</Button>
          <Button 
            fullWidth 
            onClick={startTest} 
            disabled={isProcessing}
            className="relative"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : "Enter Lockdown"}
            {!isProcessing && isPreFetching && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
            )}
          </Button>
        </div>
        {isPreFetching && (
          <p className="mt-6 text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
            Neural Handshake in progress...
          </p>
        )}
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="fixed inset-0 z-[120] bg-rose-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl animate-bounce">
          <ShieldX size={48} />
        </div>
        <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Identity Scrubbed</h2>
        <p className="text-rose-200 text-lg font-bold uppercase tracking-widest max-w-sm">Critical violation. Data discarded.</p>
      </div>
    );
  }

  if (status === 'submitting') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center">
        <Loader2 size={48} className="text-indigo-600 animate-spin mb-8" />
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Syncing Node Metrics</h2>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col lg:flex-row items-center justify-center p-6 gap-6">
      {alert && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[150] bg-rose-600 text-white px-10 py-5 rounded-[24px] shadow-2xl border-4 border-rose-400 flex items-center gap-5 animate-in slide-in-from-top-4">
          <AlertTriangle size={24} className="animate-pulse" />
          <span className="text-lg font-black uppercase tracking-tighter">{alert}</span>
        </div>
      )}

      {/* Marks Indicator */}
      {feedback && (
        <div className={`fixed top-32 left-1/2 -translate-x-1/2 z-[110] px-10 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 animate-in zoom-in ${feedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
           {feedback === 'correct' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
           <span className="text-2xl font-black uppercase tracking-widest">{feedback === 'correct' ? '+25 MARKS' : '0 MARKS'}</span>
        </div>
      )}

      {/* Main Test Area */}
      <div className="flex-1 w-full max-w-4xl bg-white rounded-[60px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col h-[85vh] relative">
        <header className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white shadow-xl">
               <Target size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-xl tracking-tight">Question {currentIdx + 1} / {questions.length}</h3>
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Focus Tracking: Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-[24px] border border-gray-100">
            <div className="text-center">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Merit</p>
              <p className="text-xl font-black text-indigo-600">{Math.round(livePerformance)}%</p>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Integrity</p>
              <p className={`text-xl font-black ${trustScore > 60 ? 'text-emerald-500' : 'text-rose-600'}`}>{trustScore}%</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-amber-50 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-amber-100">
               <Zap size={14} className="fill-amber-600" /> Neural Challenge Node
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-10 leading-[1.2] tracking-tighter">
              {currentQ?.text}
            </h2>
            <div className="grid gap-4">
              {currentQ?.options.map((option: string, i: number) => (
                <button
                  key={i}
                  disabled={feedback !== null}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left p-6 bg-white border-2 rounded-[24px] transition-all group relative overflow-hidden active:scale-[0.98] ${
                    feedback === null ? 'hover:bg-indigo-50/50 border-gray-100 hover:border-indigo-400' : 
                    i === currentQ.correctIndex ? 'border-emerald-500 bg-emerald-50' : 
                    answers[currentIdx] === i ? 'border-rose-500 bg-rose-50' : 'border-gray-50 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-bold text-gray-700 text-lg group-hover:text-indigo-900 transition-colors">{option}</span>
                    <ArrowRight size={20} className="text-gray-200 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Camera Sidebar (Guardian Feed) */}
      <aside className="w-full lg:w-72 h-[85vh] flex flex-col gap-6">
        <div className="bg-gray-950 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl flex-1 relative">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover scale-x-[-1]" 
            />
            <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none"></div>
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
               <Camera size={14} className="text-indigo-400" />
               <span className="text-[9px] font-black text-white uppercase tracking-widest">Guardian Feed</span>
            </div>
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-500/20">
               <Eye size={14} className="text-emerald-400" />
               <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Session Verified</span>
            </div>
        </div>
        
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Verification Node</p>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-600">Gaze Lock</span>
                 <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-gray-600">Audio Stream</span>
                 <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                 <div className="h-full bg-indigo-500 animate-pulse w-full"></div>
              </div>
           </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
};
