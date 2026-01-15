
import React, { useState, useEffect } from 'react';
import { Project, DeviceMode, ProjectFile } from '../types';
import { gemini } from '../services/geminiService';

interface StudioProps {
  project: Project;
  onUpdateProject: (p: Project) => void;
}

const Studio: React.FC<StudioProps> = ({ project, onUpdateProject }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [device, setDevice] = useState<DeviceMode>(DeviceMode.PC);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>(["Factory linked to Gemini 3 Pro API.", "Awaiting architect blueprint..."]);

  useEffect(() => {
    if (project.files.length > 0 && !activeFile) {
      setActiveFile(project.files[0].path);
    }
  }, [project.files]);

  const addLog = (msg: string) => {
    setAgentLogs(prev => [...prev.slice(-10), `> ${msg}`]);
  };

  const parseAIResponse = (text: string): ProjectFile[] => {
    const files: ProjectFile[] = [];
    const parts = text.split(/\[FILE: (.*?)\]/);
    if (parts[0].trim()) files.push({ path: 'README.md', content: parts[0].trim(), language: 'markdown' });
    for (let i = 1; i < parts.length; i += 2) {
      const path = parts[i].trim();
      const content = parts[i + 1]?.trim() || '';
      const ext = path.split('.').pop() || 'typescript';
      files.push({ path, content, language: ext === 'tsx' || ext === 'ts' ? 'typescript' : ext });
    }
    return files.length > 0 ? files : [{ path: 'App.tsx', content: text, language: 'typescript' }];
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    addLog(`POST /api/generate?intent=${encodeURIComponent(prompt.substring(0, 20))}...`);
    
    try {
      const result = await gemini.generateAppBlueprint(prompt);
      const generatedFiles = parseAIResponse(result);
      
      onUpdateProject({
        ...project,
        files: generatedFiles,
        lastEdited: new Date().toISOString(),
        status: 'draft'
      });
      
      setPrompt('');
      setActiveTab('code');
      if (generatedFiles.length > 0) setActiveFile(generatedFiles[0].path);
      addLog("200 OK: Project architecture received.");
    } catch (error) {
      addLog("500 ERROR: API connection lost.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiAction = async (action: 'explain' | 'refactor') => {
    if (!activeFile) return;
    const file = project.files.find(f => f.path === activeFile);
    if (!file) return;

    setIsGenerating(true);
    addLog(`POST /api/${action}?file=${activeFile}`);
    
    try {
      if (action === 'refactor') {
         const result = await gemini.refactorCode(activeFile, file.content);
         onUpdateProject({
           ...project,
           files: project.files.map(f => f.path === activeFile ? { ...f, content: result } : f)
         });
         addLog("200 OK: Code refactored.");
      } else {
        const explanation = await gemini.explainCode(file.content);
        alert(explanation);
        addLog("200 OK: Explanation generated.");
      }
    } catch (e) {
      addLog("Action failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentFileContent = project.files.find(f => f.path === activeFile)?.content || '';

  return (
    <div className="flex-1 flex overflow-hidden">
      <aside className="w-64 border-r border-slate-800 bg-[#0b1219] flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace Explorer</span>
          <span className="material-symbols-outlined text-sm text-slate-600">sync</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {project.files.map((file) => (
            <button
              key={file.path}
              onClick={() => setActiveFile(file.path)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center gap-3 transition-all ${
                activeFile === file.path ? 'bg-primary/20 text-primary font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {file.path.endsWith('.md') ? 'description' : 'code'}
              </span>
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </div>
        <div className="h-40 border-t border-slate-800 bg-black/40 p-3 font-mono text-[9px] overflow-hidden flex flex-col">
           <p className="text-primary mb-2 border-b border-slate-800 pb-1 font-bold">STDOUT / API_LOGS</p>
           <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
              {agentLogs.map((log, i) => (
                <p key={i} className="text-slate-500">{log}</p>
              ))}
           </div>
        </div>
      </aside>

      <section className="flex-1 flex flex-col bg-[#0f172a] relative">
        <div className="h-14 border-b border-slate-800 bg-[#111a22] flex items-center justify-between px-6 shrink-0">
           <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl">
             <button onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${activeTab === 'preview' ? 'bg-primary text-white' : 'text-slate-500'}`}>PREVIEW</button>
             <button onClick={() => setActiveTab('code')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${activeTab === 'code' ? 'bg-primary text-white' : 'text-slate-500'}`}>CODE</button>
           </div>
           <div className="flex items-center gap-4">
              {activeTab === 'code' && (
                <div className="flex gap-2">
                   <button onClick={() => handleAiAction('explain')} className="text-[10px] font-black text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded flex items-center gap-2">
                     <span className="material-symbols-outlined text-xs">help</span> EXPLAIN
                   </button>
                   <button onClick={() => handleAiAction('refactor')} className="text-[10px] font-black text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded flex items-center gap-2">
                     <span className="material-symbols-outlined text-xs">auto_fix</span> REFACTOR
                   </button>
                </div>
              )}
           </div>
        </div>

        <div className="flex-1 p-6 overflow-hidden flex flex-col">
           {activeTab === 'preview' ? (
              <div className="flex-1 bg-white rounded-3xl border-[10px] border-slate-900 shadow-2xl overflow-hidden flex items-center justify-center">
                 {project.files.length > 0 ? (
                   <div className="text-center p-10">
                      <div className="size-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">{project.name} Active</h2>
                      <p className="text-slate-500 mt-2 max-w-sm">The application components have been successfully rendered in the virtual environment.</p>
                   </div>
                 ) : (
                   <p className="text-slate-300 font-bold uppercase tracking-widest animate-pulse">Waiting for API instructions...</p>
                 )}
              </div>
           ) : (
             <div className="flex-1 bg-[#0b1219] rounded-2xl border border-slate-800 font-mono p-6 overflow-y-auto custom-scrollbar text-slate-300 text-sm">
                <pre><code>{currentFileContent || "// Prompt the architect to generate source code..."}</code></pre>
             </div>
           )}
        </div>

        <div className="p-6 bg-[#111a22]/80 border-t border-slate-800">
           <div className="max-w-4xl mx-auto flex gap-4 bg-slate-900 border border-slate-700 p-2 rounded-2xl">
              <textarea 
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-4 h-14 resize-none text-slate-200"
                placeholder="Talk to the architect... (e.g. 'Add a user profile page with editable fields')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="bg-primary text-white size-14 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                {isGenerating ? <span className="animate-spin material-symbols-outlined">sync</span> : <span className="material-symbols-outlined">rocket_launch</span>}
              </button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Studio;
