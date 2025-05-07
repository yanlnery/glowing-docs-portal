import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WebsiteLayout from "./layouts/WebsiteLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Species from "./pages/Species";
import SpeciesDetail from "./pages/SpeciesDetail";
import ProductDetail from "./pages/ProductDetail";
import Manuals from "./pages/Manuals";
import Education from "./pages/Education";
import Academy from "./pages/Academy";
import Contact from "./pages/Contact";
import ClientArea from "./pages/ClientArea";
import NotFound from "./pages/NotFound";
import Quiz from "./pages/Quiz";
import WaitlistForm from "./pages/WaitlistForm";
import CartPage from "./pages/CartPage";
import { Button } from "@/components/ui/button";

// Admin pages
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import Settings from "./pages/admin/Settings";
import WaitlistAdmin from "./pages/admin/WaitlistAdmin";
import ManualsAdmin from "./pages/admin/ManualsAdmin";
import ShoppingCartAnalytics from "./pages/admin/ShoppingCartAnalytics";

// Create a confirmation page for waitlist registration
const WaitlistConfirmationPage = () => (
  <div className="container px-4 py-12 sm:px-6 max-w-md mx-auto text-center">
    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-4">Inscrição Confirmada!</h1>
      <p className="mb-6">
        Sua inscrição na lista de espera da Pet Serpentes Academy foi realizada com sucesso. 
        Entraremos em contato assim que novas vagas estiverem disponíveis.
      </p>
      <Button asChild>
        <a href="/">Voltar para a Página Inicial</a>
      </Button>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes - All wrapped with WebsiteLayout */}
            <Route path="/" element={<WebsiteLayout><Home /></WebsiteLayout>} />
            <Route path="/catalogo" element={<WebsiteLayout><Catalog /></WebsiteLayout>} />
            <Route path="/produtos/:id" element={<WebsiteLayout><ProductDetail /></WebsiteLayout>} />
            <Route path="/especies" element={<WebsiteLayout><Species /></WebsiteLayout>} />
            <Route path="/especies/:id" element={<WebsiteLayout><SpeciesDetail /></WebsiteLayout>} />
            <Route path="/especies-criadas/:slug" element={<WebsiteLayout><SpeciesDetail /></WebsiteLayout>} />
            <Route path="/manuais" element={<WebsiteLayout><Manuals /></WebsiteLayout>} />
            <Route path="/sobre" element={<WebsiteLayout><About /></WebsiteLayout>} />
            <Route path="/educacao" element={<WebsiteLayout><Education /></WebsiteLayout>} />
            <Route path="/academy" element={<WebsiteLayout><Academy /></WebsiteLayout>} />
            <Route path="/lista-de-espera" element={<WebsiteLayout><WaitlistForm /></WebsiteLayout>} />
            <Route path="/confirmacao-inscricao" element={<WebsiteLayout><WaitlistConfirmationPage /></WebsiteLayout>} />
            <Route path="/contato" element={<WebsiteLayout><Contact /></WebsiteLayout>} />
            <Route path="/area-cliente" element={<WebsiteLayout><ClientArea /></WebsiteLayout>} />
            <Route path="/carrinho" element={<WebsiteLayout><CartPage /></WebsiteLayout>} />
            
            {/* Quiz Routes */}
            <Route path="/quiz" element={<WebsiteLayout><Quiz /></WebsiteLayout>} />
            <Route path="/manuais-de-criacao" element={<WebsiteLayout><Manuals /></WebsiteLayout>} />
            <Route path="/ps-academy" element={<WebsiteLayout><Academy /></WebsiteLayout>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/edit/:id" element={<ProductForm />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/waitlist" element={<WaitlistAdmin />} />
            <Route path="/admin/manuals" element={<ManualsAdmin />} />
            <Route path="/admin/cart-analytics" element={<ShoppingCartAnalytics />} />
            
            {/* Legacy routes - keeping for backward compatibility */}
            <Route path="/getting-started" element={<WebsiteLayout><Home /></WebsiteLayout>} />
            <Route path="/api" element={<WebsiteLayout><Home /></WebsiteLayout>} />
            <Route path="/examples" element={<WebsiteLayout><Home /></WebsiteLayout>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<WebsiteLayout><NotFound /></WebsiteLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
