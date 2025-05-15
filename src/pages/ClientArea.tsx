
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  ShoppingBag, 
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/components/client/ProfileForm";
import { AddressForm } from "@/components/client/AddressForm";
import { OrdersList } from "@/components/client/OrdersList";

export default function ClientArea() {
  const { user, profile, logout, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      // If not loading and no user, redirect to login
      navigate('/login');
    }
  }, [user, authLoading, navigate]);
  
  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logout realizado", description: "Você foi desconectado." });
      navigate("/");
    }
  };
  
  if (authLoading || isLoadingData) {
    return <div className="container px-4 py-12 sm:px-6 text-center">Carregando dados do cliente...</div>;
  }

  if (!user || !profile) {
    return <div className="container px-4 py-12 sm:px-6 text-center">Usuário não autenticado. Redirecionando para login...</div>;
  }

  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Área do Cliente</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Gerencie seus pedidos e atualize suas informações
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-serpente-600" />
              </div>
              <h2 className="text-xl font-bold">{profile.first_name} {profile.last_name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            
            <div className="space-y-2">
              <Button variant={activeTab === "profile" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("profile")}>
                <User className="mr-2 h-5 w-5" /> Perfil
              </Button>
              <Button variant={activeTab === "orders" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("orders")}>
                <ShoppingBag className="mr-2 h-5 w-5" /> Pedidos
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" /> Sair
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Informações Pessoais</h2>
                <ProfileForm profile={profile} />
                
                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-semibold mb-4">Endereço Principal</h3>
                  <AddressForm />
                </div>
                
                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Para alterar sua senha, utilize a opção "Esqueci minha senha" na tela de login.
                  </p>
                   <Button variant="outline" onClick={() => navigate('/forgot-password')}>Ir para Recuperação de Senha</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Meus Pedidos</h2>
                <OrdersList />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
