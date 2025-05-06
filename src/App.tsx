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
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/produtos/:id" element={<ProductDetail />} />
            <Route path="/especies" element={<Species />} />
            <Route path="/especies/:id" element={<SpeciesDetail />} />
            <Route path="/especies-criadas/:slug" element={<SpeciesDetail />} />
            <Route path="/manuais" element={<Manuals />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/educacao" element={<Education />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/lista-de-espera" element={<WaitlistForm />} />
            <Route path="/confirmacao-inscricao" element={<WebsiteLayout><WaitlistConfirmationPage /></WebsiteLayout>} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/area-cliente" element={<ClientArea />} />
            <Route path="/carrinho" element={<CartPage />} />
            {/* Quiz Routes */}
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/manuais-de-criacao" element={<Manuals />} />
            <Route path="/ps-academy" element={<Academy />} />
            
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
            <Route path="/getting-started" element={<Home />} />
            <Route path="/api" element={<Home />} />
            <Route path="/examples" element={<Home />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
