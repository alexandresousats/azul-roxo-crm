
import { useState } from "react";
import { Cliente } from "@/types/cliente";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  User, Building, Flag, Calendar, Mail, 
  Phone, Link as LinkIcon, DollarSign, ClipboardList, 
  Star, X, CheckCircle, AlertTriangle, Lock, Plus, GitCompare
} from "lucide-react";
import { updateClientStatus, updateClientPriority } from "@/utils/client-helpers";
import { useIsMobile } from "@/hooks/use-mobile";
import EditClientDialog from "./EditClientDialog";
import { format } from "date-fns";

interface NotionTableProps {
  data: Cliente[];
  onClientUpdated: () => void;
  filterValue: string;
}

const NotionTable = ({ data, onClientUpdated, filterValue }: NotionTableProps) => {
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleEditClick = (client: Cliente) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };
  
  const handleStatusChange = (clientId: string, newStatus: string) => {
    updateClientStatus(clientId, newStatus, onClientUpdated);
  };

  const handlePriorityChange = (clientId: string, priority: string) => {
    updateClientPriority(clientId, priority, onClientUpdated);
  };

  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lead": return <Star className="h-4 w-4 text-gray-500" />;
      case "qualificado": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "negociacao": return <GitCompare className="h-4 w-4 text-purple-500" />;
      case "fechado": return <Lock className="h-4 w-4 text-green-500" />;
      case "perdido": return <X className="h-4 w-4 text-red-500" />;
      case "novo": return <Plus className="h-4 w-4 text-teal-500" />;
      case "desqualificado": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Plus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Priority icon mapping
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "alta": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "media": return <Flag className="h-4 w-4 text-amber-500" />;
      case "baixa": return <Flag className="h-4 w-4 text-blue-400" />;
      default: return <Flag className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format date function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  
  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Cliente/Empresa</TableHead>
            {!isMobile && <TableHead>Email/Telefone</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            {!isMobile && <TableHead>Valor</TableHead>}
            {!isMobile && <TableHead>Próximos passos</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 6} className="h-24 text-center">
                {filterValue ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado. Adicione um novo cliente."}
              </TableCell>
            </TableRow>
          ) : (
            data.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleEditClick(client)}
              >
                <TableCell>
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{client.nome}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" /> {client.empresa}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                {!isMobile && (
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{client.email}</span>
                      </div>
                      {client.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{client.telefone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
                
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={client.status}
                    onValueChange={(value) => handleStatusChange(client.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(client.status)}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gray-500" />
                          <span>Lead</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="qualificado">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Qualificado</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="negociacao">
                        <div className="flex items-center gap-2">
                          <GitCompare className="h-4 w-4 text-purple-500" />
                          <span>Negociação</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fechado">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-green-500" />
                          <span>Fechado</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="perdido">
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span>Perdido</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="novo">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-teal-500" />
                          <span>Novo</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="desqualificado">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span>Desqualificado</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={client.prioridade}
                    onValueChange={(value) => handlePriorityChange(client.id, value)}
                  >
                    <SelectTrigger className="w-[110px]">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(client.prioridade)}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Alta</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="media">
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-amber-500" />
                          <span>Média</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="baixa">
                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-blue-400" />
                          <span>Baixa</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                
                {!isMobile && (
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                      {client.valor_estimado || "R$ 0"}
                    </div>
                  </TableCell>
                )}
                
                {!isMobile && (
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-sm">
                      {client.ultimo_contato && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Último contato: {formatDate(client.ultimo_contato)}</span>
                        </div>
                      )}
                      {client.data_fechamento && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Previsão fechamento: {formatDate(client.data_fechamento)}</span>
                        </div>
                      )}
                      {client.responsavel && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Resp: {client.responsavel}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <EditClientDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        client={editingClient}
        onSaved={onClientUpdated}
      />
    </div>
  );
};

export default NotionTable;
