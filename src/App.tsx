
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation, Link } from "react-router-dom";
import WebsiteLayout from "./layouts/WebsiteLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Species from "./pages/Species";
import SpeciesDetail from "./pages/SpeciesDetail";
import SpeciesDetailRedirect from "./pages/SpeciesDetailRedirect";
import ProductDetail from "./pages/ProductDetail";
import Manuals from "./pages/Manuals";
import Education from "./pages/Education";
import Academy from "./pages/Academy";
import AcademyConfirmation from "./pages/AcademyConfirmation";
import Contact from "./pages/Contact";
import ClientArea from "./pages/ClientArea";
import NotFound from "./pages/NotFound";
import WaitlistForm from "./pages/WaitlistForm";
import CartPage from "./pages/CartPage";
import CheckoutAuthPage from "./pages/CheckoutAuthPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import { Button } from "@/components/ui/button";
import { useSettings } from "./hooks/useSettings";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AuthCallback from "./pages/auth/AuthCallback";

// Admin pages
import { AuthProvider } from "./contexts/AuthContext"; 
import { useAuth } from "./hooks/useAuth";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminLogin from "./pages/admin/Login"; 
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import Settings from "./pages/admin/Settings";
import WaitlistAdmin from "./pages/admin/WaitlistAdmin";
import ManualsAdmin from "./pages/admin/ManualsAdmin";
import ShoppingCartAnalytics from "./pages/admin/ShoppingCartAnalytics";
import ContactSubmissions from "./pages/admin/ContactSubmissions";
import SpeciesAdmin from "./pages/admin/SpeciesAdmin";
import AdminCarousel from "./pages/admin/AdminCarousel";
import SpeciesWaitlistAdmin from "./pages/admin/SpeciesWaitlistAdmin";
import InternshipWaitlistAdmin from "./pages/admin/InternshipWaitlistAdmin";
import AboutGalleryAdmin from "./pages/admin/AboutGalleryAdmin";
import MaterialLeadsAdmin from "./pages/admin/MaterialLeadsAdmin";
import DownloadAnalyticsAdmin from "./pages/admin/DownloadAnalyticsAdmin";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// Function for conditional Academy route based on settings
const AcademyRoute = () => {
  const { isAcademyVisible } = useSettings();
  
  if (!isAcademyVisible) {
    return <Navigate to="/" replace />;
  }
  
  return <Academy />;
};

const queryClient = new QueryClient();

// Protected Route for Client Area
const ProtectedClientRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};


// Wrapper for admin routes with AdminAuthProvider
const AdminRoutes = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="settings" element={<Settings />} />
          <Route path="waitlist" element={<WaitlistAdmin />} />
          <Route path="manuals" element={<ManualsAdmin />} />
          <Route path="contact-submissions" element={<ContactSubmissions />} />
          <Route path="species" element={<SpeciesAdmin />} />
          <Route path="carousel" element={<AdminCarousel />} />
          <Route path="cart-analytics" element={<ShoppingCartAnalytics />} />
          <Route path="species-waitlist" element={<SpeciesWaitlistAdmin />} />
          <Route path="internship-waitlist" element={<InternshipWaitlistAdmin />} />
          <Route path="about-gallery" element={<AboutGalleryAdmin />} />
          <Route path="material-leads" element={<MaterialLeadsAdmin />} />
          <Route path="download-analytics" element={<DownloadAnalyticsAdmin />} />
          <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes, Auth Routes, and Protected Client Area now share WebsiteLayout */}
              <Route element={<WebsiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="catalogo" element={<Catalog />} />
                <Route path="produtos/:id" element={<ProductDetail />} />
                <Route path="especies" element={<Species />} />
                <Route path="especies-criadas/:slug" element={<SpeciesDetailRedirect />} />
                <Route path="manuais" element={<Manuals />} />
                <Route path="sobre" element={<About />} />
                <Route path="educacao" element={<Education />} />
                <Route path="academy" element={<AcademyRoute />} />
                <Route path="lista-de-espera" element={<WaitlistForm />} />
                <Route path="confirmacao-inscricao" element={<AcademyConfirmation />} />
                <Route path="contato" element={<Contact />} />
                <Route path="politica-de-privacidade" element={<PrivacyPolicyPage />} />
                <Route path="termos-de-uso" element={<TermsOfUsePage />} />
                
                {/* Auth Routes - Now under WebsiteLayout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                 <Route path="/resetar-senha" element={<ResetPasswordPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Protected Client Route - Stays under WebsiteLayout */}
                <Route element={<ProtectedClientRoute />}>
                  <Route path="area-cliente" element={<ClientArea />} />
                </Route>
                
                <Route path="carrinho" element={<CartPage />} />
                <Route path="checkout-cadastro" element={<CheckoutAuthPage />} />
                <Route path="manuais-de-criacao" element={<Manuals />} />
                
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Admin Routes - Wrapped in separate AdminAuthProvider */}
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
