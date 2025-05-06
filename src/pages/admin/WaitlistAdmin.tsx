
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Download, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface WaitlistEntry {
  name: string;
  email: string;
  phone: string;
  emailNotifications?: boolean;
  phoneNotifications?: boolean;
  marketingConsent?: boolean;
  contactPreference?: 'email' | 'both';
  date: string;
}

const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
  } catch {
    return dateString;
  }
};

const WaitlistAdmin = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [filteredList, setFilteredList] = useState<WaitlistEntry[]>([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    loadWaitlist();
  }, []);
  
  const loadWaitlist = () => {
    try {
      const savedWaitlist = JSON.parse(localStorage.getItem('waitlist') || '[]') as WaitlistEntry[];
      // Sort by date, newest first
      const sortedWaitlist = savedWaitlist.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setWaitlist(sortedWaitlist);
      setFilteredList(sortedWaitlist);
    } catch (error) {
      console.error("Failed to load waitlist data:", error);
      setWaitlist([]);
      setFilteredList([]);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    
    if (!value.trim()) {
      setFilteredList(waitlist);
      return;
    }
    
    const filtered = waitlist.filter(entry => 
      entry.name.toLowerCase().includes(value) || 
      entry.email.toLowerCase().includes(value) ||
      entry.phone.toLowerCase().includes(value)
    );
    
    setFilteredList(filtered);
  };
  
  const getNotificationPreference = (entry: WaitlistEntry) => {
    if (entry.contactPreference) {
      return entry.contactPreference === 'both' ? 'E-mail e Celular' : 'Apenas E-mail';
    }
    
    if (entry.emailNotifications && entry.phoneNotifications) {
      return 'E-mail e Celular';
    } else if (entry.emailNotifications) {
      return 'Apenas E-mail';
    } else if (entry.phoneNotifications) {
      return 'Apenas Celular';
    } else {
      return 'Nenhum';
    }
  };
  
  const exportToCsv = () => {
    // Prepare CSV headers
    const headers = ['Nome', 'Email', 'Celular', 'Preferência de Notificação', 'Data de Cadastro'];
    
    // Prepare CSV rows
    const rows = filteredList.map(entry => [
      entry.name,
      entry.email,
      entry.phone,
      getNotificationPreference(entry),
      formatDate(entry.date)
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set attributes and trigger download
    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout requiredRole="admin">
      <div className="p-6">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lista de Espera - Academy</h1>
            <p className="text-muted-foreground">
              Gerenciamento de potenciais alunos interessados nos cursos da Academy
            </p>
          </div>
          
          <div className="flex flex-wrap justify-between gap-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou celular..."
                className="pl-9 min-w-[300px]"
                value={search}
                onChange={handleSearch}
              />
            </div>
            
            <Button variant="outline" onClick={exportToCsv}>
              <Download className="mr-2 h-4 w-4" /> Exportar CSV
            </Button>
          </div>
          
          {filteredList.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Nenhum registro encontrado na lista de espera.
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Preferência de Notificação</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredList.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.name}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.phone}</TableCell>
                      <TableCell>{getNotificationPreference(entry)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formatDate(entry.date)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default WaitlistAdmin;
