import React from 'react';
import { Search, Book, MessageCircle, Shield, Wifi, Smartphone } from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const categories = [
    { icon: Smartphone, title: 'Adding New Devices', desc: 'Learn how to discover and pair devices' },
    { icon: Wifi, title: 'Connectivity Issues', desc: 'Troubleshoot network and hub connections' },
    { icon: Shield, title: 'Security & Privacy', desc: 'Managing access and data policies' },
    { icon: Book, title: 'Automation Guides', desc: 'Creating complex scenes and rules' },
  ];

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How can we help you?</h1>
        <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search for answers..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 dark:text-white"
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
        {categories.map((cat, i) => (
            <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{cat.desc}</p>
            </div>
        ))}
      </div>

      <div className="bg-primary/5 dark:bg-dark-card rounded-2xl p-8 max-w-5xl mx-auto text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Still need help?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Our support team is available 24/7 to assist you.</p>
          <button className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2">
              <MessageCircle size={20} />
              Contact Support
          </button>
      </div>
    </div>
  );
};