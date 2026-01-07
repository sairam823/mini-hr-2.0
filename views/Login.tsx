
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { 
  ShieldCheck, 
  Cpu, 
  Mail, 
  Lock, 
  Github, 
  Linkedin, 
  Fingerprint, 
  Loader2,
  UserPlus,
  LogIn,
  Phone,
  Hash,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Zap,
  Network,
  ChevronLeft,
  Terminal,
  ShieldHalf,
  Building2,
  AlertTriangle,
  User,
  MessageSquare,
  Smartphone,
  Wifi,
  Battery,
  Activity,
  Server,
  EyeOff,
  Signal,
  ShieldEllipsis
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, name?: string) => void;
}

type AuthMode = 'gateway' | 'signup' | 'signin';
type AuthStep = 'initial' | 'otp' | 'success';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('gateway');
  const [step, setStep] = useState<AuthStep>('initial');
  const [role, setRole] = useState<UserRole>(UserRole.CANDIDATE);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('phone');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  // Simulation & Security State
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const addLog = (msg: string) => {
    setSecurityLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleGenerateOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setOtp('');

    addLog("Initializing secure handshake...");
    
    const newToken = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedToken(newToken);

    setTimeout(() => {
      addLog("Cryptographic token generated.");
      addLog(`Dispatching via ${authMethod === 'phone' ? 'SMS Gateway' : 'SMTP Relay'}...`);
      
      setTimeout(() => {
        setIsProcessing(false);
        setStep('otp');
        setCountdown(60);
        addLog("E2EE Transmission confirmed.");
        
        setTimeout(() => {
          setShowPhone(true);
        }, 800);
      }, 700);
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    addLog("Validating session token...");

    setTimeout(() => {
      if (otp !== generatedToken) {
        setIsProcessing(false);
        setError("Neural Desync: Verification failed. The code is invalid or expired.");
        addLog("CRITICAL: Failed verification attempt logged.");
        return;
      }

      addLog("Token verified. Session established.");
      setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
        setShowPhone(false);
        
        setTimeout(() => {
          onLogin(role, fullName || (role === UserRole.ADMIN ? 'Admin Root' : undefined));
        }, 1500);
      }, 500);
    }, 1200);
  };

  const maskIdentifier = (val: string) => {
    if (!val) return '***';
    if (authMethod === 'email') {
      const [user, domain] = val.split('@');
      return `${user.substring(0, 2)}***@${domain}`;
    }
    return `+1 ***-***-${val.slice(-4)}`;
  };

  if (mode === 'gateway') {
    return (
      <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <BackgroundAmbience />
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 relative z-10">
          <div className="flex flex-col justify-center animate-in slide-in-from-left duration-1000">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
                   <Cpu size={28} />
                </div>
                <span className="text-3xl font-black tracking-tighter">mini hr</span>
             </div>
             <h1 className="text-6xl font-black leading-[0.9] mb-6 tracking-tighter">
                Secure <br/><span className="text-indigo-500">Neural Login.</span>
             </h1>
             <p className="text-white/40 text-lg font-medium max-w-sm mb-12 leading-relaxed">
                Connect your professional node using our zero-knowledge authentication protocol.
             </p>
             <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                <ShieldCheck size={16} className="text-indigo-500" />
                Auth Framework v4.0 Active
             </div>
          </div>

          <div className="grid gap-6 animate-in slide-in-from-right duration-1000">
             <ChoiceCard 
                icon={<UserPlus size={40} />}
                title="Initialize New Node"
                subtitle="SECURE SIGN UP"
                desc="Create a unique professional index. Requires external phone or email verification."
                onClick={() => setMode('signup')}
                color="indigo"
             />
             <ChoiceCard 
                icon={<LogIn size={40} />}
                title="Sync Existing Node"
                subtitle="ZERO-TRUST SIGN IN"
                desc="Reconnect with your verified potential scores and professional network."
                onClick={() => setMode('signin')}
                color="purple"
             />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <BackgroundAmbience />
      
      <PhoneSimulator 
        visible={showPhone} 
        otp={generatedToken || '000000'} 
        onClose={() => setShowPhone(false)} 
      />

      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-0 bg-white/5 backdrop-blur-2xl rounded-[48px] border border-white/10 shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">
        
        <div className={`hidden lg:flex lg:col-span-4 flex-col p-12 relative overflow-hidden bg-gradient-to-br ${mode === 'signup' ? 'from-indigo-600 to-indigo-900' : 'from-purple-600 to-purple-900'}`}>
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           <button onClick={() => setMode('gateway')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-16 relative z-10">
              <ChevronLeft size={16} /> Return to Gateway
           </button>
           
           <div className="flex-1 relative z-10">
              <h2 className="text-4xl font-black leading-none mb-6 tracking-tighter">
                {step === 'otp' ? 'Secure \nVerify.' : mode === 'signup' ? 'Node \nRegistration.' : 'Profile \nAccess.'}
              </h2>
              <p className="text-white/60 text-sm font-medium leading-relaxed mb-10">
                {step === 'otp' ? 'Protect your node. Do not share the verification token with anyone.' : 
                 mode === 'signup' ? 'Our engine uses biometric patterns and logic tests to verify your potential.' : 
                 'Syncing with the decentralized identity index to retrieve your professional node.'}
              </p>

              <div className="bg-black/40 rounded-3xl p-6 border border-white/10 backdrop-blur-xl">
                 <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                    <Terminal size={14} /> Security Context
                 </div>
                 <div className="space-y-3">
                    {securityLogs.length > 0 ? securityLogs.map((log, i) => (
                      <p key={i} className="text-[10px] font-mono text-emerald-400/80 leading-tight animate-in fade-in slide-in-from-left-2">{log}</p>
                    )) : <p className="text-[10px] font-mono text-white/20 italic">Awaiting secure session...</p>}
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 p-10 lg:p-20 bg-[#050508]/40 backdrop-blur-md relative overflow-hidden">
          {step === 'initial' ? (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black tracking-tight">
                  {mode === 'signup' ? 'Node Initialization' : 'Identity Sync'}
                </h1>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Relay: Active</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <RoleButton active={role === UserRole.CANDIDATE} onClick={() => setRole(UserRole.CANDIDATE)} icon={<User size={18} />} label="Candidate" />
                <RoleButton active={role === UserRole.COMPANY} onClick={() => setRole(UserRole.COMPANY)} icon={<Building2 size={18} />} label="Company Hub" />
                <RoleButton active={role === UserRole.ADMIN} onClick={() => setRole(UserRole.ADMIN)} icon={<ShieldEllipsis size={18} />} label="Admin Oversight" />
              </div>

              <form onSubmit={handleGenerateOTP} className="space-y-6">
                {mode === 'signup' && (
                  <AuthInput 
                    label="Legal Entity Name" 
                    icon={<User size={18} />} 
                    type="text" 
                    value={fullName} 
                    onChange={setFullName} 
                    placeholder="Full Name" 
                  />
                )}

                <div className="flex gap-8 mb-4 border-b border-white/5 pb-2">
                  <button type="button" onClick={() => setAuthMethod('phone')} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${authMethod === 'phone' ? 'text-indigo-400' : 'text-white/20'}`}>
                    <Smartphone size={12} /> Phone
                  </button>
                  <button type="button" onClick={() => setAuthMethod('email')} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${authMethod === 'email' ? 'text-indigo-400' : 'text-white/20'}`}>
                    <Mail size={12} /> Email
                  </button>
                </div>

                {authMethod === 'phone' ? (
                  <AuthInput label="Mobile Registry" icon={<Phone size={18} />} type="tel" value={phoneNumber} onChange={setPhoneNumber} placeholder="+1 (555) 000-0000" />
                ) : (
                  <AuthInput label="Neural Mailbox" icon={<Mail size={18} />} type="email" value={email} onChange={setEmail} placeholder="name@domain.com" />
                )}

                <div className="pt-4">
                  <Button fullWidth size="lg" disabled={isProcessing} className="rounded-[24px] font-black group">
                    {isProcessing ? (
                      <><Loader2 className="animate-spin mr-3" /> Handshaking...</>
                    ) : (
                      <>
                        <Zap className="mr-3 fill-white group-hover:animate-pulse" size={20} />
                        Request Neural Token
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : step === 'otp' ? (
            <div className="animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black tracking-tight">Enter Token</h1>
                <div className="text-right">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Time Remaining</p>
                  <p className="text-xl font-black text-white tabular-nums">{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] mb-12 flex items-center gap-6">
                 <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
                    <ShieldCheck size={28} />
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Masked Destination</p>
                    <p className="text-lg font-black text-white">{maskIdentifier(authMethod === 'phone' ? phoneNumber : email)}</p>
                 </div>
                 <button onClick={() => setStep('initial')} className="text-[10px] font-black text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest">Change</button>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-3xl flex items-center gap-4 mb-8">
                   <AlertTriangle className="text-rose-500 shrink-0" size={24} />
                   <p className="text-sm font-bold text-rose-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-12">
                <div className="relative group">
                   <Hash className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors" size={28} />
                   <input 
                      type="text" 
                      maxLength={6} 
                      autoFocus
                      inputMode="numeric"
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white/5 border-2 border-white/10 rounded-[32px] py-10 pl-20 pr-8 text-5xl font-black tracking-[0.6em] focus:border-indigo-500/50 outline-none transition-all placeholder:text-white/5 text-white"
                      placeholder="000000"
                   />
                </div>

                <div className="flex flex-col gap-6">
                  <Button fullWidth size="lg" disabled={isProcessing || otp.length < 6} className="rounded-[28px] py-6 font-black text-xl shadow-2xl shadow-indigo-500/20">
                    {isProcessing ? <Loader2 className="animate-spin mr-3" /> : <ShieldHalf className="mr-3" />}
                    Confirm Identity
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-700 h-full">
               <div className="w-32 h-32 bg-emerald-500/20 rounded-[50px] border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-10 shadow-[0_0_80px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={72} className="animate-bounce" />
               </div>
               <h2 className="text-4xl font-black mb-4 tracking-tight">Sync Established</h2>
               <p className="text-white/40 font-bold uppercase text-[11px] tracking-[0.3em]">Accessing Node Index...</p>
               <div className="mt-12 w-48 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-loading-bar origin-left"></div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// UI Sub-components
const PhoneSimulator: React.FC<{ visible: boolean, otp: string, onClose: () => void }> = ({ visible, otp, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-12 duration-700">
      <div className="w-[300px] h-[600px] bg-[#0c0c0f] rounded-[56px] border-[10px] border-[#222228] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col ring-1 ring-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-b-3xl z-20 flex items-center justify-center">
           <div className="w-12 h-1 bg-white/5 rounded-full"></div>
        </div>
        
        <div className="flex-1 p-8 pt-14 flex flex-col">
          <div className="flex justify-between items-center text-[11px] font-black text-white/50 mb-12">
             <span>9:41</span>
             <div className="flex gap-2 items-center">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={14} className="rotate-90" />
             </div>
          </div>

          <div className="animate-in slide-in-from-top-6 duration-1000">
             <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] p-6 border border-white/20 shadow-2xl mb-4">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <MessageSquare size={20} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">MINI HR SECURE</p>
                      <p className="text-[8px] font-bold text-white/30 uppercase">Neural Dispatch</p>
                   </div>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-medium mb-4">
                  Identity sync token:
                </p>
                <div className="bg-black/40 py-4 text-center rounded-2xl border border-white/5">
                   <span className="text-3xl font-black text-white tracking-[0.3em] font-mono">{otp}</span>
                </div>
             </div>
          </div>
        </div>

        <button onClick={onClose} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors"></button>
      </div>
      
      <button 
        onClick={onClose} 
        className="absolute -top-4 -right-4 w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform border-4 border-[#050508]"
      >
        <XCircle size={24} />
      </button>
    </div>
  );
};

const ChoiceCard: React.FC<{ icon: React.ReactNode, title: string, subtitle: string, desc: string, color: string, onClick: () => void }> = ({ icon, title, subtitle, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[56px] text-left hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-64 h-64 bg-${color}-500/10 blur-[100px] group-hover:bg-${color}-500/20 transition-all`}></div>
    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white mb-10 border border-white/10 group-hover:scale-110 transition-all duration-500 shadow-inner">
      {icon}
    </div>
    <p className={`text-[10px] font-black text-${color}-400 uppercase tracking-[0.4em] mb-3`}>{subtitle}</p>
    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter leading-tight">{title}</h3>
    <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">{desc}</p>
    <div className="flex items-center gap-4 text-white/20 group-hover:text-white transition-colors">
       <div className="h-px flex-1 bg-white/10 group-hover:bg-white/20"></div>
       <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
    </div>
  </button>
);

const RoleButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-3 text-center ${active ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-white/20'}`}>
       {icon}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const AuthInput: React.FC<{ label: string, icon: React.ReactNode, type: string, value: string, onChange: (v: string) => void, placeholder: string }> = ({ label, icon, type, value, onChange, placeholder }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-6">{label}</label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <input 
        type={type} 
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-[28px] py-5 pl-16 pr-8 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-white/10 text-white shadow-inner"
      />
    </div>
  </div>
);

const BackgroundAmbience = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse delay-700"></div>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
  </div>
);

const XCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);
