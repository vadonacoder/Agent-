
import React, { useState, useEffect } from 'react';
import { AppView, Project, User } from './types';
import Workspace from './views/Workspace';
import Dashboard from './views/Dashboard';
import Studio from './views/Studio';
import BuildCenter from './views/BuildCenter';
import Settings from './views/Settings';
import History from './views/History';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WORKSPACE);
  const [user, setUser] = useState<User | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Simulation of session restoration
  useEffect(() => {
    const savedUser = localStorage.getItem('gemini_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('gemini_user', JSON.stringify(userData));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleCreateProject = (name: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: 'AI Generated Project',
      lastEdited: new Date().toISOString(),
      type: 'React App',
      status: 'draft',
      files: []
    };
    setProjects([...projects, newProject]);
    setActiveProject(newProject);
    setCurrentView(AppView.STUDIO);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.WORKSPACE:
        return <Workspace onLogin={handleLogin} />;
      case AppView.DASHBOARD:
        return <Dashboard projects={projects} onCreateProject={handleCreateProject} onSelectProject={(p) => { setActiveProject(p); setCurrentView(AppView.STUDIO); }} />;
      case AppView.STUDIO:
      case AppView.CODE:
      case AppView.PREVIEW:
        return activeProject ? <Studio project={activeProject} onUpdateProject={setActiveProject} /> : <Dashboard projects={projects} onCreateProject={handleCreateProject} onSelectProject={setActiveProject} />;
      case AppView.BUILD:
        return <BuildCenter project={activeProject} />;
      case AppView.SETTINGS:
        return <Settings user={user} />;
      case AppView.HISTORY:
        return <History />;
      default:
        return <Workspace onLogin={handleLogin} />;
    }
  };

  if (currentView === AppView.WORKSPACE) {
    return <Workspace onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      user={user}
      activeProject={activeProject}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
