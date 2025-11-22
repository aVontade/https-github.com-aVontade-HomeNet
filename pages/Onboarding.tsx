import React, { useState } from 'react';
import { Check, ChevronRight, Wifi, Home, Zap, Loader2, ArrowLeft, Radio, X, Lock, Router, Settings } from 'lucide-react';
import { generateAutomationSuggestion } from '../services/geminiService';
import { Device, DeviceType } from '../types';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevices: (devices: Device[]) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onAddDevices }) => {
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [showNetworkForm, setShowNetworkForm] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [addedSuggestions, setAddedSuggestions] = useState<number[]>([]);

  // Network Credentials State
  const [networkCreds, setNetworkCreds] = useState({
      ssid: 'Home_Network_5G',
      password: '',
      scanEthernet: false,
      routerIp: '192.168.1.1',
      routerUser: 'admin',
      routerPass: ''
  });

  if (!isOpen) return null;

  // Helper to generate realistic IPs based on the user's router input
  const getSubnetPrefix = (routerIp: string) => {
      const parts = routerIp.split('.');
      if (parts.length === 4) {
          return `${parts[0]}.${parts[1]}.${parts[2]}`;
      }
      return '192.168.1';
  };

  const generateSerial = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const generateMac = () => "XX:XX:XX:XX:XX:XX".replace(/X/g, function() {
    return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
  });

  const startScan = () => {
    setIsScanning(true);
    setShowNetworkForm(false);
    setDiscoveredDevices([]); // Clear previous
    
    const subnet = getSubnetPrefix(networkCreds.routerIp);
    
    // Simulate Network Scan Progress
    setTimeout(() => {
        const newDevices: Device[] = [];

        // 1. Always find the Router/Gateway itself if credentials were provided
        if (networkCreds.routerUser) {
            newDevices.push({
                id: `dev-${Date.now()}-gw`,
                name: 'Network Gateway / Router',
                type: DeviceType.HUB,
                room: 'Utility',
                status: 'online',
                connectionType: 'ethernet',
                serialNumber: generateMac(), // MAC address as serial for routers usually
                ipAddress: networkCreds.routerIp,
                modelNumber: 'RT-AX86U' // Generic high-end router model
            });
        }

        // 2. Randomly find Wi-Fi devices on the provided subnet
        const potentialWifiDevices = [
            { name: 'Kitchen Smart Plug', type: DeviceType.PLUG, model: 'TP-LINK-HS110', prefix: 'PLG' },
            { name: 'Bedroom LED Strip', type: DeviceType.LIGHT, model: 'LIFX-Z-STRIP', prefix: 'LFX' },
            { name: 'Garage Cam', type: DeviceType.CAMERA, model: 'WYZE-CAM-V3', prefix: 'CAM' },
            { name: 'Living Room Sonos', type: DeviceType.SPEAKER, model: 'SONOS-ONE-GEN2', prefix: 'SPK' },
            { name: 'Main Thermostat', type: DeviceType.THERMOSTAT, model: 'ECOBEE-SMART', prefix: 'THM' }
        ];

        // Randomly select 2-4 devices to "find"
        const numToFind = Math.floor(Math.random() * 3) + 2;
        const shuffled = potentialWifiDevices.sort(() => 0.5 - Math.random());

        for (let i = 0; i < numToFind; i++) {
            const template = shuffled[i];
            newDevices.push({
                id: `dev-${Date.now()}-${i}`,
                name: template.name,
                type: template.type,
                room: 'Unassigned',
                status: 'on', // Assume powered on if found
                connectionType: 'wifi',
                serialNumber: generateSerial(template.prefix),
                ipAddress: `${subnet}.${Math.floor(Math.random() * 200) + 10}`, // Realistic IP in subnet
                modelNumber: template.model
            });
        }

        // 3. If Ethernet scan was enabled, find a specific wired Hub/Bridge
        if (networkCreds.scanEthernet) {
            newDevices.push({
                id: `dev-${Date.now()}-eth-hue`,
                name: 'Philips Hue Bridge',
                type: DeviceType.HUB,
                room: 'Living Room',
                status: 'online',
                connectionType: 'ethernet',
                serialNumber: '001788FFFE2345', // Realistic Hue Bridge ID format
                ipAddress: `${subnet}.5`, // Hubs usually at low IPs
                modelNumber: 'BSB002'
            });
            
            // Maybe a NAS or TV
            newDevices.push({
                id: `dev-${Date.now()}-eth-tv`,
                name: 'Smart TV (Ethernet)',
                type: DeviceType.LIGHT, // Using LIGHT as generic/screen
                room: 'Living Room',
                status: 'off',
                connectionType: 'ethernet',
                serialNumber: generateSerial('TV'),
                ipAddress: `${subnet}.15`, 
                modelNumber: 'LG-OLED-C1'
            });
        }

        setDiscoveredDevices(newDevices);
        setIsScanning(false);
        setStep(3);
    }, 3500); // 3.5s simulated scan time
  };

  const startPairing = () => {
    setIsPairing(true);
    setTimeout(() => {
        const newDevices: Device[] = [
            { 
                id: `dev-${Date.now()}-pair`, 
                name: 'New Zigbee Bulb', 
                type: DeviceType.LIGHT, 
                room: 'Bedroom', 
                status: 'on', 
                value: '100%', 
                connectionType: 'zigbee',
                serialNumber: generateSerial('ZIG'),
                ipAddress: 'N/A (Zigbee Mesh)',
                modelNumber: 'TRADFRI-E27-WS' 
            }
        ];
        setDiscoveredDevices(newDevices);
        setIsPairing(false);
        setStep(3);
    }, 4000);
  };

  const getAiHelp = async () => {
      setIsLoadingAi(true);
      const deviceNames = discoveredDevices.map(d => d.name);
      const namesToUse = deviceNames.length > 0 ? deviceNames : ["Smart Light", "Smart Plug"];
      const suggestions = await generateAutomationSuggestion(namesToUse);
      setAiSuggestions(suggestions);
      setIsLoadingAi(false);
  };

  const toggleSuggestion = (index: number) => {
    if (addedSuggestions.includes(index)) {
        setAddedSuggestions(addedSuggestions.filter(i => i !== index));
    } else {
        setAddedSuggestions([...addedSuggestions, index]);
    }
  };

  const handleConfirmSetup = () => {
      onAddDevices(discoveredDevices);
      setStep(4);
      getAiHelp();
  };

  const handleClose = () => {
    setStep(1);
    setDiscoveredDevices([]);
    setAiSuggestions([]);
    setAddedSuggestions([]);
    setShowNetworkForm(false);
    onClose();
  };

  const steps = [
    { id: 1, title: 'Connect', icon: Wifi },
    { id: 2, title: 'Discover', icon: Home },
    { id: 3, title: 'Setup', icon: Check },
    { id: 4, title: 'Automate', icon: Zap },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-card w-full max-w-4xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors z-10"
        >
            <X size={24} />
        </button>

        <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-8 pb-0 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New Device</h2>
                <p className="text-gray-500 dark:text-gray-400">Follow the steps to expand your smart home.</p>
            </div>

            {/* Stepper */}
            <div className="flex justify-center items-center my-8 px-12 relative">
                <div className="absolute left-1/4 right-1/4 top-1/2 h-0.5 bg-gray-100 dark:bg-gray-800 -z-10"></div>
                <div className="flex gap-8 md:gap-16">
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-white dark:bg-dark-card px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                step > s.id 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : step === s.id 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'bg-gray-50 dark:bg-dark-surface border-gray-200 dark:border-gray-700 text-gray-400'
                            }`}>
                                {step > s.id ? <Check size={16} /> : <s.icon size={16} />}
                            </div>
                            <span className={`text-xs font-medium ${step === s.id ? 'text-primary' : 'text-gray-500'}`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:px-20 flex flex-col items-center justify-start pb-12">
                
                {step === 1 && (
                    <div className="space-y-6 max-w-md w-full text-center">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mx-auto">
                            <Wifi size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Link Cloud Account</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Connect your eWeLink or Tuya account to import existing devices, or skip to add local devices.</p>
                        </div>
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            Connect eWeLink <ChevronRight size={18} />
                        </button>
                        <button 
                            onClick={() => setStep(2)}
                            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
                        >
                            Skip and scan locally
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-md w-full">
                        {!showNetworkForm ? (
                            <div className="space-y-6 text-center">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className={`absolute inset-0 rounded-full ${isScanning ? 'bg-primary/20 animate-ping' : isPairing ? 'bg-purple-500/20 animate-ping' : 'bg-primary/20'}`}></div>
                                    <div className={`relative w-full h-full rounded-full flex items-center justify-center transition-colors ${isPairing ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                                        {(isScanning || isPairing) ? <Loader2 size={40} className="animate-spin" /> : <Home size={40} />}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {isScanning ? 'Scanning Network...' : isPairing ? 'Pairing Mode Active' : 'Discover Devices'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {isScanning 
                                            ? `Scanning subnet ${getSubnetPrefix(networkCreds.routerIp)}.x for devices...`
                                            : isPairing
                                                ? 'Hub is listening for Zigbee & Bluetooth devices. Put your device in pairing mode.'
                                                : 'Choose a method to find new devices.'}
                                    </p>
                                </div>
                                
                                <div className="space-y-3">
                                    {!isPairing && (
                                        <button 
                                            onClick={() => setShowNetworkForm(true)}
                                            disabled={isScanning}
                                            className="w-full bg-primary hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            {isScanning ? 'Scanning...' : <><Wifi size={20} /> Scan Network</>}
                                        </button>
                                    )}
                                    
                                    {!isScanning && (
                                        <button 
                                            onClick={startPairing}
                                            disabled={isPairing}
                                            className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${
                                                isPairing 
                                                ? 'bg-purple-600 border-purple-600 text-white' 
                                                : 'bg-transparent border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {isPairing ? 'Listening...' : <><Radio size={20} /> Pairing Mode (Zigbee/BT)</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 dark:bg-dark-surface p-6 rounded-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Router size={20} className="text-primary" />
                                        Network Credentials
                                    </h3>
                                    <span className="text-xs text-gray-500 bg-gray-200 dark:bg-dark-bg px-2 py-1 rounded">Required for onboarding</span>
                                </div>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Wi-Fi SSID</label>
                                        <input 
                                            type="text" 
                                            value={networkCreds.ssid}
                                            onChange={(e) => setNetworkCreds({...networkCreds, ssid: e.target.value})}
                                            className="w-full bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Network Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Wi-Fi Password (for provisioning)</label>
                                        <div className="relative">
                                            <input 
                                                type="password" 
                                                value={networkCreds.password}
                                                onChange={(e) => setNetworkCreds({...networkCreds, password: e.target.value})}
                                                className="w-full bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                                placeholder="Enter Password"
                                            />
                                            <Lock size={14} className="absolute right-3 top-3 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <label className="flex items-center gap-2 cursor-pointer mb-4">
                                            <input 
                                                type="checkbox" 
                                                checked={networkCreds.scanEthernet}
                                                onChange={(e) => setNetworkCreds({...networkCreds, scanEthernet: e.target.checked})}
                                                className="rounded text-primary focus:ring-primary bg-white dark:bg-dark-bg border-gray-300 dark:border-gray-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Scan Wired/Ethernet Devices</span>
                                        </label>

                                        {networkCreds.scanEthernet && (
                                            <div className="space-y-3 pl-6 border-l-2 border-gray-200 dark:border-gray-700 animate-in fade-in duration-200">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Router IP Address</label>
                                                    <input 
                                                        type="text" 
                                                        value={networkCreds.routerIp}
                                                        onChange={(e) => setNetworkCreds({...networkCreds, routerIp: e.target.value})}
                                                        className="w-full bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                                                        placeholder="e.g. 192.168.1.1"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Admin User</label>
                                                        <input 
                                                            type="text" 
                                                            value={networkCreds.routerUser}
                                                            onChange={(e) => setNetworkCreds({...networkCreds, routerUser: e.target.value})}
                                                            className="w-full bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                                                            placeholder="admin"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Admin Pass</label>
                                                        <input 
                                                            type="password" 
                                                            value={networkCreds.routerPass}
                                                            onChange={(e) => setNetworkCreds({...networkCreds, routerPass: e.target.value})}
                                                            className="w-full bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowNetworkForm(false)}
                                        className="flex-1 bg-white dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={startScan}
                                        className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Settings size={18} /> Start Scan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 w-full max-w-lg">
                        <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                            <Check size={20} className="bg-green-100 rounded-full p-0.5" />
                            <span className="font-bold">{discoveredDevices.length} Devices Found</span>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {discoveredDevices.map((device) => (
                                <div key={device.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-200 dark:border-gray-700">
                                    <div className="p-2 bg-white dark:bg-dark-surface rounded-lg">
                                        {device.type === DeviceType.LIGHT && <Zap size={20} className="text-yellow-500" />}
                                        {device.type === DeviceType.PLUG && <Zap size={20} className="text-green-500" />}
                                        {device.type === DeviceType.SENSOR && <Wifi size={20} className="text-blue-500" />}
                                        {device.type === DeviceType.HUB && <Router size={20} className="text-purple-500" />}
                                        {!([DeviceType.LIGHT, DeviceType.PLUG, DeviceType.SENSOR, DeviceType.HUB].includes(device.type)) && <Home size={20} className="text-gray-500" />}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{device.name}</p>
                                        <div className="flex flex-col text-xs text-gray-500">
                                            <span className="capitalize">{device.type} • {device.connectionType}</span>
                                            <span className="font-mono opacity-75">{device.ipAddress}</span>
                                        </div>
                                    </div>
                                    <select 
                                        defaultValue={device.room}
                                        className="bg-white dark:bg-dark-surface border-none text-sm rounded-lg py-1 px-2 focus:ring-1 focus:ring-primary text-gray-900 dark:text-white outline-none"
                                    >
                                        <option>Living Room</option>
                                        <option>Kitchen</option>
                                        <option>Bedroom</option>
                                        <option>Hallway</option>
                                        <option>Entrance</option>
                                        <option>Unassigned</option>
                                        <option>Utility</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={handleConfirmSetup}
                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all mt-4"
                        >
                            Confirm Setup
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 max-w-lg w-full text-center">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <Check size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Set!</h2>
                        
                        <div className="bg-gray-50 dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 mb-4">
                                <Zap size={18} className="text-yellow-500" /> AI Suggestions
                            </h3>
                            
                            {isLoadingAi ? (
                                <div className="py-8 text-gray-500 flex flex-col items-center gap-2">
                                    <Loader2 className="animate-spin text-primary" />
                                    <span className="text-sm">Analyzing device capabilities...</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {aiSuggestions.map((suggestion, idx) => {
                                        const isAdded = addedSuggestions.includes(idx);
                                        return (
                                            <div key={idx} className={`bg-white dark:bg-dark-card p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${isAdded ? 'border-green-500/30 ring-1 ring-green-500/10' : 'border-gray-200 dark:border-gray-700'}`}>
                                                <div className="flex-grow min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {suggestion.includes(':') ? suggestion.split(':')[0] : `Suggestion ${idx + 1}`}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {suggestion.includes(':') ? suggestion.split(':')[1] : suggestion}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggleSuggestion(idx)}
                                                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${isAdded ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                                >
                                                    {isAdded ? 'Added' : 'Add'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleClose}
                            className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold py-3.5 rounded-xl transition-all"
                        >
                            Done
                        </button>
                    </div>
                )}

                {step > 1 && step < 4 && !showNetworkForm && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};