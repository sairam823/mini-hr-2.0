
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CHATS, MOCK_MESSAGES, MOCK_CURRENT_USER } from '../constants';
import { Search, Send, ShieldCheck, MoreVertical, Sparkles, Loader2, Info, BrainCircuit, Check, CheckCheck, Circle } from 'lucide-react';
import { Button } from '../components/Button';
import { generateSmartDraft } from '../geminiService';

interface MessageStatus {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

export const Messages: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState(MOCK_CHATS[0].id);
  const [messages, setMessages] = useState<MessageStatus[]>(
    MOCK_MESSAGES.map(m => ({ ...m, status: 'read' })) as MessageStatus[]
  );
  const [inputText, setInputText] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [typingParticipants, setTypingParticipants] = useState<Set<string>>(new Set());
  const [isUserTyping, setIsUserTyping] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = MOCK_CHATS.find(c => c.id === activeChatId) || MOCK_CHATS[0];
  const activeMessages = messages.filter(m => m.chatId === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [activeMessages, typingParticipants]);

  // Handle local user typing indicator simulation
  useEffect(() => {
    if (inputText.length > 0) {
      setIsUserTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsUserTyping(false);
      }, 2000);
    } else {
      setIsUserTyping(false);
    }
  }, [inputText]);

  // Simulate "Read" receipts when switching chats
  useEffect(() => {
    setMessages(prev => prev.map(m => 
      (m.chatId === activeChatId && m.senderId !== 'u1' && m.status !== 'read') 
        ? { ...m, status: 'read' } 
        : m
    ));
  }, [activeChatId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage: MessageStatus = {
      id: Date.now().toString(),
      chatId: activeChatId,
      senderId: 'u1',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setAiNote(null);
    setIsUserTyping(false);

    // Simulate delivery and read status
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m));
      
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
        
        // If it's the AI assistant, simulate a response typing indicator
        if (activeChat.isAI) {
          setTypingParticipants(prev => new Set(prev).add(activeChat.id));
          setTimeout(() => {
            setTypingParticipants(prev => {
              const next = new Set(prev);
              next.delete(activeChat.id);
              return next;
            });
            const aiReply: MessageStatus = {
              id: (Date.now() + 1).toString(),
              chatId: activeChatId,
              senderId: activeChat.id,
              text: "Neural analysis complete. Your response aligns with high-potential adaptability markers. Would you like to deep-link this interaction to your public profile?",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read'
            };
            setMessages(prev => [...prev, aiReply]);
          }, 2500);
        }
      }, 1200);
    }, 800);
  };

  const handleAIDraft = async () => {
    if (inputText.length < 5) {
      alert("Provide more context for a better AI draft.");
      return;
    }
    setIsDrafting(true);
    try {
      const { draft, suggestionNote } = await generateSmartDraft(inputText, activeChat.name);
      setInputText(draft);
      setAiNote(suggestionNote);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">Neural Sync</h2>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter node connections..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_CHATS.map((chat) => {
            const isTyping = typingParticipants.has(chat.id);
            return (
              <button 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full p-5 flex gap-4 hover:bg-white transition-colors text-left relative group ${activeChatId === chat.id ? 'bg-white border-r-4 border-indigo-600' : ''}`}
              >
                <div className="relative">
                  <img src={chat.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all" alt={chat.name} />
                  {chat.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-gray-900 truncate text-sm">{chat.name}</span>
                      {chat.isVerified && <ShieldCheck size={14} className="text-indigo-600 shrink-0" />}
                      {chat.isAI && <BrainCircuit size={14} className="text-indigo-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate font-medium ${isTyping ? 'text-indigo-500 font-bold' : 'text-gray-500'}`}>
                    {isTyping ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        Typing...
                      </span>
                    ) : chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && !isTyping && (
                  <div className="absolute right-4 bottom-4 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
                    {chat.unread}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={activeChat.avatar} className="w-10 h-10 rounded-xl object-cover" alt={activeChat.name} />
              {activeChat.online && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>}
            </div>
            <div>
              <h3 className="font-black text-gray-900 leading-tight">{activeChat.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{activeChat.role}</p>
                {typingParticipants.has(activeChat.id) ? (
                  <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest animate-pulse flex items-center gap-1">
                    <Circle size={4} className="fill-emerald-500" /> Typing...
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Active Presence</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUserTyping && (
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mr-4 animate-pulse">Syncing your input...</span>
            )}
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"><Info size={20} /></button>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/20 custom-scrollbar">
          {activeMessages.map((msg, idx) => {
            const isMe = msg.senderId === 'u1';
            const isLastOfGroup = idx === activeMessages.length - 1 || activeMessages[idx + 1].senderId !== msg.senderId;
            
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[70%] ${isMe ? 'order-2' : ''} group`}>
                  <div className={`p-4 rounded-[24px] text-sm font-medium shadow-sm border transition-all ${
                    isMe 
                      ? 'bg-gradient-primary text-white border-transparent rounded-tr-none hover:shadow-indigo-500/20 hover:shadow-lg' 
                      : 'bg-white text-gray-700 border-gray-100 rounded-tl-none hover:border-gray-200'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1.5 mt-2 ${isMe ? 'justify-end' : 'justify-start'} transition-opacity group-hover:opacity-100 ${isLastOfGroup ? 'opacity-100' : 'opacity-40'}`}>
                    <p className="text-[10px] font-bold text-gray-400">
                      {msg.time}
                    </p>
                    {isMe && (
                      <span className="transition-colors">
                        {msg.status === 'sent' && <Check size={12} className="text-gray-300" />}
                        {msg.status === 'delivered' && <CheckCheck size={12} className="text-gray-300" />}
                        {msg.status === 'read' && <CheckCheck size={12} className="text-indigo-600 drop-shadow-[0_0_2px_rgba(79,70,229,0.5)]" />}
                      </span>
                    )}
                    {isMe && msg.status === 'read' && isLastOfGroup && (
                      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest ml-1">Seen</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator Bubble */}
          {typingParticipants.has(activeChat.id) && (
            <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-500">
              <div className="bg-white p-4 rounded-[24px] rounded-tl-none shadow-sm border border-gray-100 flex gap-2 items-center">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                </div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* AI Drafting Area */}
        {aiNote && (
          <div className="mx-8 mb-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-[24px] flex gap-3 animate-in slide-in-from-bottom-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
               <Sparkles size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1 flex items-center gap-1">
                Neural Drafter <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
              </p>
              <p className="text-xs text-indigo-700 font-medium leading-relaxed">{aiNote}</p>
            </div>
            <button onClick={() => setAiNote(null)} className="ml-auto text-indigo-300 hover:text-indigo-600">
              <Circle size={12} className="fill-current" />
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="p-8 pt-0">
          <div className={`relative group bg-gray-50 rounded-[32px] border transition-all p-2 ${isUserTyping ? 'border-indigo-200 ring-4 ring-indigo-50' : 'border-gray-100'}`}>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Draft a message or use AI to refine your neural output..."
              className="w-full bg-transparent p-4 pr-32 text-sm font-medium border-none outline-none resize-none min-h-[60px] custom-scrollbar"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="absolute right-4 bottom-4 flex gap-2 items-center">
              <button 
                onClick={handleAIDraft}
                disabled={isDrafting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-200 transition-all disabled:opacity-50 hover:shadow-md active:scale-95"
              >
                {isDrafting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Neural Draft
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`w-10 h-10 bg-gradient-primary text-white rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${!inputText.trim() ? 'opacity-30 cursor-not-allowed grayscale' : 'shadow-indigo-200 hover:scale-110 hover:shadow-indigo-500/30'}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 mt-3">
             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck size={10} className="text-emerald-500" /> Secure Neural Stream Active
             </p>
             {isUserTyping && (
               <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest animate-pulse">Alex is typing...</p>
             )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};
