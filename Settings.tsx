
import React from 'react';
import { User } from '../types';

interface SettingsProps {
  user: User | null;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">System Settings</h2>
        <p className="text-slate-400 text-lg">Configure your identity and Gemini API preferences.</p>
      </div>

      <div className="space-y-8">
        {/* API Credentials */}
        <section className="bg-[#111a22] border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <span className="material-symbols-outlined text-primary">key</span>
             <h3 className="text-xl font-bold text-white">API Credentials</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Gemini API Key</label>
              <div className="flex items-center gap-3">
                 <input 
                    type="password" 
                    value="AIzaSyA_XXXXXXXXXXXXXXXXXXXXX" 
                    readOnly
                    className="flex-1 bg-slate-900 border-slate-800 rounded-xl text-slate-300 font-mono text-sm"
                  />
                  <button className="bg-slate-800 text-slate-400 px-4 py-2 rounded-xl text-sm font-bold hover:text-white transition-colors">UPDATE</button>
              </div>
            </div>
          </div>
        </section>

        {/* User Profile */}
        <section className="bg-[#111a22] border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <span className="material-symbols-outlined text-primary">account_circle</span>
             <h3 className="text-xl font-bold text-white">Architect Identity</h3>
          </div>
          <div className="p-8 flex items-center gap-8">
             <div className="size-24 rounded-full border-4 border-primary/20 p-1">
                <img src={user?.avatar} alt="Avatar" className="size-full rounded-full object-cover" />
             </div>
             <div className="space-y-2 flex-1">
                <div className="grid grid-cols-2 gap-4">
                   <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Full Name</label>
                      <input value={user?.name} className="bg-slate-900 border-slate-800 rounded-lg text-white" readOnly />
                   </div>
                   <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Email</label>
                      <input value={user?.email} className="bg-slate-900 border-slate-800 rounded-lg text-white" readOnly />
                   </div>
                </div>
             </div>
          </div>
        </section>

        <div className="flex justify-end pt-6">
           <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
             SAVE CONFIGURATION
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
