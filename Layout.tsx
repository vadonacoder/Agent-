
import React from 'react';
import { AppView, User, Project } from '../types';
import { ICON_MAP } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: User | null;
  activeProject: Project | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, user, activeProject }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: 'grid_view' },
    { view: AppView.STUDIO, label: 'Studio', icon: 'auto_awesome' },
    { view: AppView.BUILD, label: 'Build', icon: 'deployed_code' },
    { view: AppView.HISTORY, label: 'History', icon: 'history' },
    { view: AppView.SETTINGS, label: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 bg-[#111a22] px-6 py-3 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">deployed_code</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Gemini AI Studio</h1>
          </div>
          <div className="h-4 w-[1px] bg-slate-700 mx-2"></div>
          {activeProject && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">PROJECT:</span>
              <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">{activeProject.name.toUpperCase()}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Engine Online</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-slate-400">notifications</span>
            </button>
            <div className="size-9 rounded-full bg-slate-800 border border-slate-700 overflow-hidden cursor-pointer hover:border-primary transition-all">
              <img src={user?.avatar || 'https://picsum.photos/100'} alt="Avatar" className="size-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-20 lg:w-64 border-r border-slate-800 bg-[#111a22] flex flex-col p-4 shrink-0 transition-all">
          <div className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                  currentView === item.view 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm font-semibold hidden lg:block">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-auto border-t border-slate-800 pt-4">
             <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-4 rounded-xl border border-primary/10 hidden lg:block">
               <p className="text-[10px] font-bold text-primary uppercase mb-2">Power User</p>
               <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-2">
                 <div className="bg-primary h-full w-2/3"></div>
               </div>
               <p className="text-[10px] text-slate-500">6,400 / 10,000 Tokens</p>
             </div>
          </div>
        </aside>

        <main className="flex-1 overflow-hidden relative bg-background-dark flex flex-col">
          {children}
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-7 bg-primary text-white flex items-center justify-between px-4 text-[10px] font-medium shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">account_tree</span><span>main*</span></div>
          <div className="flex items-center gap-1.5 text-emerald-300"><span className="material-symbols-outlined text-xs">sync</span><span>Synced</span></div>
        </div>
        <div className="flex items-center gap-4">
          <span>{activeProject ? activeProject.type : 'No Project'}</span>
          <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">bolt</span><span>Gemini 3 Pro</span></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
