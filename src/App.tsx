
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebsiteLayout from "./layouts/WebsiteLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Species from "./pages/Species";
import SpeciesDetail from "./pages/SpeciesDetail";
import Manuals from "./pages/Manuals";
import Education from "./pages/Education";
import Academy from "./pages/Academy";
import Contact from "./pages/Contact";
import ClientArea from "./pages/ClientArea";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WebsiteLayout><Home /></WebsiteLayout>} />
          <Route path="/catalogo" element={<WebsiteLayout><Catalog /></WebsiteLayout>} />
          <Route path="/especies" element={<WebsiteLayout><Species /></WebsiteLayout>} />
          <Route path="/especies/:id" element={<WebsiteLayout><SpeciesDetail /></WebsiteLayout>} />
          <Route path="/manuais" element={<WebsiteLayout><Manuals /></WebsiteLayout>} />
          <Route path="/sobre" element={<WebsiteLayout><About /></WebsiteLayout>} />
          <Route path="/educacao" element={<WebsiteLayout><Education /></WebsiteLayout>} />
          <Route path="/academy" element={<WebsiteLayout><Academy /></WebsiteLayout>} />
          <Route path="/lista-de-espera" element={<WebsiteLayout><Academy /></WebsiteLayout>} />
          <Route path="/confirmacao-inscricao" element={<WebsiteLayout><Academy /></WebsiteLayout>} />
          <Route path="/contato" element={<WebsiteLayout><Contact /></WebsiteLayout>} />
          <Route path="/area-cliente" element={<WebsiteLayout><ClientArea /></WebsiteLayout>} />
          {/* Legacy routes - keeping for backward compatibility */}
          <Route path="/getting-started" element={<WebsiteLayout><Home /></WebsiteLayout>} />
          <Route path="/api" element={<WebsiteLayout><Home /></WebsiteLayout>} />
          <Route path="/examples" element={<WebsiteLayout><Home /></WebsiteLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<WebsiteLayout><NotFound /></WebsiteLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
