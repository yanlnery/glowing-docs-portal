import React, { useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  Image
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
  requiredRole?: 'admin' | 'editor' | 'viewer'; // This prop seems unused as logic relies on user.role
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, isLoading, user, waitlistCount } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // If still loading auth state, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-serpente-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Produtos', href: '/admin/products', icon: Package },
    { name: 'Gestão de Espécies', href: '/admin/species', icon: ClipboardList, requiredRole: 'admin' },
    { name: 'Carrossel da Home', href: '/admin/carousel', icon: Image, requiredRole: 'admin' },
    { name: 'Manuais', href: '/admin/manuals', icon: FileText, requiredRole: 'admin' },
    { name: 'Lista de Espera', href: '/admin/waitlist', icon: Users, requiredRole: 'admin', badge: true },
    { name: 'Analytics Carrinho', href: '/admin/cart-analytics', icon: ShoppingCart, requiredRole: 'admin' },
    { name: 'Configurações', href: '/admin/settings', icon: Settings, requiredRole: 'admin' },
  ];

  const filteredNav = navigation.filter(item => {
    if (!item.requiredRole) return true;
    // Ensure user and user.role exist before accessing
    return user?.role === 'admin' || (user?.role && user.role === item.requiredRole);
  });

  const isActive = (path: string) => location.pathname === path;

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

      {/* Sidebar */}
      <div 
        className={`fixed md:static z-30 w-64 h-full transition-transform duration-300 transform 
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:translate-x-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
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

            {user && (
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">Logado como:</div>
                <div className="font-medium flex items-center gap-2">
                  {user.username}
                  <Badge variant={user.role === 'admin' ? 'default' : (user.role === 'editor' ? 'secondary' : 'outline')}>
                    {user.role === 'admin' ? 'Administrador' : (user.role === 'editor' ? 'Editor' : 'Visualizador')}
                  </Badge>
                </div>
              </div>
            )}

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
                    {item.name === 'Lista de Espera' && item.badge && waitlistCount > 0 && ( // Ensure badge is shown for correct item
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
                onClick={logout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sair
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
