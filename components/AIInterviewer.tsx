
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './Button';
import { 
  ShieldCheck, 
  Loader2, 
  BrainCircuit, 
  ShieldX,
  Activity,
  Sparkles,
  PhoneOff,
  Mic,
  Video,
  Eye,
  Scan,
  Zap,
  Quote,
  AlertCircle
} from 'lucide-react';
import { connectToLiveRecruiter, evaluateInterview } from '../geminiService';
import { ResumeData } from '../types';

interface AIInterviewerProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  candidateName: string;
  resumeData?: ResumeData;
}

export const AIInterviewer: React.FC<AIInterviewerProps> = ({ onComplete, onCancel, candidateName, resumeData }) => {
  const [status, setStatus] = useState<'setup' | 'connecting' | 'talking' | 'analyzing' | 'terminated'>('setup');
  const [trustScore, setTrustScore] = useState(100);
  const [transcripts, setTranscripts] = useState<{user: string, ai: string}[]>([]);
  const [currentUserText, setCurrentUserText] = useState("");
  const [currentAIText, setCurrentAIText] = useState("");
  const [micLevel, setMicLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const sessionPromise = useRef<Promise<any> | null>(null);
  const audioContexts = useRef<{ input: AudioContext } | null>(null);
  const frameInterval = useRef<number | null>(null);

  // Helper Functions for Audio PCM Encoding
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const cleanup = () => {
    if (frameInterval.current) clearInterval(frameInterval.current);
    if (audioContexts.current) {
        audioContexts.current.input.close().catch(() => {});
        audioContexts.current = null;
    }
  };

  const startLiveSession = async () => {
    cleanup();
    setErrorMessage(null);
    setStatus('connecting');

    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    await inputCtx.resume();
    audioContexts.current = { input: inputCtx };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const systemInstruction = `You are mini-hr-01, a professional AI recruiter. 
        Candidate: ${candidateName}. 
        Resume: ${JSON.stringify(resumeData)}.
        Conduct a focused 5-minute interview. Introduce yourself, ask about experience, and then a behavior question. 
        IMPORTANT: Communicate via text transcription. If finished, say "SESSION_COMPLETE".`;

      sessionPromise.current = connectToLiveRecruiter({
        systemInstruction,
        callbacks: {
          onopen: () => {
            setStatus('talking');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += Math.abs(inputData[i]);
              setMicLevel(sum / inputData.length);
              
              sessionPromise.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            frameInterval.current = window.setInterval(() => {
              if (!videoRef.current || status !== 'talking') return;
              const canvas = canvasRef.current;
              canvas.width = videoRef.current.videoWidth || 640;
              canvas.height = videoRef.current.videoHeight || 480;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64Data = (reader.result as string).split(',')[1];
                    sessionPromise.current?.then(session => session.sendRealtimeInput({
                      media: { data: base64Data, mimeType: 'image/jpeg' }
                    }));
                  };
                  reader.readAsDataURL(blob);
                }
              }, 'image/jpeg', 0.5);
            }, 2000);
          },
          onmessage: async (message: any) => {
            // Audio output from the model is ignored here as requested to remove voice over
            
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setCurrentAIText(prev => prev + text);
            }
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setCurrentUserText(prev => prev + text);
            }

            if (message.serverContent?.turnComplete) {
              setTranscripts(prev => [...prev, { user: currentUserText, ai: currentAIText }]);
              if (currentAIText.includes("SESSION_COMPLETE")) {
                handleComplete();
              }
              setCurrentUserText("");
              setCurrentAIText("");
            }
          },
          onerror: (e: any) => {
            console.error("Live Error", e);
            setErrorMessage(e?.message || "Connection failed. Please verify your network.");
            setStatus('terminated');
          },
          onclose: () => {
             if (status === 'talking') setStatus('analyzing');
          }
        }
      });
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e?.message || "Hardware or network failure.");
      setStatus('terminated');
    }
  };

  const handleComplete = async () => {
    setStatus('analyzing');
    cleanup();
    
    const plainTranscripts = transcripts.map(t => `CANDIDATE: ${t.user}\nAI: ${t.ai}`);
    try {
      const results = await evaluateInterview(plainTranscripts, trustScore);
      onComplete({ ...results, transcripts: plainTranscripts, trustScore });
    } catch (e) {
      onComplete({ interviewQualityScore: 0, trustScore });
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  if (status === 'terminated') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-[28px] flex items-center justify-center text-rose-600 mb-8 border border-rose-100/50">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Neural Link Error</h2>
        <p className="text-gray-500 mb-10 max-w-sm font-medium">{errorMessage}</p>
        <div className="flex gap-4 w-full max-w-md">
          <Button variant="outline" fullWidth onClick={onCancel}>Exit</Button>
          <Button fullWidth onClick={startLiveSession}>Retry Connection</Button>
        </div>
      </div>
    );
  }

  if (status === 'setup') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-indigo-50 rounded-[28px] flex items-center justify-center text-indigo-600 mb-8 border border-indigo-100/50">
          <BrainCircuit size={40} className="animate-pulse" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">AI Recruiter Live</h2>
        <p className="text-gray-500 mb-10 max-w-sm font-medium">Connect with mini-hr-01 via real-time video and transcription. Please enable your camera and microphone.</p>
        <div className="flex gap-4 w-full max-w-md">
          <Button variant="outline" fullWidth onClick={onCancel}>Cancel</Button>
          <Button fullWidth onClick={startLiveSession}>Start Session</Button>
        </div>
      </div>
    );
  }

  if (status === 'connecting') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050508] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 size={48} className="text-indigo-500 animate-spin mb-6" />
        <h2 className="text-white text-xl font-black tracking-widest uppercase">Initializing Neural Link...</h2>
      </div>
    );
  }

  if (status === 'analyzing') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center">
        <Sparkles size={48} className="text-indigo-600 animate-pulse mb-6" />
        <h2 className="text-gray-900 text-2xl font-black">Analyzing Session...</h2>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f9fc] flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-500">
      
      {/* Main Experience */}
      <div className="flex-1 p-8 md:p-12 flex flex-col relative">
        <header className="flex justify-between items-center mb-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <BrainCircuit size={24} />
              </div>
              <div>
                 <h3 className="font-black text-gray-900 text-lg leading-none mb-1">AI Recruiter Interface</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Transcription Active
                 </p>
              </div>
           </div>

           <Button variant="ghost" className="text-rose-500 font-black uppercase text-xs tracking-widest" onClick={handleComplete}>
             <PhoneOff size={16} className="mr-2" /> End Session
           </Button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center">
           <div className="w-full max-w-2xl bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl relative min-h-[160px] flex items-center justify-center">
              <div className="absolute top-6 left-6 flex items-center gap-2">
                 <Quote size={16} className="text-indigo-300" />
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Output</span>
              </div>
              <p className="text-xl font-bold text-gray-900 leading-relaxed italic text-center">
                {currentAIText || "Waiting for mini-hr-01 to initialize..."}
              </p>
           </div>
           
           <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                 <Mic size={16} className={micLevel > 0.01 ? 'text-indigo-600 animate-pulse' : 'text-gray-300'} />
                 <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-75" style={{ width: `${Math.min(100, micLevel * 500)}%` }}></div>
                 </div>
              </div>
           </div>

           {currentUserText && (
             <div className="mt-6 text-gray-400 font-medium text-sm animate-pulse">
               You: {currentUserText}
             </div>
           )}
        </main>
      </div>

      <aside className="w-full lg:w-96 bg-gray-950 flex flex-col p-8 border-l border-white/5">
        <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl mb-8 group">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
          <div className="absolute inset-0 pointer-events-none p-6">
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                   <Scan size={14} className="text-indigo-400" />
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">Candidate Trace</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex-1 bg-white/5 rounded-[32px] border border-white/5 p-8 flex flex-col gap-6 overflow-hidden">
           <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                 <Activity size={14} /> Session History
              </h4>
              <span className="text-xl font-black text-white">{trustScore}% Integrity</span>
           </div>
           
           <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {transcripts.map((t, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">CANDIDATE</p>
                   <p className="text-[10px] text-white/70 italic mb-2 line-clamp-2">"{t.user}"</p>
                   <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">AI</p>
                   <p className="text-[10px] text-white/90 line-clamp-2">{t.ai}</p>
                </div>
              ))}
           </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};
