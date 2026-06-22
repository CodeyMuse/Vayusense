import { useGetCities } from "@workspace/api-client-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getAqiColor } from "@/lib/aqi";

export default function Compare() {
  const { data: cities, isLoading } = useGetCities();
  const [viewMode, setViewMode] = useState<'individual' | 'overlay'>('overlay');

  if (isLoading || !cities) {
    return (
      <div className="flex-1 flex items-center justify-center font-mono text-primary">
        <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Create unified data for overlay chart
  const overlayData = Array.from({ length: 30 }, (_, i) => {
    const point: any = { day: `Day ${i+1}` };
    cities.forEach(c => {
      point[c.name] = c.trend30d[i];
    });
    return point;
  });

  const chartColors = [
    "var(--color-primary)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
    "#ec4899"
  ];

  return (
    <div className="flex-1 p-8 lg:p-12 flex flex-col bg-background text-foreground max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-2">Multi-City Intel</h1>
          <p className="text-muted-foreground">30-day comparative trend analysis across major metropolitan zones.</p>
        </div>
        <div className="flex bg-muted p-1 rounded">
          <button 
            onClick={() => setViewMode('overlay')}
            className={`px-4 py-2 text-sm font-medium uppercase rounded transition-colors ${viewMode === 'overlay' ? 'bg-background text-white shadow' : 'text-muted-foreground'}`}
          >
            Overlay
          </button>
          <button 
            onClick={() => setViewMode('individual')}
            className={`px-4 py-2 text-sm font-medium uppercase rounded transition-colors ${viewMode === 'individual' ? 'bg-background text-white shadow' : 'text-muted-foreground'}`}
          >
            Individual
          </button>
        </div>
      </div>

      {viewMode === 'overlay' ? (
        <div className="bg-card border border-border p-6 rounded-lg h-[500px] mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overlayData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--color-foreground)' }}
              />
              <Legend />
              {cities.map((city, idx) => (
                <Line 
                  key={city.id}
                  type="monotone" 
                  dataKey={city.name} 
                  stroke={chartColors[idx]} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cities.map((city, idx) => (
            <div key={city.id} className="bg-card border border-border p-4 rounded-lg h-[300px] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white font-display">{city.name}</h3>
                <span className="font-mono text-sm" style={{ color: getAqiColor(city.currentAQI) }}>AQI: {city.currentAQI}</span>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={city.trend30d.map((v, i) => ({ val: v, i }))}>
                    <Line type="monotone" dataKey="val" stroke={chartColors[idx]} strokeWidth={2} dot={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
                      labelFormatter={() => ''}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-widest font-mono">
            <tr>
              <th className="p-4">Target Zone</th>
              <th className="p-4">Live AQI</th>
              <th className="p-4">7-Day Avg</th>
              <th className="p-4">Primary Threat</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cities.map(city => {
              const avg7d = Math.round(city.trend30d.slice(-7).reduce((a,b)=>a+b, 0) / 7);
              return (
                <tr key={city.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white font-display">{city.name}</td>
                  <td className="p-4 font-mono">
                    <span className="px-2 py-1 rounded text-black font-bold" style={{ backgroundColor: getAqiColor(city.currentAQI) }}>
                      {city.currentAQI}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-muted-foreground">{avg7d}</td>
                  <td className="p-4 text-white">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono">{city.dominantPollutant}</span>
                  </td>
                  <td className="p-4">
                    {city.currentAQI > avg7d ? (
                      <span className="text-destructive text-sm flex items-center gap-1">↑ Degrading</span>
                    ) : (
                      <span className="text-primary text-sm flex items-center gap-1">↓ Improving</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}