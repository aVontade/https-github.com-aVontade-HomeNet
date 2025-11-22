import React from 'react';
import { Bell, Search, Moon, Sun, User } from 'lucide-react';

interface TopBarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  title?: string;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ darkMode, toggleDarkMode, title = "Welcome Home", subtitle = "Here's what's happening today" }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 bg-transparent">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-display tracking-tight">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 w-64 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search devices..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2.5 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-card"></span>
        </button>

        <button className="hidden sm:flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            AH
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Alex</span>
        </button>
      </div>
    </header>
  );
};