
export enum AppView {
  WORKSPACE = 'workspace',
  DASHBOARD = 'dashboard',
  STUDIO = 'studio',
  CODE = 'code',
  PREVIEW = 'preview',
  BUILD = 'build',
  SETTINGS = 'settings',
  HISTORY = 'history',
}

export enum DeviceMode {
  PC = 'PC',
  WEB = 'Web',
  MOBILE = 'Mobile',
}

export interface Project {
  id: string;
  name: string;
  description: string;
  lastEdited: string;
  type: string;
  status: 'draft' | 'deployed' | 'error';
  files: ProjectFile[];
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface BuildLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  apiKey?: string;
}
