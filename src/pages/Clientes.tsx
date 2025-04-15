
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Cliente } from "@/types/cliente";
import { Loader2, PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateClientStatus, deleteClient } from "@/utils/client-helpers";
import EditClientDialog from "@/components/clients/EditClientDialog";
import { extractNumberFromCurrency, formatCurrency } from "@/utils/format";

const Clientes = () => {
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Estado do novo cliente
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    telefone: "",
    email: "",
    responsavel: "",
    valor_estimado: "R$ 0",
    status: "lead",
    prioridade: "media",
    links: "",
  });

  // Buscar clientes 
  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ['clientes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar clientes:', error);
        toast.error('Erro ao carregar dados dos clientes');
        return [];
      }

      return data as Cliente[];
    },
    enabled: !!user
  });

  // Adicionar cliente
  const addClientMutation = useMutation({
    mutationFn: async (newClient: Omit<Cliente, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('clientes').insert({
        ...newClient,
        user_id: user!.id,
      }).select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success('Cliente adicionado com sucesso!');
      setIsNewClientDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Erro ao adicionar cliente:', error);
      toast.error('Erro ao adicionar cliente');
    },
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Add user_id to the formData
    addClientMutation.mutate({
      ...formData,
      user_id: user.id
    });
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      empresa: "",
      telefone: "",
      email: "",
      responsavel: "",
      valor_estimado: "R$ 0",
      status: "lead",
      prioridade: "media",
      links: "",
    });
  };

  const handleEditClient = (client: Cliente) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingClient(null);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete, () => {
        queryClient.invalidateQueries({ queryKey: ['clientes'] });
      });
      setClientToDelete(null);
    }
  };

  // Filtragem
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = searchTerm === '' || 
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.responsavel && cliente.responsavel.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !filterStatus || cliente.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "lead": return "Lead";
      case "qualificado": return "Qualificado";
      case "negociacao": return "Negociação";
      case "fechado": return "Fechado";
      case "perdido": return "Perdido";
      default: return status;
    }
  };

  const getPriorityLabel = (prioridade: string) => {
    switch (prioridade) {
      case "baixa": return "Baixa";
      case "media": return "Média";
      case "alta": return "Alta";
      default: return prioridade;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes e acompanhe o status
          </p>
        </div>
        <Button 
          className="sm:w-auto w-full bg-roxo hover:bg-roxo-light text-white"
          onClick={() => setIsNewClientDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Cliente
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select 
          value={filterStatus || 'todos'} 
          onValueChange={(value) => setFilterStatus(value === 'todos' ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="qualificado">Qualificado</SelectItem>
            <SelectItem value="negociacao">Negociação</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de clientes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Valor Estimado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado. Adicione um novo cliente."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.empresa}</TableCell>
                    <TableCell>
                      <div>{cliente.email}</div>
                      {cliente.telefone && <div className="text-xs text-muted-foreground">{cliente.telefone}</div>}
                    </TableCell>
                    <TableCell>{cliente.valor_estimado}</TableCell>
                    <TableCell>{getStatusLabel(cliente.status)}</TableCell>
                    <TableCell>{getPriorityLabel(cliente.prioridade)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClient(cliente)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setClientToDelete(cliente.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo cliente. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do contato</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleFormChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_estimado">Valor Estimado</Label>
                <Input
                  id="valor_estimado"
                  name="valor_estimado"
                  value={formData.valor_estimado}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="qualificado">Qualificado</SelectItem>
                    <SelectItem value="negociacao">Negociação</SelectItem>
                    <SelectItem value="fechado">Fechado</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => handleSelectChange("prioridade", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="links">Links</Label>
              <Input
                id="links"
                name="links"
                value={formData.links}
                onChange={handleFormChange}
                placeholder="Links relacionados (websites, LinkedIn, etc.)"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewClientDialogOpen(false)}
                disabled={addClientMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={addClientMutation.isPending}>
                {addClientMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <EditClientDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        client={editingClient}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['clientes'] })}
      />

      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clientes;
