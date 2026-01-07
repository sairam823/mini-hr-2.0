
import React from 'react';
import { MOCK_APM_METRICS } from '../constants';
import { Activity, Server, ShieldCheck, Zap, AlertCircle, Clock, BarChart3, Globe } from 'lucide-react';

export const SystemStatus: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Engine Observability</h1>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            Live APM Metrics from mini hr Core
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={<Activity size={20} />} label="API Latency" value={MOCK_APM_METRICS.latency} trend="down" />
        <MetricCard icon={<AlertCircle size={20} />} label="Error Rate" value={MOCK_APM_METRICS.errorRate} trend="stable" />
        <MetricCard icon={<Zap size={20} />} label="Throughput" value={MOCK_APM_METRICS.throughput} trend="up" />
        <MetricCard icon={<Clock size={20} />} label="Platform Uptime" value={MOCK_APM_METRICS.uptime} trend="stable" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <BarChart3 className="text-indigo-600" />
            Neural Compute Distribution
          </h3>
          <div className="h-64 flex items-end justify-between gap-4">
            {[65, 45, 78, 92, 55, 30, 88, 70, 40, 95, 60, 82].map((height, i) => (
              <div key={i} className="flex-1 bg-indigo-50 rounded-t-xl relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-primary rounded-t-xl transition-all duration-1000 group-hover:brightness-110" 
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>Now</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-6 flex items-center gap-3">
              <Globe className="text-indigo-600" />
              Global Edge Nodes
            </h3>
            <div className="space-y-4">
              <RegionItem label="US-East-1" status="Active" ping="24ms" />
              <RegionItem label="EU-West-2" status="Active" ping="88ms" />
              <RegionItem label="ASIA-South-1" status="Active" ping="112ms" />
              <RegionItem label="SA-East-1" status="Degraded" ping="310ms" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <Server className="text-indigo-400" />
              <h3 className="font-black">Active Clusters</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Engine Load</span>
                <span className="text-sm font-black text-indigo-400">42%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[42%]"></div>
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-4">
                The mini hr neural engine is currently operating at peak efficiency across {MOCK_APM_METRICS.activeNodes} distributed nodes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: 'up' | 'down' | 'stable' }> = ({ icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
    <div className="flex items-center gap-3 mb-4 text-gray-400">
      {icon}
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-black text-gray-900">{value}</span>
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
        trend === 'up' ? 'bg-rose-50 text-rose-600' : trend === 'down' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
      }`}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} 
      </span>
    </div>
  </div>
);

const RegionItem: React.FC<{ label: string, status: string, ping: string }> = ({ label, status, ping }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
      <span className="text-sm font-bold text-gray-700">{label}</span>
    </div>
    <span className="text-xs font-black text-gray-400 uppercase">{ping}</span>
  </div>
);
