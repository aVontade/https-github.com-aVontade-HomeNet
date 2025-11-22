import React, { useState } from 'react';
import { Shield, Thermometer, Video, Lightbulb, Power, Lock, Wind, Plus, MoreVertical, PlayCircle, MessageSquare } from 'lucide-react';
import { Device, DeviceType } from '../types';
import { chatWithAssistant } from '../services/geminiService';

interface DashboardProps {
  devices: Device[];
  toggleDevice: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ devices, toggleDevice }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [securityMode, setSecurityMode] = useState<'Home' | 'Away' | 'Sleep'>('Away');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantResponse, setAssistantResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleAssistantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;
    
    setIsThinking(true);
    setAssistantResponse(null);
    
    const response = await chatWithAssistant(assistantInput);
    setAssistantResponse(response);
    setIsThinking(false);
    setAssistantInput('');
  };

  const activeDevicesCount = devices.filter(d => d.status === 'on').length;

  return (
    <div className="p-6 md:p-8 pt-0 space-y-8 animate-in fade-in duration-500">
      
      {/* Quick Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Security Card */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-shrink-0 relative">
                     <div className={`w-32 h-32 rounded-full flex items-center justify-center ${securityMode === 'Away' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500'} transition-colors duration-300`}>
                        <Shield size={64} className="drop-shadow-sm" />
                     </div>
                     <div className="absolute -bottom-2 -right-2 bg-white dark:bg-dark-card px-3 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-sm">
                        {securityMode}
                     </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Security Status</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">System is currently armed in <strong className={securityMode === 'Away' ? "text-red-500" : "text-green-500"}>{securityMode} Mode</strong>. All sensors are active and monitoring.</p>
                    
                    <div className="inline-flex bg-gray-100 dark:bg-dark-bg rounded-lg p-1">
                        {(['Home', 'Away', 'Sleep'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setSecurityMode(mode)}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    securityMode === mode 
                                    ? 'bg-white dark:bg-dark-card text-primary shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Climate Card */}
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Climate</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Indoor Temperature</p>
                </div>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-lg">
                    <Thermometer size={24} />
                </div>
             </div>
             
             <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-white font-display">21.5</span>
                <span className="text-xl text-gray-400 mb-2">°C</span>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Humidity</span>
                    <span className="font-semibold text-gray-900 dark:text-white">45%</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Air Quality</span>
                    <span className="font-semibold text-green-500">Good</span>
                </div>
             </div>
        </div>
      </div>

      {/* Live Cameras */}
      <div>
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Cameras</h2>
             <button className="text-primary text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { name: 'Front Door', img: 'https://picsum.photos/400/225?random=1' },
                { name: 'Backyard', img: 'https://picsum.photos/400/225?random=2' },
                { name: 'Living Room', img: 'https://picsum.photos/400/225?random=3' }
            ].map((cam, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                    <img src={cam.img} alt={cam.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <PlayCircle size={48} className="text-white opacity-80" />
                    </div>
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        Live
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="text-white font-medium text-sm">{cam.name}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Quick Access Devices */}
      <div>
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Access</h2>
             <div className="flex gap-2">
                 {['All', 'Lights', 'Plugs'].map(tab => (
                     <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            activeTab === tab 
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent' 
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
                        }`}
                     >
                        {tab}
                     </button>
                 ))}
             </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {devices.filter(d => activeTab === 'All' || d.type.includes(activeTab.toLowerCase().slice(0, -1))).map((device) => (
                <div key={device.id} className={`bg-white dark:bg-dark-card border rounded-2xl p-5 transition-all duration-200 hover:shadow-md ${device.status === 'on' ? 'border-primary dark:border-primary/50' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-full ${
                            device.status === 'on' 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}>
                            {device.type === DeviceType.LIGHT && <Lightbulb size={20} />}
                            {device.type === DeviceType.PLUG && <Power size={20} />}
                            {device.type === DeviceType.LOCK && <Lock size={20} />}
                            {device.type === DeviceType.THERMOSTAT && <Thermometer size={20} />}
                            {device.type === DeviceType.SENSOR && <Shield size={20} />}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{device.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{device.room}</p>
                    
                    <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${device.status === 'on' ? 'text-primary' : 'text-gray-400'}`}>
                            {device.status === 'on' ? 'On' : 'Off'} {device.value ? `• ${device.value}` : ''}
                        </span>
                        
                        <button 
                            onClick={() => toggleDevice(device.id)}
                            className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${
                                device.status === 'on' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                device.status === 'on' ? 'translate-x-4' : 'translate-x-0'
                            }`}></div>
                        </button>
                    </div>
                </div>
            ))}
            
            <button className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all min-h-[160px]">
                <Plus size={32} className="mb-2" />
                <span className="text-sm font-medium">Add Device</span>
            </button>
        </div>
      </div>

      {/* Floating Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {assistantOpen && (
            <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        AI Assistant
                    </h3>
                    <button onClick={() => setAssistantOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-bg p-3 rounded-lg mb-4 text-sm text-gray-600 dark:text-gray-300 min-h-[60px] max-h-[200px] overflow-y-auto">
                    {isThinking ? (
                        <div className="flex gap-1 items-center justify-center h-full">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    ) : assistantResponse ? (
                        <p>{assistantResponse}</p>
                    ) : (
                        <p className="text-gray-400 italic text-center">How can I help you today?</p>
                    )}
                </div>

                <form onSubmit={handleAssistantSubmit} className="relative">
                    <input 
                        type="text" 
                        value={assistantInput}
                        onChange={(e) => setAssistantInput(e.target.value)}
                        placeholder="Ask anything..." 
                        className="w-full bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white"
                    />
                    <button type="submit" className="absolute right-2 top-1.5 text-primary hover:text-blue-700 p-1">
                        <MessageSquare size={16} />
                    </button>
                </form>
            </div>
        )}
        <button 
            onClick={() => setAssistantOpen(!assistantOpen)}
            className="w-14 h-14 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all flex items-center justify-center"
        >
            <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
};