
import { useState } from "react";
import { Cliente } from "@/types/cliente";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { updateClientStatus, deleteClient } from "@/utils/client-helpers";
import EditClientDialog from "./EditClientDialog";

interface ClientesListProps {
  data: Cliente[];
  onClientUpdated: () => void;
  filterValue: string;
}

const ClientesList = ({ data, onClientUpdated, filterValue }: ClientesListProps) => {
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "lead":
        return "bg-gray-200 text-gray-800";
      case "qualificado":
        return "bg-blue-100 text-blue-800";
      case "negociacao":
        return "bg-indigo-100 text-indigo-800";
      case "fechado":
        return "bg-green-100 text-green-800";
      case "perdido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPriorityBadge = (prioridade: string) => {
    switch (prioridade) {
      case "baixa":
        return <Badge variant="outline">Baixa</Badge>;
      case "media":
        return <Badge variant="secondary">Média</Badge>;
      case "alta":
        return <Badge variant="destructive">Alta</Badge>;
      default:
        return <Badge variant="secondary">Média</Badge>;
    }
  };

  const handleEditClient = (client: Cliente) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingClient(null);
  };

  const handleStatusUpdate = (clientId: string, status: string) => {
    updateClientStatus(clientId, status, onClientUpdated);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete, onClientUpdated);
      setClientToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length === 0 && (
          <div className="col-span-full text-center p-8">
            <p className="text-muted-foreground">
              {filterValue ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado. Adicione um novo cliente."}
            </p>
          </div>
        )}

        {data.map((cliente) => (
          <div
            key={cliente.id}
            className="bg-card rounded-lg border shadow-sm p-4 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                <p className="text-sm text-muted-foreground">{cliente.empresa}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditClient(cliente)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setClientToDelete(cliente.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-2">
              <div className="text-sm">
                <span className="font-medium">Email:</span> {cliente.email}
              </div>
              {cliente.telefone && (
                <div className="text-sm">
                  <span className="font-medium">Telefone:</span> {cliente.telefone}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <Badge className={`${getBadgeColor(cliente.status)}`}>
                  {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                </Badge>
                <div className="mt-1">{getPriorityBadge(cliente.prioridade)}</div>
              </div>
              <div className="text-sm text-right">
                <div>{cliente.valor_estimado}</div>
                {cliente.ultimo_contato && (
                  <div className="text-muted-foreground text-xs">
                    Contato: {new Date(cliente.ultimo_contato).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditClientDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        client={editingClient}
        onSaved={onClientUpdated}
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
    </>
  );
};

export default ClientesList;
