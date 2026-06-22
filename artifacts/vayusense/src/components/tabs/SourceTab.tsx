import { CityData } from "@workspace/api-client-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Compass } from "lucide-react";

export default function SourceTab({ city }: { city: CityData }) {
  const colors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
    "var(--color-primary)"
  ];

  return (
    <div className="space-y-8 h-full flex flex-col">
      <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Geospatial Source Attribution</h2>
      
      <div className="grid md:grid-cols-3 gap-8 flex-1">
        <div className="md:col-span-2 bg-card border border-border rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6 uppercase tracking-widest text-sm">PM2.5 Contributors</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={city.sourceAttribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={2}
                  dataKey="pct"
                  nameKey="source"
                  stroke="none"
                >
                  {city.sourceAttribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                  formatter={(value: number) => [`${value}%`, 'Contribution']}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-white mb-8 uppercase tracking-widest text-sm self-start">Wind Vector</h3>
          <div className="relative w-48 h-48 rounded-full border-4 border-muted flex items-center justify-center">
            <div className="absolute top-2 text-muted-foreground font-mono text-xs">N</div>
            <div className="absolute bottom-2 text-muted-foreground font-mono text-xs">S</div>
            <div className="absolute right-2 text-muted-foreground font-mono text-xs">E</div>
            <div className="absolute left-2 text-muted-foreground font-mono text-xs">W</div>
            <Compass 
              className="w-24 h-24 text-primary"
              style={{ 
                transform: `rotate(${city.weather.windDir === 'N' ? 0 : city.weather.windDir === 'NE' ? 45 : city.weather.windDir === 'E' ? 90 : city.weather.windDir === 'SE' ? 135 : city.weather.windDir === 'S' ? 180 : city.weather.windDir === 'SW' ? 225 : city.weather.windDir === 'W' ? 270 : 315}deg)` 
              }} 
            />
            <div className="absolute bg-background p-2 rounded-full font-mono text-primary font-bold shadow-lg">
              {city.weather.windSpeed}
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="text-3xl font-mono text-white">{city.weather.windDir} @ {city.weather.windSpeed} km/h</div>
            <div className="text-sm text-muted-foreground uppercase mt-2">Plume Trajectory Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}