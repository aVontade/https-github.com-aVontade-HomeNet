import React from 'react';
import { User, Moon, Sun, Bell, Cloud, Shield, LogOut, Trash2, RefreshCw, ChevronRight, Smartphone, Wifi } from 'lucide-react';

interface SettingsPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your profile, preferences, and system.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Menu */}
        <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-dark-card">
                        AH
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-blue-700 transition-colors">
                        <User size={14} />
                    </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Alex Hartman</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">alex.hartman@example.com</p>
                
                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-dark-bg p-3 rounded-xl">
                        <span className="block text-2xl font-bold text-primary">14</span>
                        <span className="text-xs text-gray-500">Devices</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-bg p-3 rounded-xl">
                        <span className="block text-2xl font-bold text-purple-500">3</span>
                        <span className="text-xs text-gray-500">Hubs</span>
                    </div>
                </div>

                <button className="w-full py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    Edit Profile
                </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-4 border border-gray-200 dark:border-gray-700 space-y-1">
                 <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-gray-400" />
                        Mobile App
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                 </button>
                 <button className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                        <Wifi size={18} className="text-gray-400" />
                        Network Map
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                 </button>
            </div>
        </div>

        {/* Right Column: Settings Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* App Preferences */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5">
                    <h3 className="font-bold text-gray-900 dark:text-white">App Preferences</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {/* Dark Mode */}
                    <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-purple-900/20 text-purple-400' : 'bg-amber-100 text-amber-600'}`}>
                                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Appearance</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* Notifications */}
                    <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500">
                                <Bell size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Alerts for security and automation</p>
                            </div>
                        </div>
                         <button className="text-sm font-medium text-primary hover:underline">Configure</button>
                    </div>

                    {/* Integrations */}
                    <div className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                <Cloud size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Cloud Integrations</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">eWeLink, Tuya, SmartThings</p>
                            </div>
                        </div>
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            2 Active
                         </span>
                    </div>
                </div>
            </div>

            {/* System Settings */}
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5">
                    <h3 className="font-bold text-gray-900 dark:text-white">System</h3>
                </div>
                <div className="p-5 space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Firmware Version</span>
                        </div>
                        <span className="font-mono text-sm text-gray-500">v1.2.0-beta</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <RefreshCw size={20} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Updates</span>
                        </div>
                        <span className="text-sm text-green-500 font-medium">Enabled</span>
                    </div>
                    <button className="w-full py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Check for Updates
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
                <h3 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                    <Trash2 size={18} /> Danger Zone
                </h3>
                <p className="text-sm text-red-600/70 dark:text-red-400/70 mb-4">
                    These actions are irreversible. Proceed with caution.
                </p>
                <div className="flex gap-4">
                     <button className="px-4 py-2 bg-white dark:bg-dark-card border border-red-200 dark:border-red-900/30 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm">
                        Clear Cache
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
                        Factory Reset
                    </button>
                </div>
            </div>

            <div className="text-center pt-4">
                <button className="text-gray-500 hover:text-red-500 transition-colors inline-flex items-center gap-2 font-medium">
                    <LogOut size={18} /> Sign Out
                </button>
                <p className="text-xs text-gray-400 mt-2">HomeNet Smart Control © 2024</p>
            </div>
        </div>
      </div>
    </div>
  );
};