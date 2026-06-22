export function getAqiColor(aqi: number) {
  if (aqi <= 50) return "#10B981"; // Good
  if (aqi <= 100) return "#84CC16"; // Satisfactory
  if (aqi <= 200) return "#F59E0B"; // Moderate
  if (aqi <= 300) return "#F97316"; // Poor
  if (aqi <= 400) return "#EF4444"; // Very Poor
  return "#7C3AED"; // Severe
}

export function getAqiLabel(aqi: number) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}