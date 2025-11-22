# HomeNet Smart Control

**HomeNet** is a next-generation smart home dashboard designed to unify device management, security monitoring, and automation into a single, beautiful interface. 

Built with **React**, **Tailwind CSS**, and powered by **Google Gemini AI**, HomeNet offers a seamless experience for managing modern smart homes.

## ✨ Key Features

### 🏠 Interactive Dashboard
- **Security Status:** Real-time monitoring with Home, Away, and Sleep modes.
- **Climate Control:** Centralized thermostat and air quality visualization.
- **Live Feeds:** Integrated camera previews with motion detection indicators.
- **Quick Actions:** One-tap control for lights, locks, and essential devices.
- **AI Assistant:** Floating chat interface powered by Gemini to answer queries and control the home.

### 🔍 Advanced Device Onboarding
- **Simulated Network Scanning:** Discovers devices on your local subnet (Wi-Fi & Ethernet) based on router credentials.
- **Pairing Mode:** Simulates Zigbee/Bluetooth pairing processes.
- **AI-Powered Setup:** Automatically suggests relevant automations based on newly discovered devices.

### 📱 Device Inventory
- **Detailed Metadata:** Tracks IP addresses, Serial Numbers, and Model IDs.
- **Flexible Views:** Toggle between a detailed **List View** and a categorized **Room View**.
- **Search & Filter:** Powerful filtering by device type and global search capabilities.

### 🤖 Automation & Intelligence
- **Rule Engine:** Visual interface for creating "If This, Then That" style automations.
- **Smart Suggestions:** Uses Google Gemini to analyze your device list and propose creative automation routines.

### ⚙️ System Management
- **User Profiles:** Manage personalized settings.
- **Dark Mode:** Fully supported system-wide dark theme.
- **System Health:** Monitor firmware versions and update status.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI/LLM:** Google GenAI SDK (Gemini 2.5 Flash)
- **Build/Runtime:** Native ES Modules (No bundler required for dev)

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome/Edge/Firefox).
- A Google Gemini API Key (for AI features).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/homenet-smart-control.git
   cd homenet-smart-control
   ```

2. **Serve the application**
   Since this project uses ES Modules directly in the browser, you need a simple HTTP server.
   
   **Using Python:**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npx http-server .
   ```

3. **Open in Browser**
   Navigate to `http://localhost:8000`.

### AI Configuration
To enable the AI Assistant and Automation Suggestions:
1. The application expects `process.env.API_KEY` to be available.
2. In a local development environment without a bundler, you may need to manually inject this key or configure your environment to replace `process.env.API_KEY` with your actual string.

## ⚠️ Note on Simulation
This application is a **frontend prototype**. 
- **Device Scanning:** The network scanning functionality is simulated for demonstration purposes (browsers cannot access low-level ARP/Network tables directly).
- **Persistence:** Data is stored in local component state and will reset upon refresh.

## 📄 License
MIT License - build something awesome!
