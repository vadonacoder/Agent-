
import React, { useState } from 'react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onCreateProject: (name: string) => void;
  onSelectProject: (p: Project) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onCreateProject, onSelectProject }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName);
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-white tracking-tight">Project Dashboard</h2>
        <p className="text-slate-400 text-lg font-medium">Manage and monitor your AI software builds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Create New Project Card */}
        <div 
          onClick={() => setIsCreating(true)}
          className="group relative h-[280px] border-2 border-dashed border-primary/40 bg-primary/5 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-primary/10 transition-all hover:border-primary"
        >
          {isCreating ? (
            <div className="p-6 w-full space-y-4" onClick={(e) => e.stopPropagation()}>
              <input 
                autoFocus
                type="text"
                placeholder="Project Name..."
                className="w-full bg-slate-900 border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:ring-primary"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleCreate}
                  className="flex-1 bg-primary text-white py-2 rounded-lg font-bold"
                >
                  Create
                </button>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="px-4 bg-slate-800 text-slate-400 py-2 rounded-lg font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="size-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">add</span>
              </div>
              <p className="text-primary font-black text-xl">NEW PROJECT</p>
            </>
          )}
        </div>

        {/* Project Cards */}
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group relative h-[280px] bg-[#111a22] border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5"
          >
            <div className="h-2/5 bg-slate-800/50 flex items-center justify-center relative overflow-hidden">
               <span className="material-symbols-outlined text-slate-700 text-5xl">deployed_code</span>
               <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    project.status === 'deployed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {project.status}
                  </span>
               </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-white font-bold text-xl truncate">{project.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between pt-4">
                 <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                   Edited {new Date(project.lastEdited).toLocaleDateString()}
                 </span>
                 <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
