import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { DevicesPage } from './pages/Devices';
import { AddDeviceModal } from './pages/Onboarding';
import { Automations } from './pages/Automations';
import { HelpCenter } from './pages/HelpCenter';
import { SettingsPage } from './pages/Settings';
import { AppView, Device, DeviceType, Automation } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [darkMode, setDarkMode] = useState(true); 
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  
  // Mock Data with detailed metadata
  const [devices, setDevices] = useState<Device[]>([
    { 
        id: '1', 
        name: 'Living Room Lights', 
        type: DeviceType.LIGHT, 
        room: 'Living Room', 
        status: 'on', 
        value: '80%', 
        connectionType: 'zigbee',
        serialNumber: 'LGT-2290-X1',
        ipAddress: 'N/A (Zigbee)',
        modelNumber: 'HUE-A19-W'
    },
    { 
        id: '2', 
        name: 'Kitchen Plug', 
        type: DeviceType.PLUG, 
        room: 'Kitchen', 
        status: 'off', 
        connectionType: 'wifi',
        serialNumber: 'PLG-8821-V2',
        ipAddress: '192.168.1.105',
        modelNumber: 'TP-LINK-HS103'
    },
    { 
        id: '3', 
        name: 'Thermostat', 
        type: DeviceType.THERMOSTAT, 
        room: 'Hallway', 
        status: 'on', 
        value: '22°C', 
        connectionType: 'wifi',
        serialNumber: 'THM-NEST-G3',
        ipAddress: '192.168.1.110',
        modelNumber: 'NEST-LEARN-V3'
    },
    { 
        id: '4', 
        name: 'Front Door Lock', 
        type: DeviceType.LOCK, 
        room: 'Entrance', 
        status: 'off', 
        value: 'Locked', 
        battery: 92, 
        connectionType: 'zigbee',
        serialNumber: 'LCK-AUG-440',
        ipAddress: 'N/A (Zigbee)',
        modelNumber: 'AUG-WIFI-SMT'
    },
    { 
        id: '5', 
        name: 'Bedroom Fan', 
        type: DeviceType.PLUG, 
        room: 'Bedroom', 
        status: 'off', 
        connectionType: 'wifi',
        serialNumber: 'PLG-SON-B1',
        ipAddress: '192.168.1.108',
        modelNumber: 'SONOFF-S31'
    },
    { 
        id: '6', 
        name: 'Window Sensor', 
        type: DeviceType.SENSOR, 
        room: 'Living Room', 
        status: 'on', 
        value: 'Closed', 
        connectionType: 'zigbee',
        serialNumber: 'SNS-AQARA-D1',
        ipAddress: 'N/A (Zigbee)',
        modelNumber: 'MCCGQ11LM'
    },
  ]);

  const [automations] = useState<Automation[]>([
      { id: '1', name: 'Good Morning', active: true, trigger: 'time', time: '07:00 AM', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], actions: ['Turn on Bedroom Lights', 'Set Thermostat to 22°C', 'Open Blinds'] },
      { id: '2', name: 'Movie Night', active: false, trigger: 'manual', actions: ['Dim Living Room Lights to 20%', 'Turn on TV', 'Set LED Strip to Blue'] },
      { id: '3', name: 'Away Mode', active: true, trigger: 'gps', actions: ['Lock Front Door', 'Turn off all lights', 'Arm Security System'] }
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, status: d.status === 'on' ? 'off' : 'on' } : d
    ));
  };

  const handleAddDevices = (newDevices: Device[]) => {
    setDevices(prev => {
      const existingIds = new Set(prev.map(d => d.id));
      const uniqueNewDevices = newDevices.filter(d => !existingIds.has(d.id));
      return [...prev, ...uniqueNewDevices];
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard devices={devices} toggleDevice={toggleDevice} />;
      case AppView.DEVICES:
        return <DevicesPage devices={devices} />;
      case AppView.AUTOMATIONS:
        return <Automations automations={automations} />;
      case AppView.SETTINGS:
        return <SettingsPage darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />;
      case AppView.HELP:
        return <HelpCenter />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p>The {currentView} page is under construction.</p>
            <button 
                onClick={() => setCurrentView(AppView.DASHBOARD)}
                className="mt-4 text-primary hover:underline"
            >
                Return to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onAddDevice={() => setIsAddDeviceOpen(true)}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex-shrink-0">
            <TopBar 
                darkMode={darkMode} 
                toggleDarkMode={() => setDarkMode(!darkMode)} 
                title={currentView === AppView.DASHBOARD ? 'Welcome Home' : undefined}
                subtitle={currentView === AppView.DASHBOARD ? "Here's what's happening today" : undefined}
            />
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar pb-20">
            {renderContent()}
        </div>
      </main>

      <AddDeviceModal 
        isOpen={isAddDeviceOpen} 
        onClose={() => setIsAddDeviceOpen(false)} 
        onAddDevices={handleAddDevices}
      />
    </div>
  );
}

export default App;