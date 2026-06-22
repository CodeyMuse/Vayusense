import { CityData, useGenerateAdvisory } from "@workspace/api-client-react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { getAqiColor } from "@/lib/aqi";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 11);
  return null;
}

export default function AdvisoryTab({ city }: { city: CityData }) {
  const [lang, setLang] = useState<'english' | 'hindi'>('english');
  const advisoryM = useGenerateAdvisory();
  
  // Use state to store the advisory result so it doesn't get lost
  const [advisoryResult, setAdvisoryResult] = useState<{english: string, hindi: string} | null>(null);

  useEffect(() => {
    advisoryM.mutate({
      data: {
        cityName: city.name,
        aqi: city.currentAQI,
        pollutants: city.pollutants
      }
    }, {
      onSuccess: (data) => {
        setAdvisoryResult(data);
      }
    });
  }, [city.id]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Public Health Advisory</h2>
      
      <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Map View */}
        <div className="bg-card border border-border rounded-lg overflow-hidden relative">
          <div className="absolute top-4 left-4 z-[400] bg-card/90 backdrop-blur border border-border px-3 py-2 rounded shadow-lg">
            <div className="text-xs uppercase font-bold text-white mb-1">Sensor Network</div>
            <div className="font-mono text-[10px] text-muted-foreground">{city.stations.length} Active Nodes</div>
          </div>
          {typeof window !== 'undefined' && (
             <MapContainer center={[city.lat, city.lng]} zoom={11} style={{ height: '100%', width: '100%' }}>
               <ChangeView center={[city.lat, city.lng]} />
               <TileLayer
                 url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
               />
               {city.stations.map(station => (
                 <CircleMarker 
                   key={station.id}
                   center={[station.lat, station.lng]}
                   radius={8}
                   fillColor={getAqiColor(station.aqi)}
                   fillOpacity={0.7}
                   color="#000"
                   weight={2}
                 >
                   <Popup className="font-sans">
                     <div className="font-bold">{station.name}</div>
                     <div className="font-mono text-sm mt-1">AQI: {station.aqi}</div>
                   </Popup>
                 </CircleMarker>
               ))}
             </MapContainer>
          )}
        </div>

        {/* Advisory Text */}
        <div className="bg-card border border-border rounded-lg flex flex-col">
          <div className="border-b border-border p-4 flex justify-between items-center bg-muted/20">
            <div className="text-sm font-bold text-white uppercase tracking-widest">Auto-Generated Broadcast</div>
            <div className="flex gap-2">
              <button 
                onClick={() => setLang('english')}
                className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors ${lang === 'english' ? 'bg-primary text-primary-foreground' : 'bg-black text-muted-foreground border border-border'}`}
              >
                ENG
              </button>
              <button 
                onClick={() => setLang('hindi')}
                className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors ${lang === 'hindi' ? 'bg-primary text-primary-foreground' : 'bg-black text-muted-foreground border border-border'}`}
              >
                HIN
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {advisoryM.isPending ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-primary font-mono text-sm animate-pulse">GENERATING ADVISORY...</div>
              </div>
            ) : advisoryResult ? (
              <div className={`whitespace-pre-wrap leading-relaxed ${lang === 'hindi' ? 'text-lg font-sans' : 'text-base font-sans'} text-white`}>
                {lang === 'english' ? advisoryResult.english : advisoryResult.hindi}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}