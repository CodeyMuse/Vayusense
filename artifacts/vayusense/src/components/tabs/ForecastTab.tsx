import { CityData } from "@workspace/api-client-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { getAqiColor } from "@/lib/aqi";

export default function ForecastTab({ city }: { city: CityData }) {
  const chartData = city.forecast.map(f => ({
    hour: `+${f.hour}h`,
    aqi: f.aqi,
    lower: f.lower,
    upper: f.upper,
    color: getAqiColor(f.aqi)
  }));

  const next6 = city.forecast.slice(0, 6).reduce((a, b) => a + b.aqi, 0) / 6;
  const next24 = city.forecast.slice(0, 24).reduce((a, b) => a + b.aqi, 0) / 24;
  const next72 = city.forecast.slice(0, 72).reduce((a, b) => a + b.aqi, 0) / 72;

  return (
    <div className="space-y-8 h-full flex flex-col">
      <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">72-Hour Predictive Forecast</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-sm text-muted-foreground uppercase font-medium">Next 6h Average</div>
          <div className="text-4xl font-mono mt-2" style={{ color: getAqiColor(next6) }}>{Math.round(next6)}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-sm text-muted-foreground uppercase font-medium">Next 24h Average</div>
          <div className="text-4xl font-mono mt-2" style={{ color: getAqiColor(next24) }}>{Math.round(next24)}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-sm text-muted-foreground uppercase font-medium">Next 72h Average</div>
          <div className="text-4xl font-mono mt-2" style={{ color: getAqiColor(next72) }}>{Math.round(next72)}</div>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg p-6 min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
              itemStyle={{ color: 'var(--color-foreground)' }}
            />
            {/* Confidence band */}
            <Area type="monotone" dataKey="upper" stroke="none" fill="var(--color-muted)" fillOpacity={0.2} />
            <Area type="monotone" dataKey="lower" stroke="none" fill="var(--color-background)" />
            {/* Main prediction line */}
            <Area type="monotone" dataKey="aqi" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
            <ReferenceLine y={100} stroke="var(--color-chart-2)" strokeDasharray="3 3" />
            <ReferenceLine y={200} stroke="var(--color-chart-4)" strokeDasharray="3 3" />
            <ReferenceLine y={300} stroke="var(--color-destructive)" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}