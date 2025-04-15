
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Calendar,
  Clock,
  DollarSign,
  Users,
  MoreHorizontal,
  Search,
  CheckCircle,
  Trash,
  Edit,
  ArrowRightCircle,
} from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Task interface
interface Task {
  id: number;
  titulo: string;
  descricao: string;
  cliente: string;
  valorContrato: string;
  responsavel: string;
  dataEntrega: string;
  status: 'a_fazer' | 'em_andamento' | 'concluido';
  prioridade: 'alta' | 'media' | 'baixa';
  criado_em: string;
}

// Sample clients data
const clientesDisponiveis = [
  { id: 1, nome: "TechSolutions" },
  { id: 2, nome: "Marketing Digital" },
  { id: 3, nome: "Inovação Tech" },
  { id: 4, nome: "Contabilidade Express" },
  { id: 5, nome: "Consultoria RH" },
];

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: 1,
    titulo: "Desenvolvimento de Website",
    descricao: "Criar um website responsivo com painel de controle",
    cliente: "TechSolutions",
    valorContrato: "R$ 10.000",
    responsavel: "Ana Souza",
    dataEntrega: "2023-08-20",
    status: "a_fazer",
    prioridade: "alta",
    criado_em: "2023-07-01"
  },
  {
    id: 2,
    titulo: "Campanha de Marketing",
    descricao: "Planejar e executar campanha de marketing digital",
    cliente: "Marketing Digital",
    valorContrato: "R$ 5.000",
    responsavel: "Pedro Costa",
    dataEntrega: "2023-07-30",
    status: "em_andamento",
    prioridade: "media",
    criado_em: "2023-06-15"
  },
  {
    id: 3,
    titulo: "Configuração de Servidor",
    descricao: "Configurar servidor para nova aplicação",
    cliente: "Inovação Tech",
    valorContrato: "R$ 3.000",
    responsavel: "Ana Souza",
    dataEntrega: "2023-07-15",
    status: "concluido",
    prioridade: "baixa",
    criado_em: "2023-06-10"
  },
  {
    id: 4,
    titulo: "Auditoria Financeira",
    descricao: "Realizar auditoria financeira trimestral",
    cliente: "Contabilidade Express",
    valorContrato: "R$ 7.500",
    responsavel: "Pedro Costa",
    dataEntrega: "2023-08-05",
    status: "em_andamento",
    prioridade: "alta",
    criado_em: "2023-06-25"
  },
  {
    id: 5,
    titulo: "Recrutamento de Equipe",
    descricao: "Recrutar equipe de desenvolvimento",
    cliente: "Consultoria RH",
    valorContrato: "R$ 8.000",
    responsavel: "Ana Souza",
    dataEntrega: "2023-09-01",
    status: "a_fazer",
    prioridade: "media",
    criado_em: "2023-07-05"
  }
];

const Tarefas = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    titulo: "",
    descricao: "",
    cliente: "",
    valorContrato: "",
    responsavel: "",
    dataEntrega: "",
    status: "a_fazer",
    prioridade: "media",
    criado_em: new Date().toISOString().split("T")[0],
  });

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter((task) =>
    task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get tasks by status
  const getTasksByStatus = (status: 'a_fazer' | 'em_andamento' | 'concluido') => {
    return filteredTasks.filter((task) => task.status === status);
  };

  // Handle status change (drag & drop simulation)
  const handleStatusChange = (taskId: number, newStatus: 'a_fazer' | 'em_andamento' | 'concluido') => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    toast.success("Status da tarefa atualizado com sucesso");
  };
  
  // Handle task removal
  const handleRemoveTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    toast.success("Tarefa removida com sucesso");
  };
  
  // Add new task
  const handleAddTask = () => {
    if (!newTask.titulo || !newTask.cliente) {
      toast.error("Título e cliente são obrigatórios");
      return;
    }

    const newId = Math.max(...tasks.map((task) => task.id), 0) + 1;
    
    const taskToAdd: Task = {
      id: newId,
      titulo: newTask.titulo || "",
      descricao: newTask.descricao || "",
      cliente: newTask.cliente || "",
      valorContrato: newTask.valorContrato || "R$ 0",
      responsavel: newTask.responsavel || "",
      dataEntrega: newTask.dataEntrega || "",
      status: newTask.status || "a_fazer",
      prioridade: newTask.prioridade || "media",
      criado_em: new Date().toISOString().split("T")[0],
    };
    
    setTasks([taskToAdd, ...tasks]);
    setIsDialogOpen(false);
    toast.success("Tarefa adicionada com sucesso");
    
    // Reset form
    setNewTask({
      titulo: "",
      descricao: "",
      cliente: "",
      valorContrato: "",
      responsavel: "",
      dataEntrega: "",
      status: "a_fazer",
      prioridade: "media",
    });
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, string> = {
      alta: "bg-red-100 text-red-800",
      media: "bg-yellow-100 text-yellow-800",
      baixa: "bg-green-100 text-green-800",
    };
    
    return (
      <Badge className={priorityMap[priority] || "bg-gray-200"}>
        {priority === "alta" ? "Alta" : priority === "media" ? "Média" : "Baixa"}
      </Badge>
    );
  };

  // Render task card
  const TaskCard = ({ task }: { task: Task }) => {
    return (
      <Card className="mb-3 cursor-grab hover:shadow-md transition-shadow duration-200">
        <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-sm font-medium">{task.titulo}</CardTitle>
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
              {task.status !== "em_andamento" && (
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "em_andamento")}>
                  <ArrowRightCircle className="h-4 w-4 mr-2" /> Mover para Em Andamento
                </DropdownMenuItem>
              )}
              {task.status !== "concluido" && (
                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "concluido")}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Marcar como Concluído
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleRemoveTask(task.id)}>
                <Trash className="h-4 w-4 mr-2" /> Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="flex items-center my-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            <span>{task.cliente}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {task.responsavel.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs ml-1">{task.responsavel}</span>
            </div>
            {getPriorityBadge(task.prioridade)}
          </div>
          
          <div className="flex justify-between items-center mt-2 text-xs">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(task.dataEntrega).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1" />
              {task.valorContrato}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tarefas</h2>
          <p className="text-muted-foreground">
            Gerencie suas tarefas e acompanhe o progresso
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-roxo hover:bg-roxo-light">
              <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
              <DialogDescription>
                Preencha as informações da nova tarefa. Campos com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="titulo" className="text-sm font-medium">
                  Título*
                </label>
                <Input
                  id="titulo"
                  value={newTask.titulo}
                  onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                  placeholder="Título da tarefa"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="descricao"
                  value={newTask.descricao}
                  onChange={(e) => setNewTask({ ...newTask, descricao: e.target.value })}
                  placeholder="Descreva a tarefa"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cliente" className="text-sm font-medium">
                    Cliente*
                  </label>
                  <Select
                    value={newTask.cliente}
                    onValueChange={(value) => setNewTask({ ...newTask, cliente: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientesDisponiveis.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.nome}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="valorContrato" className="text-sm font-medium">
                    Valor do Contrato
                  </label>
                  <Input
                    id="valorContrato"
                    value={newTask.valorContrato}
                    onChange={(e) => setNewTask({ ...newTask, valorContrato: e.target.value })}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="responsavel" className="text-sm font-medium">
                    Responsável
                  </label>
                  <Input
                    id="responsavel"
                    value={newTask.responsavel}
                    onChange={(e) => setNewTask({ ...newTask, responsavel: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dataEntrega" className="text-sm font-medium">
                    Data de Entrega
                  </label>
                  <Input
                    id="dataEntrega"
                    type="date"
                    value={newTask.dataEntrega}
                    onChange={(e) => setNewTask({ ...newTask, dataEntrega: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: any) => setNewTask({ ...newTask, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a_fazer">A Fazer</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="prioridade" className="text-sm font-medium">
                    Prioridade
                  </label>
                  <Select
                    value={newTask.prioridade}
                    onValueChange={(value: any) => setNewTask({ ...newTask, prioridade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-roxo hover:bg-roxo-light" onClick={handleAddTask}>
                Adicionar Tarefa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas..."
          className="flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="mine">Minhas Tarefas</TabsTrigger>
          <TabsTrigger value="overdue">Atrasadas</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center text-muted-foreground">
                  A Fazer <Badge className="ml-2 bg-muted">{getTasksByStatus('a_fazer').length}</Badge>
                </h3>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg min-h-[200px]">
                {getTasksByStatus('a_fazer').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center text-muted-foreground">
                  Em Andamento <Badge className="ml-2 bg-muted">{getTasksByStatus('em_andamento').length}</Badge>
                </h3>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg min-h-[200px]">
                {getTasksByStatus('em_andamento').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center text-muted-foreground">
                  Concluído <Badge className="ml-2 bg-muted">{getTasksByStatus('concluido').length}</Badge>
                </h3>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg min-h-[200px]">
                {getTasksByStatus('concluido').map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="mine">
          <div className="text-center py-10 text-muted-foreground">
            Necessário integração com Supabase para identificar tarefas do usuário logado
          </div>
        </TabsContent>
        <TabsContent value="overdue">
          <div className="text-center py-10 text-muted-foreground">
            Necessário integração com Supabase para identificar tarefas atrasadas
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tarefas;
