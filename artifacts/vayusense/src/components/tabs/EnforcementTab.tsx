import { CityData, useGenerateNotice } from "@workspace/api-client-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Printer } from "lucide-react";

export default function EnforcementTab({ city }: { city: CityData }) {
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const generateNoticeMutation = useGenerateNotice();

  const handleGenerate = (hotspot: any) => {
    generateNoticeMutation.mutate({
      data: {
        zone: hotspot.zone,
        sourceType: hotspot.sourceType,
        cityAQI: city.currentAQI,
        confidence: hotspot.confidence,
        cityName: city.name
      }
    }, {
      onSuccess: (data) => {
        setSelectedNotice(data.notice);
        setModalOpen(true);
      }
    });
  };

  const copyToClipboard = () => {
    if (selectedNotice) {
      navigator.clipboard.writeText(selectedNotice);
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Active Hotspots & Enforcement</h2>
      
      <div className="bg-card border border-border rounded-lg overflow-hidden flex-1">
        <table className="w-full text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-widest font-mono">
            <tr>
              <th className="p-4">Target Zone</th>
              <th className="p-4">Source Classification</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Severity</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {city.hotspots.map((h, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white">
                  <div className="flex items-center gap-2">
                    {h.severity === 'critical' && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
                    {h.zone}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground font-normal mt-1">{h.lat.toFixed(4)}, {h.lng.toFixed(4)}</div>
                </td>
                <td className="p-4 text-muted-foreground uppercase text-sm">{h.sourceType}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-black rounded-full overflow-hidden w-24">
                      <div 
                        className={`h-full ${h.confidence > 80 ? 'bg-primary' : 'bg-chart-2'}`}
                        style={{ width: `${h.confidence}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs">{h.confidence}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold uppercase
                    ${h.severity === 'critical' ? 'bg-destructive/20 text-destructive border border-destructive/50' : 
                      h.severity === 'high' ? 'bg-chart-4/20 text-chart-4 border border-chart-4/50' : 
                      'bg-chart-2/20 text-chart-2 border border-chart-2/50'}`}
                  >
                    {h.severity}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button 
                    variant="outline" 
                    className="border-primary/50 text-primary hover:bg-primary/20 hover:text-primary font-mono text-xs uppercase"
                    onClick={() => handleGenerate(h)}
                    disabled={generateNoticeMutation.isPending}
                  >
                    {generateNoticeMutation.isPending ? 'Generating...' : 'Generate Notice'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl uppercase tracking-wider text-white border-b border-border pb-4">
              Municipal Enforcement Notice
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-6 bg-black rounded border border-border font-serif text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto">
            {selectedNotice}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={copyToClipboard} className="gap-2">
              <Copy className="w-4 h-4" /> Copy
            </Button>
            <Button onClick={() => window.print()} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Printer className="w-4 h-4" /> Print Notice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}