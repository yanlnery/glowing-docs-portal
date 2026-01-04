
import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Users,
  ClipboardList, 
  ShoppingCart,
  FileText,
  Image,
  MessageSquare,
  Images,
  TrendingUp
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: boolean;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdminLoggedIn, adminLogout } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  // Temporary placeholder for waitlist count until implemented
  const waitlistCount = 0;

  // If not logged in as admin, redirect to admin login
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Mensagens', href: '/admin/contact-submissions', icon: MessageSquare },
    { name: 'Gestão de Espécies', href: '/admin/species', icon: ClipboardList, requiredRole: 'admin' },
    { name: 'Carrossel da Home', href: '/admin/carousel', icon: Image, requiredRole: 'admin' },
    { name: 'Galeria Quem Somos', href: '/admin/about-gallery', icon: Images, requiredRole: 'admin' },
    { name: 'Manuais', href: '/admin/manuals', icon: FileText, requiredRole: 'admin' },
    { name: 'Lista de Espera (Academy)', href: '/admin/waitlist', icon: Users, requiredRole: 'admin' },
    { name: 'Lista de Espera (Espécies)', href: '/admin/species-waitlist', icon: Users, requiredRole: 'admin', badge: true },
    { name: 'Lista de Espera (Estágio)', href: '/admin/internship-waitlist', icon: Users, requiredRole: 'admin' },
    { name: 'Leads de Materiais', href: '/admin/material-leads', icon: FileText, requiredRole: 'admin' },
    { name: 'Analytics do Site', href: '/admin/analytics-dashboard', icon: TrendingUp, requiredRole: 'admin' },
    { name: 'Analytics Carrinho', href: '/admin/cart-analytics', icon: ShoppingCart, requiredRole: 'admin' },
    { name: 'Analytics Downloads', href: '/admin/download-analytics', icon: TrendingUp, requiredRole: 'admin' },
    { name: 'Configurações', href: '/admin/settings', icon: Settings, requiredRole: 'admin' },
  ];

  // For now, we'll just treat all users as admin
  const userRole = 'admin';
  
  const filteredNav = navigation.filter(item => {
    if (!item.requiredRole) return true;
    return userRole === 'admin' || (userRole && userRole === item.requiredRole);
  });

  const isActive = (path: string) => location.pathname === path;
  
  // Display name for admin
  const displayName = "Administrador";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="fixed z-40 top-4 left-4 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full" 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - make sure it's always visible and properly positioned */}
      <div 
        className="fixed md:relative z-30 w-64 h-full transition-transform duration-300 transform 
                  md:translate-x-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        style={{ 
          transform: sidebarOpen || window.innerWidth >= 768 ? 'translateX(0)' : 'translateX(-100%)',
          visibility: 'visible' // Ensure sidebar is always visible in DOM for pages that might hide it
        }}
      >
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="flex items-center justify-center mb-8 pt-4">
              <img 
                src="/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png" 
                alt="PET SERPENTES" 
                className="h-8 w-8 mr-2" 
                loading="lazy"
              />
              <span className="text-xl font-semibold">Admin</span>
            </div>

            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">Logado como:</div>
              <div className="font-medium flex items-center gap-2">
                {displayName}
                <Badge variant="default">
                  Administrador
                </Badge>
              </div>
            </div>

            <nav className="space-y-1">
              {filteredNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                      active 
                        ? 'bg-serpente-100 text-serpente-600 dark:bg-serpente-900 dark:text-serpente-300' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${active ? 'text-serpente-600 dark:text-serpente-300' : ''}`} />
                    <span className="flex-1">{item.name}</span>
                    {item.name === 'Lista de Espera' && item.badge && waitlistCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {waitlistCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={adminLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sair
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
