import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  History, 
  Settings, 
  HelpCircle, 
  PlusCircle,
  Smartphone,
  Zap
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onAddDevice: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onAddDevice }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { view: AppView.DEVICES, icon: Smartphone, label: 'Devices' },
    { view: AppView.AUTOMATIONS, icon: Zap, label: 'Automations' },
    { view: AppView.HISTORY, icon: History, label: 'History' },
    { view: AppView.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">HomeNet</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Smart Control</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                currentView === item.view
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={currentView === item.view ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors'} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-4">
          <button 
            onClick={onAddDevice}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            <PlusCircle size={20} />
            Add Device
          </button>
          
          <button 
            onClick={() => setView(AppView.HELP)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <HelpCircle size={18} />
            Help & Support
          </button>
        </div>
      </div>
    </aside>
  );
};