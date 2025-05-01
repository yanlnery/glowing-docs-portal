
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  FileText, 
  ShoppingBag, 
  Star, 
  Download, 
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientArea() {
  // Mock data for demonstration purposes
  const orders = [
    {
      id: "ORD-2024-001",
      date: "15/04/2024",
      status: "Entregue",
      total: "R$ 1.500,00",
      items: ["Python regius (Macho)"]
    },
    {
      id: "ORD-2024-002",
      date: "28/03/2024",
      status: "Processando",
      total: "R$ 800,00",
      items: ["Pogona vitticeps (Filhote)"]
    }
  ];
  
  const documents = [
    {
      title: "Certificado de Origem - Python regius",
      type: "PDF",
      size: "1.2 MB",
      date: "16/04/2024"
    },
    {
      title: "Nota Fiscal - #128756",
      type: "PDF",
      size: "0.8 MB",
      date: "15/04/2024"
    },
    {
      title: "Manual de Cuidados - Python regius",
      type: "PDF",
      size: "3.5 MB",
      date: "16/04/2024"
    }
  ];
  
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
              <h2 className="text-xl font-bold">João Silva</h2>
              <p className="text-sm text-muted-foreground">cliente@exemplo.com</p>
            </div>
            
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#profile">
                  <User className="mr-2 h-5 w-5" /> Perfil
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#orders">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Pedidos
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="#documents">
                  <FileText className="mr-2 h-5 w-5" /> Documentos
                </a>
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full">Sair</Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>
            
            {/* Profile Content */}
            <TabsContent value="profile">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Informações Pessoais</h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" defaultValue="João Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" defaultValue="cliente@exemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" defaultValue="(21) 98765-4321" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" defaultValue="123.456.789-00" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-6">
                    <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Rua</Label>
                        <Input id="street" defaultValue="Rua das Flores" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Número</Label>
                        <Input id="number" defaultValue="123" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complement">Complemento</Label>
                        <Input id="complement" defaultValue="Apto 101" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro</Label>
                        <Input id="neighborhood" defaultValue="Centro" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input id="city" defaultValue="Rio de Janeiro" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input id="state" defaultValue="RJ" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipcode">CEP</Label>
                        <Input id="zipcode" defaultValue="20000-000" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-6">
                    <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div></div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Senha</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button>Salvar Alterações</Button>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            {/* Orders Content */}
            <TabsContent value="orders">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Meus Pedidos</h2>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{order.id}</span>
                            {order.status === "Entregue" ? (
                              <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle className="h-3 w-3 mr-1" /> {order.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                                <AlertCircle className="h-3 w-3 mr-1" /> {order.status}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Data: {order.date}</p>
                          <p className="text-sm">Itens: {order.items.join(", ")}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">{order.total}</span>
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Detalhes <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {orders.length === 0 && (
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
            
            {/* Documents Content */}
            <TabsContent value="documents">
              <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Meus Documentos</h2>
                
                <div className="space-y-4">
                  {documents.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-muted rounded p-2 flex-shrink-0">
                            <FileText className="h-6 w-6 text-serpente-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{doc.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>{doc.date}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                          <Download className="mr-2 h-4 w-4" /> Baixar
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">Nenhum documento encontrado</h3>
                      <p className="text-muted-foreground">
                        Você ainda não possui documentos disponíveis.
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
