
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Briefcase, 
  BarChart3,
  XCircle,
  Clock
} from 'lucide-react';

const TOUR_SLIDES = [
  {
    id: 'intro',
    title: 'The Philosophy of Potential',
    subtitle: 'Why Performance is the Wrong Metric',
    desc: 'Traditional hiring looks at what you did. mini hr looks at what you CAN do. Our neural engine maps learning velocity, curiosity, and adaptability—the true drivers of future success.',
    icon: <BrainCircuit size={48} className="text-indigo-400" />,
    color: 'from-indigo-900 to-indigo-950'
  },
  {
    id: 'logic',
    title: 'Adaptive Logic Engine',
    subtitle: 'Measuring Growth Velocity',
    desc: 'The Assessment Engine doesn\'t just mark right or wrong. It tracks how quickly you adapt to increasing complexity, identifying candidates who thrive in high-load, ambiguous environments.',
    icon: <Zap size={48} className="text-amber-400" />,
    color: 'from-amber-900 to-amber-950'
  },
  {
    id: 'interview',
    title: 'Neural Video Interviewing',
    subtitle: 'Behavioral Analysis at Scale',
    desc: 'Interact with our friendly AI host. We analyze communication clarity, technical depth, and soft-skill adaptability in a stress-free, conversational environment.',
    icon: <Play size={48} className="text-purple-400" />,
    color: 'from-purple-900 to-purple-950'
  },
  {
    id: 'trust',
    title: 'The Integrity Cloud',
    subtitle: '100% Verified Meritocracy',
    desc: 'Using focus tracking and biometric signals, we ensure a fair playing field for everyone. Your Trust Score is a permanent, verified asset on your professional node.',
    icon: <ShieldCheck size={48} className="text-emerald-400" />,
    color: 'from-emerald-900 to-emerald-950'
  },
  {
    id: 'marketplace',
    title: 'Matching Marketplace',
    subtitle: 'Apply with your Potential Profile',
    desc: 'Stop sending resumes. Start sending verified potential. Companies hire based on your Predictive Growth Velocity, matching you with roles where you will truly excel.',
    icon: <Briefcase size={48} className="text-blue-400" />,
    color: 'from-blue-900 to-blue-950'
  },
  {
    id: 'apm',
    title: 'System Observability',
    subtitle: 'Real-time Neural Compute',
    desc: 'Total transparency. Monitor the health of the engine, compute distribution, and global latency. We are building the most reliable infrastructure for human talent.',
    icon: <BarChart3 size={48} className="text-rose-400" />,
    color: 'from-rose-900 to-rose-950'
  }
];

export const ProjectTour: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  const slide = TOUR_SLIDES[currentSlide];

  useEffect(() => {
    let interval: any;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentSlide(curr => (curr + 1) % TOUR_SLIDES.length);
            return 0;
          }
          return prev + 1;
        });
      }, 80); // 8 seconds per slide roughly
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, currentSlide]);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % TOUR_SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + TOUR_SLIDES.length) % TOUR_SLIDES.length);
    setProgress(0);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-gradient-to-br ${slide.color} flex flex-col transition-all duration-1000 overflow-hidden`}>
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-2xl">
            <Cpu size={28} />
          </div>
          <div>
            <h2 className="text-white font-black text-xl tracking-tighter">mini hr tour</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Neural Walkthrough v2.0</p>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="p-4 text-white/40 hover:text-white transition-colors"
        >
          <XCircle size={32} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-10 lg:px-24 gap-20 relative z-10">
        <div className="flex-1 max-w-2xl animate-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-10 border border-white/10">
            <Sparkles size={16} />
            <span>Option {currentSlide + 1} of {TOUR_SLIDES.length}</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-none mb-6 tracking-tighter">
            {slide.title}
          </h1>
          <h2 className="text-2xl lg:text-3xl font-bold text-indigo-400 mb-10 tracking-tight">
            {slide.subtitle}
          </h2>
          <p className="text-lg lg:text-xl text-white/60 leading-relaxed font-medium mb-12">
            {slide.desc}
          </p>

          <div className="flex gap-6">
            <Button 
              size="lg" 
              className="rounded-3xl px-10 !bg-white !text-indigo-900 font-black shadow-2xl"
              onClick={handleNext}
            >
              Learn More <ChevronRight className="ml-2" />
            </Button>
            <button 
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10"
            >
              {isAutoPlay ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>

        {/* Feature Spotlight Window */}
        <div className="w-full lg:w-[480px] h-[480px] relative animate-in zoom-in duration-1000 delay-300">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[60px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-32 h-32 bg-white/10 rounded-[40px] flex items-center justify-center mb-10 border border-white/20 shadow-inner group overflow-hidden">
                 <div className="transition-transform duration-700 group-hover:scale-125">
                   {slide.icon}
                 </div>
              </div>
              
              <div className="space-y-6 w-full">
                <div className="h-4 bg-white/5 rounded-full w-3/4 mx-auto animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded-full w-1/2 mx-auto animate-pulse delay-75"></div>
                <div className="h-4 bg-white/5 rounded-full w-2/3 mx-auto animate-pulse delay-150"></div>
              </div>

              <div className="mt-16 pt-10 border-t border-white/5 w-full">
                 <div className="flex justify-center gap-2">
                    {TOUR_SLIDES.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
                      ></div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
          
          {/* Floating Data Nodes */}
          <div className="absolute -top-10 -right-10 w-40 p-6 bg-white/10 backdrop-blur-md rounded-[32px] border border-white/20 animate-bounce-slow">
            <Clock className="text-white/40 mb-3" size={20} />
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Feed</p>
            <p className="text-white font-bold mt-1">98.2% Accurate</p>
          </div>

          <div className="absolute -bottom-10 -left-10 w-48 p-6 bg-indigo-500/20 backdrop-blur-md rounded-[32px] border border-white/20 animate-float">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Engine Active</p>
            </div>
            <p className="text-white/60 text-[11px] font-medium leading-relaxed">Processing multi-dimensional potential signals...</p>
          </div>
        </div>
      </main>

      {/* Footer Progress */}
      <footer className="relative z-10 p-10">
        <div className="max-w-7xl mx-auto flex items-center gap-10">
          <button 
            onClick={handlePrev}
            className="p-3 text-white/40 hover:text-white transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear shadow-[0_0_20px_rgba(255,255,255,0.8)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button 
            onClick={handleNext}
            className="p-3 text-white/40 hover:text-white transition-colors"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float { animation: float 6s infinite ease-in-out; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
