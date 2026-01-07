
import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#050508] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000">
      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className={`flex flex-col items-center gap-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Animated Logo Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-[40px] blur-3xl animate-ping"></div>
          <div className="w-24 h-24 bg-gradient-primary rounded-[32px] flex items-center justify-center text-white shadow-[0_0_50px_rgba(99,102,241,0.5)] relative z-10 border border-white/20">
            <Cpu size={48} className="animate-pulse" />
          </div>
          
          {/* Orbital Particles */}
          <div className="absolute inset-[-20px] border border-white/5 rounded-full animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
          </div>
        </div>

        {/* Text Container */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-[0.2em] text-white uppercase mb-2 animate-in slide-in-from-bottom-4 duration-1000">
            mini hr
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-indigo-500/50"></div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] opacity-80">
              Neural Network 2.0
            </span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-indigo-500/50"></div>
          </div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/5">
        <div className="h-full bg-indigo-500 animate-loading-line origin-left shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        
        @keyframes loading-line {
          0% { transform: scaleX(0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: scaleX(1); }
        }
        .animate-loading-line { animation: loading-line 2.5s ease-out forwards; }
      `}</style>
    </div>
  );
};
