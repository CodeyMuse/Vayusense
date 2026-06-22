import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-display font-bold text-white tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          VAYUSENSE
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-white transition-colors">Command Center</Link>
          <Link to="/compare" className="text-muted-foreground hover:text-white transition-colors">Compare</Link>
          <Link to="/about" className="text-muted-foreground hover:text-white transition-colors">About</Link>
        </div>
      </div>
      <div className="font-mono text-sm text-primary tracking-widest bg-primary/10 px-3 py-1 rounded border border-primary/20">
        {time.toISOString().split("T")[1].split(".")[0]} UTC
      </div>
    </nav>
  );
}