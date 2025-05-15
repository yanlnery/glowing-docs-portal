
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  ShoppingBag, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  LogOut
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, Address, Order, OrderItem } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function ClientArea() {
  const { user, profile: authProfile, logout, updateProfile, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // Email from auth.user

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({}); // For editing/adding
  // For simplicity, we'll handle one address. Multiple address management can be added.
  const [street, setStreet] = useState('');
  const [number, setNumberVal] = useState(''); // 'number' is reserved
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateVal] = useState(''); // 'state' is reserved
  const [zipcode, setZipcode] = useState('');
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (user && authProfile) {
      setFirstName(authProfile.first_name || '');
      setLastName(authProfile.last_name || '');
      setPhone(authProfile.phone || '');
      setEmail(user.email || '');
      fetchClientData();
    } else if (!authLoading && !user) {
      // If not loading and no user, redirect to login (though ProtectedRoute should handle this)
      navigate('/login');
    }
  }, [user, authProfile, authLoading, navigate]);

  const fetchClientData = async () => {
    if (!user) return;
    setIsLoadingData(true);
    // Fetch addresses
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false }); // Get default first

    if (addressError) {
      toast({ title: "Erro ao buscar endereços", description: addressError.message, variant: "destructive" });
    } else if (addressData && addressData.length > 0) {
      setAddresses(addressData as Address[]);
      const defaultAddress = addressData.find(a => a.is_default) || addressData[0];
      setCurrentAddress(defaultAddress); // Initialize form with the first/default address
      setStreet(defaultAddress.street);
      setNumberVal(defaultAddress.number);
      setComplement(defaultAddress.complement || '');
      setNeighborhood(defaultAddress.neighborhood);
      setCity(defaultAddress.city);
      setStateVal(defaultAddress.state);
      setZipcode(defaultAddress.zipcode);
    } else {
      setAddresses([]);
      setCurrentAddress({ user_id: user.id, is_default: true }); // Prepare for new address
    }

    // Fetch orders with items
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items ( * )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (orderError) {
      toast({ title: "Erro ao buscar pedidos", description: orderError.message, variant: "destructive" });
    } else {
      setOrders(orderData as Order[]);
    }
    setIsLoadingData(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await updateProfile({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    });
    if (error) {
      toast({ title: "Erro ao atualizar perfil", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." });
    }
  };

  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const addressPayload = {
      user_id: user.id,
      street,
      number: numberVal,
      complement,
      neighborhood,
      city,
      state: stateVal,
      zipcode,
      is_default: currentAddress.is_default !== undefined ? currentAddress.is_default : true,
    };

    let error;
    if (currentAddress.id) { // Update existing address
      const { error: updateError } = await supabase
        .from('addresses')
        .update({ ...addressPayload, updated_at: new Date().toISOString() })
        .eq('id', currentAddress.id);
      error = updateError;
    } else { // Insert new address
      const { error: insertError } = await supabase
        .from('addresses')
        .insert(addressPayload);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao atualizar endereço", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Endereço atualizado!", description: "Seu endereço foi salvo." });
      fetchClientData(); // Refresh data
    }
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
  
  if (authLoading || isLoadingData) {
    return <div className="container px-4 py-12 sm:px-6 text-center">Carregando dados do cliente...</div>;
  }

  if (!user || !authProfile) {
     // This should ideally be handled by ProtectedRoute, but as a fallback:
    return <div className="container px-4 py-12 sm:px-6 text-center">Usuário não autenticado. Redirecionando para login...</div>;
  }

  return (
    <div className="container px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="docs-section-title">
          <h1 className="text-4xl font-bold">Área do Cliente</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Gerencie seus pedidos, acesse documentos e atualize suas informações
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
              <h2 className="text-xl font-bold">{authProfile.first_name} {authProfile.last_name}</h2>
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
            <TabsList className="grid w-full grid-cols-2 mb-8"> {/* Updated to 2 cols */}
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Informações Pessoais</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" value={email} readOnly disabled className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX"/>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={authLoading}>
                      {authLoading ? "Salvando..." : "Salvar Informações Pessoais"}
                    </Button>
                  </div>
                </form>
                
                <div className="pt-4 border-t mt-6">
                  <h3 className="text-lg font-semibold mb-4">Endereço Principal</h3>
                  <form onSubmit={handleAddressUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input id="street" value={street} onChange={e => setStreet(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" value={numberVal} onChange={e => setNumberVal(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" value={complement} onChange={e => setComplement(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input id="neighborhood" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" value={city} onChange={e => setCity(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado (UF)</Label>
                        <Input id="state" value={stateVal} onChange={e => setStateVal(e.target.value)} maxLength={2} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipcode">CEP</Label>
                        <Input id="zipcode" value={zipcode} onChange={e => setZipcode(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={authLoading}>
                        {authLoading ? "Salvando..." : (currentAddress.id ? "Atualizar Endereço" : "Salvar Endereço")}
                      </Button>
                    </div>
                  </form>
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
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">Pedido #{order.id.substring(0,8)}</span>
                            {order.status === "delivered" ? (
                              <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" /> Entregue
                              </span>
                            ) : order.status === "processing" || order.status === "shipped" ? (
                               <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                                <AlertCircle className="h-3 w-3 mr-1" /> {order.status === "processing" ? "Processando" : "Enviado"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                                <AlertCircle className="h-3 w-3 mr-1" /> {order.status === "pending" ? "Pendente" : "Cancelado"}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Data: {new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="text-sm">Itens: {order.order_items?.map(item => `${item.product_name} (x${item.quantity})`).join(", ") || "N/A"}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">R$ {parseFloat(order.total_amount).toFixed(2)}</span>
                          {/* Detalhes do pedido pode ser uma feature futura */}
                          {/* <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Detalhes <ChevronRight className="ml-1 h-4 w-4" />
                          </Button> */}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {orders.length === 0 && !isLoadingData && (
                    <div className="text-center py-12">
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">Nenhum pedido encontrado</h3>
                      <p className="text-muted-foreground">
                        Você ainda não realizou nenhum pedido.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
