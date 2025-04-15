import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  ChevronDown, 
  Link as LinkIcon, 
  Phone, 
  Mail, 
  Plus, 
  Search,
  Trash,
  Edit,
  Calendar,
  MoreHorizontal,
  UserCircle
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Status types and colors
const statusOptions = [
  { value: "lead", label: "Lead", color: "bg-gray-200 text-gray-800" },
  { value: "desqualificado", label: "Desqualificado", color: "bg-red-100 text-red-800" },
  { value: "qualificado", label: "Qualificado", color: "bg-blue-100 text-blue-800" },
  { value: "perdido", label: "Perdido", color: "bg-orange-100 text-orange-800" },
  { value: "fechado", label: "Fechado", color: "bg-green-100 text-green-800" },
  { value: "novo", label: "Novo", color: "bg-purple-100 text-purple-800" },
  { value: "negociacao", label: "Negociação", color: "bg-yellow-100 text-yellow-800" },
];

// Priority types and colors
const priorityOptions = [
  { value: "alta", label: "Alta", color: "bg-red-100 text-red-800" },
  { value: "media", label: "Média", color: "bg-yellow-100 text-yellow-800" },
  { value: "baixa", label: "Baixa", color: "bg-green-100 text-green-800" },
];

// Client interface
interface Cliente {
  id: number;
  nome: string;
  empresa: string;
  status: string;
  prioridade: string;
  valor_estimado: string;
  responsavel: string;
  email: string;
  telefone: string;
  links: string;
  data_fechamento: string;
  ultimo_contato: string;
  user_id?: string;
  created_at?: string;
}

// Função de utilidade para extrair valores numéricos de strings monetárias
const extractNumberFromCurrency = (currency: string): number => {
  if (!currency) return 0;
  // Remove símbolos monetários e espaços, substitui vírgula por ponto
  const numericString = currency.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(numericString) || 0; // Retorna 0 se não conseguir converter
};

const Clientes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Cliente>>({
    nome: "",
    empresa: "",
    status: "lead",
    prioridade: "media",
    valor_estimado: "",
    responsavel: "",
    email: "",
    telefone: "",
    links: "",
    data_fechamento: "",
    ultimo_contato: new Date().toISOString().split("T")[0],
  });

  // Fetch clients
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Add client mutation
  const addClientMutation = useMutation({
    mutationFn: async (clientData: Omit<Cliente, 'id' | 'created_at' | 'user_id'>) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert([{ ...clientData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsDialogOpen(false);
      toast.success("Cliente adicionado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao adicionar cliente: " + error.message);
    }
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Cliente removido com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao remover cliente: " + error.message);
    }
  });

  // Update client status mutation
  const updateClientStatusMutation = useMutation({
    mutationFn: async ({ clientId, newStatus }: { clientId: string, newStatus: string }) => {
      const { error } = await supabase
        .from('clientes')
        .update({ status: newStatus })
        .eq('id', clientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success("Status atualizado com sucesso");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar status: " + error.message);
    }
  });

  // Filter clients based on search term
  const filteredClients = clients.filter((client) =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (!newClient.nome || !newClient.empresa || !newClient.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    addClientMutation.mutate(newClient as Omit<Cliente, 'id' | 'created_at' | 'user_id'>);
  };

  // Handle status change
  const handleStatusChange = (clientId: number, newStatus: string) => {
    updateClientStatusMutation.mutate({ clientId: clientId.toString(), newStatus });
  };

  // Handle priority change (simulated)
  const handlePriorityChange = (clientId: number, newPriority: string) => {
    // In a real implementation, you would update the priority in the database
    // and then invalidate the query to refetch the data.
    toast.info("Funcionalidade de prioridade não implementada");
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((option) => option.value === status);
    return (
      <Badge className={statusOption?.color || "bg-gray-200"}>
        {statusOption?.label || status}
      </Badge>
    );
  };

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    const priorityOption = priorityOptions.find((option) => option.value === priority);
    return (
      <Badge className={priorityOption?.color || "bg-gray-200"}>
        {priorityOption?.label || priority}
      </Badge>
    );
  };

  // Handle client removal
  const handleRemoveClient = (clientId: number) => {
    deleteClientMutation.mutate(clientId.toString());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes e acompanhe seu status
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-azul hover:bg-azul-light">
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo cliente. Campos com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-sm font-medium">
                    Nome*
                  </label>
                  <Input
                    id="nome"
                    value={newClient.nome}
                    onChange={(e) => setNewClient({ ...newClient, nome: e.target.value })}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="empresa" className="text-sm font-medium">
                    Empresa*
                  </label>
                  <Input
                    id="empresa"
                    value={newClient.empresa}
                    onChange={(e) => setNewClient({ ...newClient, empresa: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={newClient.status}
                    onValueChange={(value) => setNewClient({ ...newClient, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="prioridade" className="text-sm font-medium">
                    Prioridade
                  </label>
                  <Select
                    value={newClient.prioridade}
                    onValueChange={(value) => setNewClient({ ...newClient, prioridade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email*
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefone" className="text-sm font-medium">
                    Telefone
                  </label>
                  <Input
                    id="telefone"
                    value={newClient.telefone}
                    onChange={(e) => setNewClient({ ...newClient, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="valor_estimado" className="text-sm font-medium">
                    Valor Estimado
                  </label>
                  <Input
                    id="valor_estimado"
                    value={newClient.valor_estimado}
                    onChange={(e) => setNewClient({ ...newClient, valor_estimado: e.target.value })}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="responsavel" className="text-sm font-medium">
                    Responsável
                  </label>
                  <Input
                    id="responsavel"
                    value={newClient.responsavel}
                    onChange={(e) => setNewClient({ ...newClient, responsavel: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="links" className="text-sm font-medium">
                    Links
                  </label>
                  <Input
                    id="links"
                    value={newClient.links}
                    onChange={(e) => setNewClient({ ...newClient, links: e.target.value })}
                    placeholder="website.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="data_fechamento" className="text-sm font-medium">
                    Data Estimada de Fechamento
                  </label>
                  <Input
                    id="data_fechamento"
                    type="date"
                    value={newClient.data_fechamento}
                    onChange={(e) => setNewClient({ ...newClient, data_fechamento: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-azul hover:bg-azul-light" onClick={handleAddClient}>
                Adicionar Cliente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Nome do Cliente</TableHead>
                  <TableHead className="font-medium">Empresa</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Prioridade</TableHead>
                  <TableHead className="font-medium">Valor Estimado</TableHead>
                  <TableHead className="font-medium">Responsável</TableHead>
                  <TableHead className="font-medium">Contato</TableHead>
                  <TableHead className="font-medium">Fechamento</TableHead>
                  <TableHead className="font-medium">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      Carregando clientes...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.nome}</TableCell>
                      <TableCell>{client.empresa}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                              {getStatusBadge(client.status)}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {statusOptions.map((option) => (
                              <DropdownMenuItem 
                                key={option.value}
                                onClick={() => handleStatusChange(client.id, option.value)}
                              >
                                <Badge className={option.color}>{option.label}</Badge>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                              {getPriorityBadge(client.prioridade)}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {priorityOptions.map((option) => (
                              <DropdownMenuItem 
                                key={option.value}
                                onClick={() => handlePriorityChange(client.id, option.value)}
                              >
                                <Badge className={option.color}>{option.label}</Badge>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>{client.valor_estimado}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UserCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                          {client.responsavel}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <a href={`mailto:${client.email}`} className="text-azul hover:text-azul-light">
                            <Mail className="h-4 w-4" />
                          </a>
                          <a href={`tel:${client.telefone}`} className="text-azul hover:text-azul-light">
                            <Phone className="h-4 w-4" />
                          </a>
                          {client.links && (
                            <a href={`https://${client.links}`} target="_blank" rel="noopener noreferrer" className="text-azul hover:text-azul-light">
                              <LinkIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {new Date(client.data_fechamento).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveClient(client.id)}>
                              <Trash className="h-4 w-4 mr-2" /> Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
