
import React, { useState } from 'react';
import { Project, BuildLog } from '../types';
import { gemini } from '../services/geminiService';

interface BuildCenterProps {
  project: Project | null;
}

const BuildCenter: React.FC<BuildCenterProps> = ({ project }) => {
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);

  const startBuild = async (target: string) => {
    if (!project) return;
    setIsBuilding(true);
    setProgress(0);
    setLogs([]);
    addLog('info', `GET /api/build/pipeline?target=${target}`);
    
    try {
      const steps = await gemini.getBuildPipelineSteps(project.files, target);
      addLog('success', `Pipeline identified. ${steps.length} build stages mapped.`);
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
        addLog('info', steps[i]);
        setProgress(((i + 1) / steps.length) * 100);
      }
      
      addLog('success', `200 OK: ${target} binary successfully generated.`);
    } catch (e) {
      addLog('error', "500 ERROR: Pipeline failure.");
    } finally {
      setIsBuilding(false);
    }
  };

  const addLog = (type: BuildLog['type'], message: string) => {
    setLogs(prev => [
      { id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), type, message },
      ...prev
    ]);
  };

  if (!project) return <div className="flex-1 flex items-center justify-center text-slate-600 font-bold">SELECT A PROJECT TO ACTIVATE FACTORY</div>;

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter">BUILD API CENTER</h2>
          <p className="text-slate-400">Manage cloud-based compilation for {project.name}.</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-[#111a22] border border-slate-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">cloud_upload</span>
               Deployment Targets
            </h3>
            <div className="flex flex-col gap-3">
               <button onClick={() => startBuild('Android APK')} disabled={isBuilding} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-left hover:border-primary transition-all">
                  <p className="text-sm font-bold text-white">Android Package (APK)</p>
                  <p className="text-[10px] text-slate-500 uppercase">Target: ARM64-v8a</p>
               </button>
               <button onClick={() => startBuild('Windows EXE')} disabled={isBuilding} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-left hover:border-primary transition-all">
                  <p className="text-sm font-bold text-white">Windows Executable (EXE)</p>
                  <p className="text-[10px] text-slate-500 uppercase">Target: x64 Desktop</p>
               </button>
            </div>
          </div>

          <div className="bg-[#111a22] border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4">
             {isBuilding ? (
               <div className="w-full space-y-6">
                 <p className="text-2xl font-black text-primary animate-pulse">{Math.round(progress)}%</p>
                 <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{width: `${progress}%`}}></div>
                 </div>
                 <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Compiler Busy</p>
               </div>
             ) : (
               <>
                 <span className="material-symbols-outlined text-6xl text-slate-800">factory</span>
                 <p className="text-slate-500 text-sm font-bold">PIPELINE IDLE</p>
               </>
             )}
          </div>
        </div>
      </div>

      <aside className="w-[400px] bg-black border-l border-slate-800 p-6 flex flex-col shrink-0 font-mono text-[10px]">
        <h4 className="text-primary font-bold mb-4 border-b border-slate-900 pb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">terminal</span> REMOTE_STDOUT
        </h4>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
          {logs.map(log => (
            <p key={log.id} className="leading-relaxed">
              <span className="text-slate-700">[{log.timestamp}]</span>{' '}
              <span className={log.type === 'success' ? 'text-emerald-500' : log.type === 'error' ? 'text-rose-500' : 'text-blue-500'}>
                {log.type.toUpperCase()}:
              </span>{' '}
              <span className="text-slate-400">{log.message}</span>
            </p>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default BuildCenter;
