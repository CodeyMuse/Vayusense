import { CityData, useSendChatMessage } from "@workspace/api-client-react";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CopilotTab({ city }: { city: CityData }) {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: `VayuSense Copilot online. Analyzing telemetry for ${city.name}. How can I assist with enforcement or analysis today?` }
  ]);
  const [input, setInput] = useState("");
  const chatM = useSendChatMessage();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatM.isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput("");

    chatM.mutate({
      data: {
        messages: newMessages,
        cityData: city
      }
    }, {
      onSuccess: (data) => {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      }
    });
  };

  return (
    <div className="h-full flex flex-col space-y-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_currentColor] animate-pulse"></div>
        <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Command Copilot</h2>
      </div>

      <div className="flex-1 overflow-y-auto bg-card border border-border rounded-lg p-6 space-y-6 flex flex-col">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-4 ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground font-sans' 
                : 'bg-muted/50 border border-border text-white font-sans whitespace-pre-wrap'
            }`}>
              <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2 font-mono">
                {m.role === 'user' ? 'Operator' : 'VayuSense AI'}
              </div>
              <div className="leading-relaxed">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {chatM.isPending && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Query sensor data, request analysis, or draft enforcement strategies..."
          className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          disabled={chatM.isPending}
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || chatM.isPending}
          className="bg-primary text-primary-foreground px-6 h-auto"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}