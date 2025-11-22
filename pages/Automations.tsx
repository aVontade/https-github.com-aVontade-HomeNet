import React from 'react';
import { Clock, Sun, Moon, LogIn, Plus, Trash2, Edit2 } from 'lucide-react';
import { Automation } from '../types';

interface AutomationsProps {
  automations: Automation[];
}

export const Automations: React.FC<AutomationsProps> = ({ automations }) => {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Automations</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your smart home rules and scenes.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            Create Automation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-white/5 transition-all group min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-gray-400 group-hover:text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">New Routine</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Trigger actions based on time or events</p>
        </div>

        {automations.map((automation) => (
            <div key={automation.id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 relative group hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl">
                        {automation.trigger === 'time' && <Clock size={24} />}
                        {automation.trigger === 'sunset' && <Moon size={24} />}
                        {automation.trigger === 'sunrise' && <Sun size={24} />}
                        {automation.trigger === 'arrival' && <LogIn size={24} />}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
                            <Edit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{automation.name}</h3>
                
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">WHEN</span>
                        <span>{automation.time || 'Sunset'}</span>
                        {automation.days && <span className="text-gray-400">• {automation.days.join(', ')}</span>}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs mt-0.5">DO</span>
                        <ul className="list-disc list-inside text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {automation.actions.map((action, i) => (
                                <li key={i}>{action}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${automation.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
                        {automation.active ? 'ACTIVE' : 'PAUSED'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={automation.active} readOnly className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};