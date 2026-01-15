
import React from 'react';
import { User } from '../types';

interface WorkspaceProps {
  onLogin: (user: User) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ onLogin }) => {
  const handleAuth = () => {
    onLogin({
      id: 'usr_1',
      name: 'Senior Architect',
      email: 'architect@example.ai',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=architecture'
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 animate-bounce">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Gemini App Factory</h2>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter">
              Generate <span className="text-primary italic">Everything.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              The world's first autonomous AI Software Factory. Describe your vision, watch the code emerge, and export production-ready artifacts in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-4">
             <button 
                onClick={handleAuth}
                className="group relative flex items-center justify-between bg-primary text-white p-6 rounded-2xl font-black text-xl overflow-hidden hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/30"
              >
               <span>ENTER STUDIO</span>
               <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
               <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
             </button>
             <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">shield</span>
               Secure session with Gemini 3 Pro Authentication
             </p>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
          <div className="relative bg-[#111a22] border border-slate-800 rounded-[2.5rem] p-4 shadow-2xl">
             <img src="https://picsum.photos/seed/ide/800/600" alt="IDE Preview" className="rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all duration-700" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-4 text-center">
                <div className="p-4 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-2xl">
                   <p className="text-primary font-mono text-sm font-bold">GEN_PLAN_ACTIVE: 98%</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
