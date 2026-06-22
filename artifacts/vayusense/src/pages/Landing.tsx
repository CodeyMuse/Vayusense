import { useGetCities } from "@workspace/api-client-react";
import { Link } from "react-router-dom";
import { getAqiColor } from "@/lib/aqi";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function Landing() {
  const { data: cities, isLoading } = useGetCities();

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center font-mono text-primary space-y-4">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
        <div>ESTABLISHING SENSOR UPLINK...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Marquee Ticker */}
      <div className="bg-card border-b border-border py-2 overflow-hidden flex whitespace-nowrap">
        <div className="animate-[marquee_20s_linear_infinite] flex gap-8 px-4 font-mono text-sm">
          {cities?.map(c => (
            <span key={c.id} className="flex items-center gap-2">
              <span className="text-muted-foreground">{c.name.toUpperCase()}</span>
              <span style={{ color: getAqiColor(c.currentAQI) }}>{c.currentAQI}</span>
            </span>
          ))}
          {/* Duplicate for seamless looping */}
          {cities?.map(c => (
            <span key={c.id + '-dup'} className="flex items-center gap-2">
              <span className="text-muted-foreground">{c.name.toUpperCase()}</span>
              <span style={{ color: getAqiColor(c.currentAQI) }}>{c.currentAQI}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-12 flex flex-col max-w-7xl mx-auto w-full">
        <header className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-4 uppercase tracking-tight">Urban Air Command</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Real-time geospatial air quality intelligence. Predictive forecasting and source attribution for municipal enforcement.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities?.map((city) => (
            <Link key={city.id} to={`/city/${city.id}`} className="group block">
              <div className="bg-card border border-border rounded-lg p-6 hover:-translate-y-1 hover:border-primary hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all duration-300 relative overflow-hidden">
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors">{city.name}</h2>
                  <div 
                    className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: getAqiColor(city.currentAQI), color: getAqiColor(city.currentAQI) }}
                  />
                </div>

                <div className="flex items-end gap-4 mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground uppercase font-medium mb-1">Live AQI</div>
                    <div 
                      className="font-mono text-5xl font-medium leading-none"
                      style={{ color: getAqiColor(city.currentAQI) }}
                    >
                      {city.currentAQI}
                    </div>
                  </div>
                  <div className="flex-1 h-12 mb-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={city.trend30d.slice(-24).map((v, i) => ({ val: v, i }))}>
                        <Line type="monotone" dataKey="val" stroke={getAqiColor(city.currentAQI)} strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">Dominant Pollutant</span>
                  <span className="font-mono text-sm font-bold px-2 py-1 bg-white/5 rounded text-white">{city.dominantPollutant}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}