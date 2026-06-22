import { useParams, Link } from "react-router-dom";
import { useGetCity } from "@workspace/api-client-react";
import { getAqiColor, getAqiLabel } from "@/lib/aqi";
import { Wind, BarChart2, Map as MapIcon, AlertTriangle, Heart, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import tabs
import ForecastTab from "@/components/tabs/ForecastTab";
import SourceTab from "@/components/tabs/SourceTab";
import EnforcementTab from "@/components/tabs/EnforcementTab";
import AdvisoryTab from "@/components/tabs/AdvisoryTab";
import CopilotTab from "@/components/tabs/CopilotTab";

export default function CityDashboard() {
  const { cityId } = useParams<{ cityId: string }>();
  const { data: initialCity, isLoading } = useGetCity(cityId ?? "");
  
  const [activeTab, setActiveTab] = useState("overview");
  const [localAqi, setLocalAqi] = useState<number | null>(null);

  useEffect(() => {
    if (initialCity) setLocalAqi(initialCity.currentAQI);
  }, [initialCity]);

  // Simulate real-time updates
  useEffect(() => {
    if (!initialCity) return;
    const timer = setInterval(() => {
      setLocalAqi(prev => {
        if (!prev) return initialCity.currentAQI;
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return Math.max(0, prev + change);
      });
    }, 30000);
    return () => clearInterval(timer);
  }, [initialCity]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center font-mono text-primary">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!initialCity || localAqi === null) {
    return <div className="flex-1 p-8 text-white">City not found.</div>;
  }

  const city = { ...initialCity, currentAQI: localAqi };
  const aqiColor = getAqiColor(city.currentAQI);
  const aqiLabel = getAqiLabel(city.currentAQI);

  const tabs = [
    { id: "overview", label: "Live Overview", icon: Wind },
    { id: "forecast", label: "Forecast", icon: BarChart2 },
    { id: "source", label: "Source Attribution", icon: MapIcon },
    { id: "enforcement", label: "Enforcement Intel", icon: AlertTriangle },
    { id: "advisory", label: "Citizen Advisory", icon: Heart },
    { id: "copilot", label: "AI Copilot", icon: MessageSquare },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top AQI Bar */}
      <div 
        className="w-full px-6 py-2 font-mono flex justify-between animate-pulse-aqi font-bold text-black"
        style={{ backgroundColor: aqiColor }}
      >
        <span className="uppercase">{city.name} // LIVE FEED</span>
        <span>AQI: {city.currentAQI} — {aqiLabel.toUpperCase()}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Target Zone</div>
            <div className="font-display font-bold text-lg text-white">{city.name}</div>
            <div className="font-mono text-xs text-muted-foreground mt-1">{city.lat.toFixed(4)}° N, {city.lng.toFixed(4)}° E</div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2 ${
                  activeTab === tab.id 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === "overview" && (
                <div className="space-y-8 h-full">
                  <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Live Telemetry</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-card border border-border p-4 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: aqiColor }} />
                        <div className="text-sm text-muted-foreground uppercase font-medium">System AQI</div>
                        <div className="text-5xl font-mono mt-2" style={{ color: aqiColor }}>{city.currentAQI}</div>
                     </div>
                     <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground uppercase font-medium">Dominant</div>
                        <div className="text-4xl font-mono mt-2 text-white">{city.dominantPollutant}</div>
                     </div>
                     <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground uppercase font-medium">PM2.5</div>
                        <div className="text-4xl font-mono mt-2 text-amber-400">{city.pollutants.PM25} <span className="text-sm text-muted-foreground">µg/m³</span></div>
                     </div>
                     <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground uppercase font-medium">Wind</div>
                        <div className="text-4xl font-mono mt-2 text-cyan-400">{city.weather.windSpeed} <span className="text-sm text-muted-foreground">km/h</span></div>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="text-lg font-medium text-white mb-6 uppercase tracking-widest text-sm">Pollutant Breakdown</h3>
                      <div className="space-y-4">
                        {Object.entries(city.pollutants).map(([key, val]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground font-mono">{key}</span>
                              <span className="text-white font-mono">{val}</span>
                            </div>
                            <div className="h-2 bg-black rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${Math.min(100, (val / 300) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center">
                      <h3 className="text-lg font-medium text-white mb-6 uppercase tracking-widest text-sm self-start">AQI Index</h3>
                      <div className="relative w-48 h-48">
                         <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                           <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-muted)" strokeWidth="8" />
                           <motion.circle 
                             cx="50" cy="50" r="40" fill="transparent" 
                             stroke={aqiColor} strokeWidth="8" 
                             strokeDasharray={`${Math.min(100, (city.currentAQI / 500) * 100) * 2.51} 251`}
                             initial={{ strokeDasharray: "0 251" }}
                             animate={{ strokeDasharray: `${Math.min(100, (city.currentAQI / 500) * 100) * 2.51} 251` }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                           />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <div className="text-3xl font-mono text-white">{city.currentAQI}</div>
                           <div className="text-xs uppercase mt-1" style={{ color: aqiColor }}>{aqiLabel}</div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "forecast" && <ForecastTab city={city} />}
              {activeTab === "source" && <SourceTab city={city} />}
              {activeTab === "enforcement" && <EnforcementTab city={city} />}
              {activeTab === "advisory" && <AdvisoryTab city={city} />}
              {activeTab === "copilot" && <CopilotTab city={city} />}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}