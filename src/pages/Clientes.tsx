
import { useState } from "react";
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

// Sample data for clients
const initialClients = [
  {
    id: 1,
    nome: "João Silva",
    empresa: "TechSolutions",
    status: "qualificado",
    prioridade: "alta",
    valorEstimado: "R$ 15.000",
    responsavel: "Ana Souza",
    email: "joao@techsolutions.com",
    telefone: "(11) 99999-8888",
    links: "techsolutions.com",
    dataFechamento: "2023-08-15",
    ultimoContato: "2023-07-01",
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    empresa: "Marketing Digital",
    status: "fechado",
    prioridade: "media",
    valorEstimado: "R$ 8.500",
    responsavel: "Pedro Costa",
    email: "maria@mktdigital.com",
    telefone: "(11) 97777-6666",
    links: "mktdigital.com",
    dataFechamento: "2023-07-20",
    ultimoContato: "2023-07-05",
  },
  {
    id: 3,
    nome: "Carlos Santos",
    empresa: "Inovação Tech",
    status: "negociacao",
    prioridade: "alta",
    valorEstimado: "R$ 25.000",
    responsavel: "Ana Souza",
    email: "carlos@inovacaotech.com",
    telefone: "(11) 96666-5555",
    links: "inovacaotech.com",
    dataFechamento: "2023-09-10",
    ultimoContato: "2023-06-28",
  },
  {
    id: 4,
    nome: "Amanda Rocha",
    empresa: "Contabilidade Express",
    status: "lead",
    prioridade: "baixa",
    valorEstimado: "R$ 5.000",
    responsavel: "Pedro Costa",
    email: "amanda@contabilidade.com",
    telefone: "(11) 95555-4444",
    links: "contabilidadeexpress.com",
    dataFechamento: "2023-10-05",
    ultimoContato: "2023-06-15",
  },
  {
    id: 5,
    nome: "Roberto Almeida",
    empresa: "Consultoria RH",
    status: "desqualificado",
    prioridade: "baixa",
    valorEstimado: "R$ 12.000",
    responsavel: "Ana Souza",
    email: "roberto@consultoriarh.com",
    telefone: "(11) 94444-3333",
    links: "consultoriarh.com",
    dataFechamento: "2023-08-30",
    ultimoContato: "2023-06-10",
  },
];

// Client interface
interface Cliente {
  id: number;
  nome: string;
  empresa: string;
  status: string;
  prioridade: string;
  valorEstimado: string;
  responsavel: string;
  email: string;
  telefone: string;
  links: string;
  dataFechamento: string;
  ultimoContato: string;
}

const Clientes = () => {
  const [clients, setClients] = useState<Cliente[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Cliente>>({
    nome: "",
    empresa: "",
    status: "lead",
    prioridade: "media",
    valorEstimado: "",
    responsavel: "",
    email: "",
    telefone: "",
    links: "",
    dataFechamento: "",
    ultimoContato: new Date().toISOString().split("T")[0],
  });

  // Filter clients based on search term
  const filteredClients = clients.filter((client) =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle status change
  const handleStatusChange = (clientId: number, newStatus: string) => {
    setClients(
      clients.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client
      )
    );
    toast.success("Status atualizado com sucesso");
  };

  // Handle priority change
  const handlePriorityChange = (clientId: number, newPriority: string) => {
    setClients(
      clients.map((client) =>
        client.id === clientId ? { ...client, prioridade: newPriority } : client
      )
    );
    toast.success("Prioridade atualizada com sucesso");
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

  // Handle new client form submission
  const handleAddClient = () => {
    if (!newClient.nome || !newClient.empresa || !newClient.email) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const newId = Math.max(...clients.map((client) => client.id), 0) + 1;
    const clientToAdd = {
      id: newId,
      nome: newClient.nome || "",
      empresa: newClient.empresa || "",
      status: newClient.status || "lead",
      prioridade: newClient.prioridade || "media",
      valorEstimado: newClient.valorEstimado || "R$ 0",
      responsavel: newClient.responsavel || "",
      email: newClient.email || "",
      telefone: newClient.telefone || "",
      links: newClient.links || "",
      dataFechamento: newClient.dataFechamento || "",
      ultimoContato: newClient.ultimoContato || new Date().toISOString().split("T")[0],
    };

    setClients([clientToAdd, ...clients]);
    setIsDialogOpen(false);
    toast.success("Cliente adicionado com sucesso");
    
    // Reset form
    setNewClient({
      nome: "",
      empresa: "",
      status: "lead",
      prioridade: "media",
      valorEstimado: "",
      responsavel: "",
      email: "",
      telefone: "",
      links: "",
      dataFechamento: "",
      ultimoContato: new Date().toISOString().split("T")[0],
    });
  };

  // Handle client removal
  const handleRemoveClient = (clientId: number) => {
    setClients(clients.filter((client) => client.id !== clientId));
    toast.success("Cliente removido com sucesso");
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
                  <label htmlFor="valorEstimado" className="text-sm font-medium">
                    Valor Estimado
                  </label>
                  <Input
                    id="valorEstimado"
                    value={newClient.valorEstimado}
                    onChange={(e) => setNewClient({ ...newClient, valorEstimado: e.target.value })}
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
                  <label htmlFor="dataFechamento" className="text-sm font-medium">
                    Data Estimada de Fechamento
                  </label>
                  <Input
                    id="dataFechamento"
                    type="date"
                    value={newClient.dataFechamento}
                    onChange={(e) => setNewClient({ ...newClient, dataFechamento: e.target.value })}
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
                {filteredClients.length === 0 ? (
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
                      <TableCell>{client.valorEstimado}</TableCell>
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
                          {new Date(client.dataFechamento).toLocaleDateString('pt-BR')}
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
