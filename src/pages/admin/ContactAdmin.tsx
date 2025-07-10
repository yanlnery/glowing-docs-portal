import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Search,
  Eye,
  Filter,
  CheckCircle,
  Clock,
  Reply
} from "lucide-react";
import { contactService } from "@/services/contactService";
import type { ContactMessage } from "@/types/order";

export default function ContactAdmin() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, statusFilter]);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await contactService.getAllMessages();
    
    if (error) {
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter);
    }

    setFilteredMessages(filtered);
  };

  const handleStatusUpdate = async (messageId: string, newStatus: ContactMessage['status']) => {
    const { error } = await contactService.updateMessageStatus(messageId, newStatus);
    
    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Status atualizado",
        description: "Status da mensagem atualizado com sucesso"
      });
      fetchMessages();
    }
  };

  const getStatusBadge = (status: ContactMessage['status']) => {
    const variants = {
      new: { variant: "default" as const, icon: Mail, label: "Nova" },
      read: { variant: "secondary" as const, icon: Eye, label: "Lida" },
      replied: { variant: "default" as const, icon: Reply, label: "Respondida" },
      closed: { variant: "outline" as const, icon: CheckCircle, label: "Fechada" }
    };
    
    const config = variants[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const messageStats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    closed: messages.filter(m => m.status === 'closed').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mensagens de Contato</h1>
        <p className="text-muted-foreground">
          Gerencie todas as mensagens recebidas pelo formulário de contato
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{messageStats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{messageStats.new}</div>
              <div className="text-sm text-muted-foreground">Novas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{messageStats.read}</div>
              <div className="text-sm text-muted-foreground">Lidas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{messageStats.replied}</div>
              <div className="text-sm text-muted-foreground">Respondidas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{messageStats.closed}</div>
              <div className="text-sm text-muted-foreground">Fechadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email, assunto ou mensagem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Nova</SelectItem>
                <SelectItem value="read">Lida</SelectItem>
                <SelectItem value="replied">Respondida</SelectItem>
                <SelectItem value="closed">Fechada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensagens */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Carregando mensagens...</div>
        ) : filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma mensagem encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? "Nenhuma mensagem corresponde aos filtros aplicados."
                  : "Ainda não há mensagens de contato."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card key={message.id} className={message.status === 'new' ? 'border-blue-200 bg-blue-50/30' : ''}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{message.name}</h3>
                      {getStatusBadge(message.status)}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {message.phone}
                        </div>
                      )}
                      <div>Data: {new Date(message.created_at).toLocaleDateString()}</div>
                      {message.subject && (
                        <div className="col-span-full">Assunto: {message.subject}</div>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Mensagem: </span>
                      <span className="text-muted-foreground">
                        {message.message.length > 100 
                          ? `${message.message.substring(0, 100)}...`
                          : message.message
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Dialog 
                      open={isMessageDialogOpen && selectedMessage?.id === message.id} 
                      onOpenChange={(open) => {
                        setIsMessageDialogOpen(open);
                        if (open) {
                          setSelectedMessage(message);
                          if (message.status === 'new') {
                            handleStatusUpdate(message.id, 'read');
                          }
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Mensagem de {message.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Status atual</Label>
                              <div className="mt-1">{getStatusBadge(message.status)}</div>
                            </div>
                            <div>
                              <Label>Alterar status</Label>
                              <Select onValueChange={(value) => handleStatusUpdate(message.id, value as ContactMessage['status'])}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">Nova</SelectItem>
                                  <SelectItem value="read">Lida</SelectItem>
                                  <SelectItem value="replied">Respondida</SelectItem>
                                  <SelectItem value="closed">Fechada</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Informações de Contato</Label>
                            <div className="mt-2 p-3 bg-muted rounded-md">
                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div><strong>Nome:</strong> {message.name}</div>
                                <div><strong>Email:</strong> {message.email}</div>
                                {message.phone && (
                                  <div><strong>Telefone:</strong> {message.phone}</div>
                                )}
                                {message.subject && (
                                  <div><strong>Assunto:</strong> {message.subject}</div>
                                )}
                                <div><strong>Data:</strong> {new Date(message.created_at).toLocaleDateString()} às {new Date(message.created_at).toLocaleTimeString()}</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label>Mensagem Completa</Label>
                            <Textarea 
                              value={message.message} 
                              readOnly 
                              className="mt-1 min-h-[120px]" 
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.subject || 'Sua mensagem'}`)}
                              className="flex items-center gap-2"
                            >
                              <Mail className="h-4 w-4" />
                              Responder por Email
                            </Button>
                            {message.phone && (
                              <Button 
                                variant="outline"
                                onClick={() => window.open(`https://wa.me/55${message.phone.replace(/\D/g, '')}?text=Olá ${message.name}, recebi sua mensagem sobre: ${message.subject || 'contato'}`)}
                                className="flex items-center gap-2"
                              >
                                <Phone className="h-4 w-4" />
                                Responder por WhatsApp
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}