import { useState } from "react";
import { X } from "lucide-react";

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-500 text-sm font-mono py-2 px-4 flex justify-between items-center z-50 relative">
      <div className="flex items-center gap-2">
        <span>⚠️</span>
        <span>DEMO MODE: Sensor feeds are simulated.</span>
      </div>
      <button onClick={() => setVisible(false)} className="hover:text-amber-400">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}