
import React from 'react';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  TrendingUp,
  BrainCircuit,
  Zap,
  Star,
  LayoutGrid,
  BarChart3,
  Server,
  PlayCircle,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from './types';

export const PRIMARY_GRADIENT = "from-indigo-600 to-violet-700";
export const SECONDARY_GRADIENT = "from-slate-800 to-slate-900";
export const MAX_ATTEMPTS = 20;

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={18} /> },
  { id: 'tour', label: 'Platform Tour', icon: <PlayCircle size={18} /> },
  { id: 'feed', label: 'Activity', icon: <LayoutGrid size={18} /> },
  { id: 'marketplace', label: 'Opportunities', icon: <Briefcase size={18} /> },
  { id: 'dashboard', label: 'Performance', icon: <Activity size={18} /> },
  { id: 'messages', label: 'Sync Channel', icon: <MessageSquare size={18} /> },
  { id: 'apm', label: 'Cloud Status', icon: <Server size={18} /> },
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Evaluation Quota Updated', message: 'Evaluation permissions have been refreshed for the current cycle.', time: 'Just now', read: false },
  { id: 2, title: 'Identity Verified', message: 'Your professional node has been successfully indexed in the global network.', time: '1h ago', read: true },
  { id: 3, title: 'High Compatibility Match', message: 'Stripe Global has requested an adaptability bridge for your profile.', time: '3h ago', read: false },
];

export const MOCK_CURRENT_USER = {
  id: 'u1',
  name: 'Alex Chen',
  role: UserRole.CANDIDATE,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
  headline: 'Lead Software Architect | Neural Specialist',
  bio: 'Architecting high-scale distributed systems with a focus on human-centric AI integration.',
  scores: {
    potential: 88,
    performance: 75,
    learning: 92,
    adaptability: 95,
    trust: 98,
    curiosity: 90
  },
  resumeData: {
    skills: ['React', 'TypeScript', 'System Design', 'Neural Networks'],
    experienceLevel: 'Senior',
    projects: ['Decentralized Work Hub', 'AI Talent Matcher'],
    education: ['Stanford University'],
    rawSummary: 'Building the future of recruitment with AI.'
  },
  attemptHistory: [
    { 
      id: 'h1',
      date: '2023-12-20', 
      score: 88, 
      label: 'Logical Reasoning Phase 02',
      notes: 'Demonstrated exceptional grasp of structural logic and algorithmic adaptation.'
    }
  ],
  interviewHistory: [],
  verifiedSkills: ['React', 'TypeScript'],
  connections: 482,
  following: 125,
  status: 'active'
};

export const MOCK_ALL_USERS = [
  { id: 'u1', name: 'Alex Chen', role: UserRole.CANDIDATE, lastLogin: '2024-03-20 14:30', assessments: 12, status: 'active' },
  { id: 'u2', name: 'Stripe Global', role: UserRole.COMPANY, lastLogin: '2024-03-20 09:15', assessments: 45, status: 'active' },
  { id: 'u3', name: 'System Root', role: UserRole.ADMIN, lastLogin: '2024-03-20 16:45', assessments: 0, status: 'active' },
  { id: 'u4', name: 'Sarah Jenkins', role: UserRole.CANDIDATE, lastLogin: '2024-03-19 22:10', assessments: 4, status: 'offline' },
  { id: 'u5', name: 'Marcus Aurelius', role: UserRole.CANDIDATE, lastLogin: '2024-03-20 11:20', assessments: 8, status: 'active' },
];

export const MOCK_GLOBAL_LOGS = [
  { id: 'l1', userId: 'u1', userName: 'Alex Chen', action: 'Validation Complete: Logic Phase (Score: 88%)', timestamp: '5m ago', severity: 'info' },
  { id: 'l2', userId: 'u4', userName: 'Sarah Jenkins', action: 'Integrity Alert: Context Switching Detected', timestamp: '2h ago', severity: 'warning' },
  { id: 'l3', userId: 'u2', userName: 'Stripe Global', action: 'Index Update: 5 New Opportunities Dispatched', timestamp: '4h ago', severity: 'info' },
  { id: 'l4', userId: 'u5', userName: 'Marcus Aurelius', action: 'Identity Sync: Node Registered', timestamp: '6h ago', severity: 'info' },
  { id: 'l5', userId: 'unauthorized', userName: 'Unknown', action: 'Security Notice: Multiple failed handshake attempts', timestamp: '12h ago', severity: 'critical' },
];

export const MOCK_APM_METRICS = {
  latency: '124ms',
  errorRate: '0.04%',
  throughput: '14.2k req/min',
  cpuUsage: '42%',
  memoryUsage: '2.4GB',
  uptime: '99.99%',
  engineHealth: 'Optimal',
  activeNodes: 1284,
  recentIncidents: [
    { id: 1, title: 'Cloud Shard Re-balancing', status: 'Resolved', time: '10m ago' },
    { id: 2, title: 'Core Latency Monitoring', status: 'Monitoring', time: '2h ago' }
  ]
};

export const MOCK_CHATS = [
  { id: 'c1', name: 'Sarah Jenkins', role: 'Talent Acquisition @ Stripe', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200', lastMessage: 'Your performance metrics are exceptional.', time: '12m ago', unread: 1, online: true, isVerified: true },
  { id: 'c2', name: 'Neural Assistant', role: 'System Orchestrator', avatar: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=200&h=200', lastMessage: 'Neural analysis phase complete.', time: '2h ago', unread: 0, online: true, isAI: true }
];

export const MOCK_MESSAGES = [
  { id: 'm1', chatId: 'c1', senderId: 'c1', text: "Hello Alex. Your adaptability bridge request was approved.", time: '15m ago' },
  { id: 'm2', chatId: 'c1', senderId: 'c1', text: "We'd like to schedule a deep-sync for the Lead Architect position.", time: '12m ago' }
];

export const MOCK_POSTS = [
  { id: 'p1', authorId: 'u1', authorName: 'Alex Chen', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', authorRole: 'CANDIDATE', content: "Just completed the Phase 02 Logic Simulation. The adaptive difficulty is a game changer for authentic self-discovery.", likes: 42, comments: 8, timestamp: '2h ago', isVerified: true },
  { id: 'p2', authorId: 'c1', authorName: 'TechNova Global', authorAvatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=200&h=200', authorRole: 'COMPANY', content: "Seeking engineers with a Learning Velocity score of 90+. Excellence is our only baseline.", likes: 156, comments: 24, timestamp: '5h ago' }
];

export const MOCK_JOBS = [
  { id: 'j1', companyName: 'Lumina AI', companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=100&h=100', title: 'Principal Product Designer', location: 'London / Remote', salary: '£120k - £160k', tags: ['Design', 'AI'], postedAt: '1d ago', minPotentialScore: 82 },
  { id: 'j2', companyName: 'Velocity Systems', companyLogo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=100&h=100', title: 'Systems Architect', location: 'San Francisco, CA', salary: '$180k - $240k', tags: ['Infrastructure', 'Cloud'], postedAt: '3h ago', minPotentialScore: 78 }
];
