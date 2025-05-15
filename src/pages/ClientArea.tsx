import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  ShoppingBag, 
  LogOut,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/components/client/ProfileForm";
import { AddressForm } from "@/components/client/AddressForm";
import { OrdersList } from "@/components/client/OrdersList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ClientArea() {
  const { user, profile, logout, isLoading: authLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);
  
  useEffect(() => {
    let timeoutId: number | undefined;
    if (authLoading && !user && !profile) {
      timeoutId = window.setTimeout(() => {
        if (authLoading && !profile) { 
          setLoadError("Tempo limite excedido ao carregar seus dados. Por favor, tente novamente.");
        }
      }, 10000);
    } else if (!authLoading && user && !profile) {
      setLoadError("Não foi possível carregar seu perfil. Tente recarregar a página ou contate o suporte.");
    } else if (!authLoading && profile) {
      setLoadError(null);
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [authLoading, user, profile]);
  
  const handleRetryLoading = async () => {
    setLoadError(null);
    setIsLoadingData(true);
    await refreshProfile();
    setIsLoadingData(false);
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Logout realizado", description: "Você foi desconectado." });
      navigate("/");
    }
  };
  
  if (authLoading || (!profile && user && !loadError)) {
    return (
      <div className="container px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-16 h-16 border-4 border-serpente-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Carregando seus dados...</h2>
          <p className="text-muted-foreground">Por favor, aguarde.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="container px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <Alert variant="destructive" className="max-w-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Erro ao Carregar Dados</AlertTitle>
            <AlertDescription>
              {loadError}
              <div className="mt-4 flex justify-center">
                <Button onClick={handleRetryLoading}>Tentar Novamente</Button>
                <Button variant="outline" onClick={handleLogout} className="ml-2">Fazer Logout</Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container px-4 py-12 sm:px-6 text-center">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Usuário não autenticado</h2>
          <p className="text-muted-foreground mb-6">Você será redirecionado para a página de login.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container px-4 py-12 sm:px-6 text-center">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Alert variant="default" className="max-w-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Dados de perfil não encontrados</AlertTitle>
            <AlertDescription>
              Não conseguimos carregar as informações do seu perfil. Isso pode acontecer se:
              <ul className="list-disc list-inside mt-2 text-left text-sm">
                <li>Seu cadastro não foi totalmente finalizado.</li>
                <li>Ocorreu um problema ao buscar seus dados.</li>
              </ul>
              <div className="mt-4 flex justify-center">
                <Button onClick={handleRetryLoading}>Tentar Novamente</Button>
                <Button variant="outline" onClick={handleLogout} className="ml-2">Fazer Logout</Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
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
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-serpente-100 dark:bg-serpente-900/50 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-serpente-600" />
              </div>
              <h2 className="text-xl font-bold">{profile.first_name || 'Usuário'} {profile.last_name || ''}</h2>
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
