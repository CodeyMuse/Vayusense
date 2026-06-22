import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import CityDashboard from "@/pages/CityDashboard";
import Compare from "@/pages/Compare";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import DemoBanner from "@/components/DemoBanner";
import { useEffect } from "react";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <DemoBanner />
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/city/:cityId" element={<CityDashboard />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;