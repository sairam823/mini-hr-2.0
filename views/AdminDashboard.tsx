
import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  ShieldAlert, 
  Activity, 
  Search, 
  Cpu, 
  Clock, 
  Globe, 
  ArrowUpRight,
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Filter
} from 'lucide-react';
import { MOCK_ALL_USERS, MOCK_GLOBAL_LOGS } from '../constants';
import { UserRole } from '../types';

export const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const stats = [
    { label: 'Indexed Nodes', value: '1,284', icon: <Users size={20} />, trend: '+12%', color: 'blue' },
    { label: 'Neural Exams', value: '8,421', icon: <Activity size={20} />, trend: '+8%', color: 'indigo' },
    { label: 'Active Hubs', value: '142', icon: <Globe size={20} />, trend: '+4%', color: 'purple' },
    { label: 'Integrity Rating', value: '98.4%', icon: <ShieldAlert size={20} />, trend: 'Stable', color: 'emerald' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-10 animate-in fade-in duration-700 bg-[#0c0c0f] min-h-screen rounded-[48px] border border-white/5 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
               <Cpu size={18} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter">Oversight Command</h1>
          </div>
          <p className="text-white/40 font-medium text-sm">Platform Owner Dashboard • Neural Integrity Protocol 4.2</p>
        </div>
        
        <div className="flex gap-3">
           <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Clock size={14} /> Export Logs
           </button>
           <button className="px-6 py-2.5 bg-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">
              Live Network Sync
           </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[32px] hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl text-white group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.includes('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-black mb-1">{stat.value}</p>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Node Directory */}
        <div className="lg:col-span-8 bg-white/5 rounded-[40px] border border-white/10 overflow-hidden">
          <div className="p-8 border-b border-white/10 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <Users className="text-indigo-400" />
                <h3 className="text-xl font-black">Node Directory</h3>
             </div>
             <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search Node ID or Name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl py-2 pl-12 pr-4 text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Node Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Exams</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Sync Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ALL_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((user, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-[10px]">{user.name.charAt(0)}</div>
                        <span className="font-bold text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter ${user.role === UserRole.ADMIN ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'}`}>{user.role}</span>
                    </td>
                    <td className="px-8 py-5 font-mono text-xs">{user.assessments}</td>
                    <td className="px-8 py-5 text-xs text-white/40 tabular-nums">{user.lastLogin}</td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`}></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">{user.status}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 text-white/20 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Integrity Logs */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3">
                 <ShieldAlert className="text-amber-400" />
                 Integrity Pulse
              </h3>
              <div className="space-y-6">
                 {MOCK_GLOBAL_LOGS.map((log) => (
                   <div key={log.id} className="flex gap-4 group">
                      <div className={`mt-1 shrink-0 ${log.severity === 'critical' ? 'text-rose-500' : log.severity === 'warning' ? 'text-amber-500' : 'text-indigo-400'}`}>
                         {log.severity === 'critical' ? <XCircle size={14} /> : log.severity === 'warning' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-white group-hover:text-indigo-400 transition-colors truncate pr-2">{log.userName}</span>
                            <span className="text-[8px] font-black text-white/20 uppercase whitespace-nowrap">{log.timestamp}</span>
                         </div>
                         <p className="text-[11px] text-white/40 leading-relaxed font-medium">{log.action}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-3 border border-white/5 hover:bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">View Extended Trace</button>
           </div>

           <div className="bg-gradient-to-br from-indigo-900/40 to-black p-8 rounded-[40px] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] group-hover:scale-150 transition-transform"></div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <TrendingUp size={14} className="text-emerald-400" /> Platform Velocity
              </h4>
              <div className="flex items-end gap-1 h-20 mb-6">
                 {[40, 60, 45, 90, 65, 80, 50, 70, 85].map((h, i) => (
                   <div key={i} className="flex-1 bg-white/5 rounded-full relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-indigo-500/40" style={{ height: `${h}%` }}></div>
                   </div>
                 ))}
              </div>
              <p className="text-[10px] text-white/40 font-medium leading-relaxed">Network compute load is stabilizing across global shards. Next re-indexing scheduled in 14m.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
