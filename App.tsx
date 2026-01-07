
import React, { useState } from 'react';
import { UserProfile, AppliedJob, HistoryItem, UserRole } from './types';
import { NAV_ITEMS, MOCK_CURRENT_USER, MOCK_NOTIFICATIONS } from './constants';
import { Home } from './views/Home';
import { SocialFeed } from './views/SocialFeed';
import { Marketplace } from './views/Marketplace';
import { CandidateDashboard } from './views/CandidateDashboard';
import { Messages } from './views/Messages';
import { SystemStatus } from './views/SystemStatus';
import { ProjectTour } from './views/ProjectTour';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './views/Login';
import { AdminDashboard } from './views/AdminDashboard';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  ChevronRight, 
  UserCircle,
  Cpu,
  BrainCircuit,
  Zap,
  ShieldEllipsis
} from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>(MOCK_CURRENT_USER as any);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // Splash screen timeout
  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleDispatch = (dispatchData: any) => {
    const newHistory: HistoryItem = {
      id: `${dispatchData.type}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      score: dispatchData.score,
      label: dispatchData.jobTitle || `${dispatchData.type === 'logic' ? 'Logic' : 'Interview'} Challenge for ${dispatchData.companyName}`,
      notes: dispatchData.results?.insights || `Direct dispatch to ${dispatchData.companyName} hiring hub. Performance verified at ${dispatchData.score}%.`,
      targetCompany: dispatchData.companyName,
      transcripts: dispatchData.results?.transcripts,
      detailedFeedback: dispatchData.results?.detailedFeedback
    };

    const newApplication: AppliedJob = {
      jobId: dispatchData.jobId || `gen-${Date.now()}`,
      companyName: dispatchData.companyName,
      jobTitle: dispatchData.jobTitle,
      status: 'reviewing',
      scoreSent: dispatchData.score,
      timestamp: 'Just now'
    };

    setUser(prev => ({
      ...prev,
      attemptHistory: dispatchData.type === 'logic' ? [newHistory, ...(prev.attemptHistory || [])] : prev.attemptHistory,
      interviewHistory: dispatchData.type === 'interview' ? [newHistory, ...(prev.interviewHistory || [])] : prev.interviewHistory,
      appliedHistory: [newApplication, ...(prev.appliedHistory || [])],
      scores: {
        ...prev.scores!,
        potential: Math.round(((prev.scores?.potential || 0) + dispatchData.score) / 2),
        performance: dispatchData.type === 'logic' ? dispatchData.score : (prev.scores?.performance || 0)
      }
    }));

    setNotifications(prev => [{
      id: Date.now(),
      title: 'Neural Node Updated',
      message: `Your results for ${dispatchData.jobTitle} have been indexed. Compatibility: ${dispatchData.score}%.`,
      time: 'Just now',
      read: false
    }, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home user={user} onAction={(action) => {
          if (action === 'jobs') setActiveTab('marketplace');
          if (action === 'assessment' || action === 'interview') setActiveTab('dashboard');
        }} />;
      case 'feed':
        return <SocialFeed />;
      case 'marketplace':
        return <Marketplace onDispatch={handleDispatch} />;
      case 'dashboard':
        return <CandidateDashboard user={user} onDispatch={handleDispatch} onUpdateUser={(updates) => setUser(prev => ({ ...prev, ...updates }))} />;
      case 'messages':
        return <Messages />;
      case 'apm':
        return <SystemStatus />;
      case 'tour':
        return <ProjectTour onExit={() => setActiveTab('home')} />;
      case 'admin':
        return user.role === UserRole.ADMIN ? <AdminDashboard /> : <Home user={user} onAction={() => {}} />;
      default:
        return <div>Module Under Construction</div>;
    }
  };

  const isAdmin = user.role === UserRole.ADMIN;

  if (showSplash) return <SplashScreen />;
  if (!isLoggedIn) return <Login onLogin={(r, n) => { 
    setIsLoggedIn(true); 
    setUser(p => ({ ...p, role: r as any, name: n || p.name })); 
    // If admin logs in, default them to the admin panel
    if (r === UserRole.ADMIN) setActiveTab('admin');
  }} />;

  return (
    <div className={`flex h-screen animate-in fade-in duration-700 overflow-hidden ${activeTab === 'admin' ? 'bg-[#050508]' : 'bg-[#fcfcfd]'}`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white border-r border-gray-100 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${activeTab === 'admin' ? '!bg-[#0c0c0f] !border-white/5' : ''}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <Cpu size={24} />
              </div>
              <span className={`text-2xl font-black tracking-tighter ${activeTab === 'admin' ? 'text-white' : 'text-gray-900'}`}>mini hr</span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group ${activeTab === item.id ? (activeTab === 'admin' ? 'bg-white/5 text-indigo-400' : 'bg-indigo-50 text-indigo-600') : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <div className={`transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                {activeTab === item.id && <ChevronRight size={16} className="ml-auto" />}
              </button>
            ))}

            {/* Admin Only Navigation Item */}
            {isAdmin && (
              <button
                onClick={() => { setActiveTab('admin'); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group mt-10 border border-indigo-500/20 ${activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-indigo-400/60 hover:bg-indigo-500/5'}`}
              >
                <ShieldEllipsis size={20} className={activeTab === 'admin' ? '' : 'animate-pulse'} />
                <span className="text-sm font-black uppercase tracking-widest">Admin Panel</span>
                {activeTab === 'admin' && <ChevronRight size={16} className="ml-auto" />}
              </button>
            )}
          </nav>

          <div className="p-6 border-t border-gray-50">
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Logout Node</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto relative h-full">
        <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center ${activeTab === 'admin' ? 'bg-[#050508]/80 border-white/5' : 'bg-white/80 border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
              <Menu size={24} />
            </button>
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border ${activeTab === 'admin' ? 'bg-white/5 border-white/10' : 'bg-indigo-50/50 border-indigo-100/50'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${activeTab === 'admin' ? 'bg-indigo-400' : 'bg-emerald-500'}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'admin' ? 'text-indigo-400' : 'text-indigo-900'}`}>
                {activeTab === 'admin' ? 'Admin Oversite Active' : 'Neural Link Synchronized'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`hidden md:flex items-center rounded-2xl px-4 py-2 focus-within:ring-2 transition-all ${activeTab === 'admin' ? 'bg-white/5 border border-white/10 focus-within:ring-white/10' : 'bg-gray-50 border border-gray-100 focus-within:ring-indigo-100'}`}>
               <Search size={18} className="text-gray-400" />
               <input type="text" placeholder="Search the network..." className="bg-transparent border-none focus:ring-0 text-sm px-3 w-48 text-inherit" />
            </div>
            <button className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className={`flex items-center gap-3 pl-4 border-l ${activeTab === 'admin' ? 'border-white/5' : 'border-gray-100'}`}>
               <div className="text-right hidden sm:block">
                  <p className={`text-xs font-black uppercase tracking-tight ${activeTab === 'admin' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                  <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{user.role}</p>
               </div>
               <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-50" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"></div>}
    </div>
  );
};

export default App;
