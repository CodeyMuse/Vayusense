export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
}

export interface PollutantReading {
  PM25: number;
  PM10: number;
  NO2: number;
  SO2: number;
  CO: number;
  O3: number;
}

export interface SourceAttribution {
  source: string;
  pct: number;
}

export interface ForecastPoint {
  hour: number;
  aqi: number;
  lower: number;
  upper: number;
}

export interface Hotspot {
  zone: string;
  sourceType: string;
  confidence: number;
  lat: number;
  lng: number;
  severity: "critical" | "high" | "medium";
}

export interface WeatherData {
  windSpeed: number;
  windDir: string;
  temp: number;
  humidity: number;
}

export interface CityData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  currentAQI: number;
  dominantPollutant: string;
  pollutants: PollutantReading;
  stations: Station[];
  sourceAttribution: SourceAttribution[];
  forecast: ForecastPoint[];
  hotspots: Hotspot[];
  weather: WeatherData;
  trend30d: number[];
}

function generateForecast(baseAQI: number): ForecastPoint[] {
  return Array.from({ length: 72 }, (_, i) => {
    const trend = Math.round(baseAQI + Math.sin(i / 8) * 30 + (Math.random() - 0.5) * 20);
    return {
      hour: i,
      aqi: trend,
      lower: Math.round(trend - 15),
      upper: Math.round(trend + 15),
    };
  });
}

function generateTrend30d(baseAQI: number): number[] {
  return Array.from({ length: 30 }, (_, i) =>
    Math.round(baseAQI + Math.sin(i / 5) * 25 + (Math.random() - 0.5) * 30)
  );
}

export const CITIES: CityData[] = [
  {
    id: "delhi",
    name: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    currentAQI: 218,
    dominantPollutant: "PM2.5",
    pollutants: { PM25: 124, PM10: 189, NO2: 67, SO2: 22, CO: 1.4, O3: 34 },
    stations: [
      { id: "DEL-01", name: "Anand Vihar", lat: 28.6469, lng: 77.316, aqi: 287 },
      { id: "DEL-02", name: "Lodhi Road", lat: 28.5921, lng: 77.2274, aqi: 163 },
      { id: "DEL-03", name: "RK Puram", lat: 28.5646, lng: 77.173, aqi: 201 },
    ],
    sourceAttribution: [
      { source: "Vehicles", pct: 38 },
      { source: "Industry", pct: 24 },
      { source: "Construction Dust", pct: 19 },
      { source: "Crop Burning", pct: 12 },
      { source: "Other", pct: 7 },
    ],
    forecast: generateForecast(218),
    hotspots: [
      { zone: "Anand Vihar", sourceType: "Traffic / Diesel Vehicles", confidence: 91, lat: 28.6469, lng: 77.316, severity: "critical" },
      { zone: "Narela Industrial Area", sourceType: "Industrial Emissions", confidence: 84, lat: 28.8561, lng: 77.0946, severity: "high" },
      { zone: "Burari Road Construction", sourceType: "Construction Dust", confidence: 76, lat: 28.7259, lng: 77.1934, severity: "medium" },
    ],
    weather: { windSpeed: 3.2, windDir: "NW", temp: 28, humidity: 62 },
    trend30d: generateTrend30d(218),
  },
  {
    id: "mumbai",
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    currentAQI: 156,
    dominantPollutant: "PM10",
    pollutants: { PM25: 78, PM10: 134, NO2: 54, SO2: 14, CO: 0.9, O3: 41 },
    stations: [
      { id: "MUM-01", name: "Bandra", lat: 19.0596, lng: 72.8295, aqi: 178 },
      { id: "MUM-02", name: "Colaba", lat: 18.9067, lng: 72.8147, aqi: 121 },
      { id: "MUM-03", name: "Borivali", lat: 19.2307, lng: 72.8567, aqi: 167 },
    ],
    sourceAttribution: [
      { source: "Vehicles", pct: 44 },
      { source: "Industry", pct: 28 },
      { source: "Construction Dust", pct: 15 },
      { source: "Sea Salt Aerosol", pct: 8 },
      { source: "Other", pct: 5 },
    ],
    forecast: generateForecast(156),
    hotspots: [
      { zone: "Dharavi Industrial Cluster", sourceType: "Industrial Emissions", confidence: 88, lat: 19.0422, lng: 72.8541, severity: "high" },
      { zone: "Eastern Express Highway", sourceType: "Traffic / Diesel Vehicles", confidence: 82, lat: 19.1032, lng: 72.8614, severity: "high" },
    ],
    weather: { windSpeed: 5.1, windDir: "SW", temp: 32, humidity: 78 },
    trend30d: generateTrend30d(156),
  },
  {
    id: "kolkata",
    name: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    currentAQI: 172,
    dominantPollutant: "PM2.5",
    pollutants: { PM25: 98, PM10: 152, NO2: 71, SO2: 18, CO: 1.1, O3: 29 },
    stations: [
      { id: "KOL-01", name: "Rabindra Sarani", lat: 22.5726, lng: 88.3639, aqi: 198 },
      { id: "KOL-02", name: "Jadavpur", lat: 22.4991, lng: 88.3703, aqi: 155 },
      { id: "KOL-03", name: "Howrah", lat: 22.5958, lng: 88.2636, aqi: 181 },
    ],
    sourceAttribution: [
      { source: "Vehicles", pct: 41 },
      { source: "Industry", pct: 31 },
      { source: "Construction Dust", pct: 14 },
      { source: "Waste Burning", pct: 9 },
      { source: "Other", pct: 5 },
    ],
    forecast: generateForecast(172),
    hotspots: [
      { zone: "Dankuni Industrial Belt", sourceType: "Industrial Emissions", confidence: 86, lat: 22.6712, lng: 88.2715, severity: "high" },
      { zone: "Howrah Bridge Corridor", sourceType: "Traffic / Diesel Vehicles", confidence: 79, lat: 22.5851, lng: 88.3468, severity: "high" },
      { zone: "Tangra Tanneries", sourceType: "Industrial Emissions", confidence: 73, lat: 22.5386, lng: 88.3837, severity: "medium" },
    ],
    weather: { windSpeed: 2.8, windDir: "NE", temp: 31, humidity: 74 },
    trend30d: generateTrend30d(172),
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    currentAQI: 134,
    dominantPollutant: "NO2",
    pollutants: { PM25: 62, PM10: 98, NO2: 82, SO2: 11, CO: 0.7, O3: 47 },
    stations: [
      { id: "BLR-01", name: "Silk Board", lat: 12.9172, lng: 77.6226, aqi: 158 },
      { id: "BLR-02", name: "Hebbal", lat: 13.0358, lng: 77.5971, aqi: 119 },
      { id: "BLR-03", name: "BTM Layout", lat: 12.9166, lng: 77.6101, aqi: 141 },
    ],
    sourceAttribution: [
      { source: "Vehicles", pct: 52 },
      { source: "Industry", pct: 19 },
      { source: "Construction Dust", pct: 17 },
      { source: "Biomass Burning", pct: 7 },
      { source: "Other", pct: 5 },
    ],
    forecast: generateForecast(134),
    hotspots: [
      { zone: "Peenya Industrial Area", sourceType: "Industrial Emissions", confidence: 83, lat: 13.0284, lng: 77.5167, severity: "high" },
      { zone: "Outer Ring Road", sourceType: "Traffic / Diesel Vehicles", confidence: 77, lat: 12.9353, lng: 77.6245, severity: "medium" },
    ],
    weather: { windSpeed: 4.2, windDir: "SE", temp: 26, humidity: 58 },
    trend30d: generateTrend30d(134),
  },
  {
    id: "chennai",
    name: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    currentAQI: 148,
    dominantPollutant: "PM10",
    pollutants: { PM25: 71, PM10: 126, NO2: 49, SO2: 16, CO: 0.8, O3: 38 },
    stations: [
      { id: "CHN-01", name: "Manali", lat: 13.1674, lng: 80.2569, aqi: 189 },
      { id: "CHN-02", name: "Adyar", lat: 13.0067, lng: 80.2206, aqi: 118 },
      { id: "CHN-03", name: "T. Nagar", lat: 13.0418, lng: 80.2341, aqi: 152 },
    ],
    sourceAttribution: [
      { source: "Vehicles", pct: 39 },
      { source: "Industry", pct: 33 },
      { source: "Construction Dust", pct: 13 },
      { source: "Sea Salt Aerosol", pct: 10 },
      { source: "Other", pct: 5 },
    ],
    forecast: generateForecast(148),
    hotspots: [
      { zone: "Manali Petrochemical Cluster", sourceType: "Industrial Emissions", confidence: 92, lat: 13.1674, lng: 80.2569, severity: "critical" },
      { zone: "Chennai Port Trust Roads", sourceType: "Traffic / Diesel Vehicles", confidence: 78, lat: 13.1078, lng: 80.2851, severity: "high" },
    ],
    weather: { windSpeed: 6.3, windDir: "E", temp: 34, humidity: 82 },
    trend30d: generateTrend30d(148),
  },
  {
    id: "pune",
    name: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    currentAQI: 162,
    dominantPollutant: "PM2.5",
    pollutants: { PM25: 88, PM10: 141, NO2: 58, SO2: 19, CO: 1.0, O3: 36 },
    stations: [
      { id: "PUN-01", name: "Shivajinagar", lat: 18.5308, lng: 73.8475, aqi: 181 },
      { id: "PUN-02", name: "Karve Road", lat: 18.5, lng: 73.8296, aqi: 147 },
      { id: "PUN-03", name: "Hadapsar", lat: 18.5, lng: 73.9297, aqi: 168 },
    ],
    sourceAttribution: [
      { source: "Vehicles", pct: 43 },
      { source: "Industry", pct: 26 },
      { source: "Construction Dust", pct: 18 },
      { source: "Biomass Burning", pct: 8 },
      { source: "Other", pct: 5 },
    ],
    forecast: generateForecast(162),
    hotspots: [
      { zone: "Bhosari MIDC", sourceType: "Industrial Emissions", confidence: 87, lat: 18.6332, lng: 73.8481, severity: "high" },
      { zone: "Katraj–Dehu Road Bypass", sourceType: "Traffic / Diesel Vehicles", confidence: 74, lat: 18.4553, lng: 73.8647, severity: "medium" },
      { zone: "Khadki Cantonment", sourceType: "Construction Dust", confidence: 68, lat: 18.5667, lng: 73.8383, severity: "medium" },
    ],
    weather: { windSpeed: 3.7, windDir: "W", temp: 29, humidity: 55 },
    trend30d: generateTrend30d(162),
  },
];

export function getCityById(id: string): CityData | undefined {
  return CITIES.find((c) => c.id === id);
}
