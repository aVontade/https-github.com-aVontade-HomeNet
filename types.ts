export enum DeviceType {
  LIGHT = 'light',
  PLUG = 'plug',
  THERMOSTAT = 'thermostat',
  CAMERA = 'camera',
  LOCK = 'lock',
  SENSOR = 'sensor',
  SPEAKER = 'speaker',
  VACUUM = 'vacuum',
  HUB = 'hub'
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  status: 'on' | 'off' | 'online' | 'offline';
  value?: string | number; // e.g., brightness %, temperature
  battery?: number;
  connectionType?: 'wifi' | 'zigbee' | 'bluetooth' | 'ethernet';
  integration?: 'eWeLink' | 'Tuya' | 'Local';
  
  // Technical Metadata
  serialNumber?: string;
  ipAddress?: string;
  modelNumber?: string;
}

export interface Automation {
  id: string;
  name: string;
  active: boolean;
  trigger: string;
  time?: string;
  days?: string[];
  actions: string[];
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  DEVICES = 'devices',
  AUTOMATIONS = 'automations',
  HISTORY = 'history',
  SETTINGS = 'settings',
  ONBOARDING = 'onboarding',
  HELP = 'help'
}