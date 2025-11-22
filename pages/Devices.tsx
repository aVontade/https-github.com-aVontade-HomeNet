import React, { useState, useEffect } from 'react';
import { Device, DeviceType } from '../types';
import { 
  Search, 
  MoreHorizontal, 
  Lightbulb, 
  Power, 
  Lock, 
  Thermometer, 
  Shield, 
  Video, 
  Speaker, 
  Disc,
  Filter,
  Download,
  RefreshCw,
  LayoutList,
  Layers,
  ChevronDown,
  ChevronRight,
  Router
} from 'lucide-react';

interface DevicesPageProps {
  devices: Device[];
}

export const DevicesPage: React.FC<DevicesPageProps> = ({ devices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'room'>('list');
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case DeviceType.LIGHT: return <Lightbulb size={18} />;
      case DeviceType.PLUG: return <Power size={18} />;
      case DeviceType.LOCK: return <Lock size={18} />;
      case DeviceType.THERMOSTAT: return <Thermometer size={18} />;
      case DeviceType.SENSOR: return <Shield size={18} />;
      case DeviceType.CAMERA: return <Video size={18} />;
      case DeviceType.SPEAKER: return <Speaker size={18} />;
      case DeviceType.VACUUM: return <Disc size={18} />;
      case DeviceType.HUB: return <Router size={18} />;
      default: return <Power size={18} />;
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ipAddress?.includes(searchTerm) ||
      device.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || device.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Group devices by room
  const devicesByRoom = filteredDevices.reduce((acc, device) => {
    const room = device.room || 'Unassigned';
    if (!acc[room]) acc[room] = [];
    acc[room].push(device);
    return acc;
  }, {} as Record<string, Device[]>);

  const sortedRooms = Object.keys(devicesByRoom).sort();

  // Initialize all rooms as expanded when entering room view
  useEffect(() => {
    if (viewMode === 'room') {
      setExpandedRooms(new Set(sortedRooms));
    }
  }, [viewMode, sortedRooms.length]);

  const toggleRoom = (room: string) => {
    const newExpanded = new Set(expandedRooms);
    if (newExpanded.has(room)) {
      newExpanded.delete(room);
    } else {
      newExpanded.add(room);
    }
    setExpandedRooms(newExpanded);
  };

  const DeviceRow = ({ device }: { device: Device }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg text-primary">
            {getDeviceIcon(device.type)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{device.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                {device.type}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {device.connectionType}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-gray-700 dark:text-gray-300">{device.room}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          device.status === 'on' || device.status === 'online' 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${device.status === 'on' || device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="capitalize">{device.status}</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-gray-400 w-12">ID:</span>
            <span className="text-gray-700 dark:text-gray-300 select-all font-medium">{device.id}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-gray-400 w-12">S/N:</span>
            <span className="text-gray-700 dark:text-gray-300 select-all">{device.serialNumber || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-gray-400 w-12">IP:</span>
            <span className="text-gray-700 dark:text-gray-300 select-all">{device.ipAddress || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-gray-400 w-12">Model:</span>
            <span className="text-gray-700 dark:text-gray-300">{device.modelNumber || 'Generic'}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );

  const TableHeader = () => (
    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
      <tr>
        <th className="px-6 py-4 font-semibold">Device Identity</th>
        <th className="px-6 py-4 font-semibold">Location</th>
        <th className="px-6 py-4 font-semibold">Status</th>
        <th className="px-6 py-4 font-semibold">Technical Details</th>
        <th className="px-6 py-4 font-semibold text-right">Actions</th>
      </tr>
    </thead>
  );

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Device Inventory</h2>
          <p className="text-gray-500 dark:text-gray-400">Detailed record of all onboarded hardware.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Scan Network</span>
          </button>
        </div>
      </div>

      {/* Filters & Search & View Toggle */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, ID, IP, or Serial No..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="All">All Types</option>
                    {Object.values(DeviceType).map(type => (
                    <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                </select>
            </div>

            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

            <div className="flex bg-gray-50 dark:bg-dark-bg rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-dark-card shadow text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    title="List View"
                >
                    <LayoutList size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('room')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'room' ? 'bg-white dark:bg-dark-card shadow text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    title="Group by Room"
                >
                    <Layers size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* Inventory Content */}
      {viewMode === 'list' ? (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <TableHeader />
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                        <DeviceRow key={device.id} device={device} />
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            <p>No devices found matching your criteria.</p>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
      ) : (
        <div className="space-y-4">
            {sortedRooms.length > 0 ? (
                sortedRooms.map(room => {
                    const roomDevices = devicesByRoom[room];
                    const isExpanded = expandedRooms.has(room);
                    
                    return (
                        <div key={room} className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                            <button 
                                onClick={() => toggleRoom(room)}
                                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                                        <ChevronRight size={20} className="text-gray-400" />
                                    </div>
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">{room}</span>
                                    <span className="text-sm px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                                        {roomDevices.length}
                                    </span>
                                </div>
                            </button>
                            
                            {isExpanded && (
                                <div className="border-t border-gray-200 dark:border-gray-700 overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <TableHeader />
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {roomDevices.map(device => (
                                                <DeviceRow key={device.id} device={device} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400">
                    <p>No devices found matching your criteria.</p>
                </div>
            )}
        </div>
      )}
      
      {viewMode === 'list' && filteredDevices.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 px-2">
            <span>Showing {filteredDevices.length} devices</span>
        </div>
      )}
    </div>
  );
};