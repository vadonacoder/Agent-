
import React from 'react';

const History: React.FC = () => {
  const historyItems = [
    { id: '1', date: '2024-05-20 14:30', project: 'E-commerce App', action: 'Deployment Success', target: 'Android APK' },
    { id: '2', date: '2024-05-20 12:15', project: 'Portfolio Site', action: 'Blueprint Generated', tokens: 4201 },
    { id: '3', date: '2024-05-19 18:45', project: 'Inventory Manager', action: 'Manual Code Fix', file: 'Auth.tsx' },
    { id: '4', date: '2024-05-19 10:20', project: 'E-commerce App', action: 'Build Failure', error: 'NullPointerException' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">Audit Logs</h2>
        <p className="text-slate-400 text-lg">Track every decision and generation from the AI Architect.</p>
      </div>

      <div className="bg-[#111a22] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-800">
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6">Project</th>
                  <th className="px-8 py-6">Action</th>
                  <th className="px-8 py-6">Outcome</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
               {historyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer">
                     <td className="px-8 py-6 text-sm text-slate-500 font-mono">{item.date}</td>
                     <td className="px-8 py-6 font-bold text-white">{item.project}</td>
                     <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {item.action}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-sm text-slate-400 italic">
                        {item.target || item.tokens || item.file || item.error}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default History;
