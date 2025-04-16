
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cliente } from "@/types/cliente";
import { updateClientInfo, deleteClient } from "@/utils/client-helpers";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EditClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  client: Cliente | null;
  onSaved: () => void;
}

const EditClientDialog = ({
  isOpen,
  onClose,
  client,
  onSaved,
}: EditClientDialogProps) => {
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [dataFechamento, setDataFechamento] = useState<Date | undefined>(undefined);
  const [ultimoContato, setUltimoContato] = useState<Date | undefined>(undefined);
  const isMobile = useIsMobile();

  // Sync form data when client changes
  useEffect(() => {
    if (client) {
      setFormData({ ...client });
      
      // Set date fields if available
      if (client.data_fechamento) {
        try {
          // Handle both string and Date objects
          if (typeof client.data_fechamento === 'string') {
            setDataFechamento(new Date(client.data_fechamento));
          } else {
            setDataFechamento(client.data_fechamento);
          }
        } catch (error) {
          console.error("Error parsing data_fechamento:", error);
          setDataFechamento(undefined);
        }
      } else {
        setDataFechamento(undefined);
      }
      
      if (client.ultimo_contato) {
        try {
          // Handle both string and Date objects
          if (typeof client.ultimo_contato === 'string') {
            setUltimoContato(new Date(client.ultimo_contato));
          } else {
            setUltimoContato(client.ultimo_contato);
          }
        } catch (error) {
          console.error("Error parsing ultimo_contato:", error);
          setUltimoContato(undefined);
        }
      } else {
        setUltimoContato(undefined);
      }
    }
  }, [client]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id) return;

    setIsLoading(true);
    
    // Include the date fields in the update
    const updateData = {
      ...formData,
      data_fechamento: dataFechamento,
      ultimo_contato: ultimoContato,
    };
    
    try {
      const result = await updateClientInfo(client.id, updateData, onSaved);
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar as informações do cliente");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!client?.id) return;
    
    setIsLoading(true);
    await deleteClient(client.id, onSaved);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className={`${isMobile ? 'max-w-[95%]' : 'sm:max-w-[600px]'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente aqui.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do contato</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                name="empresa"
                value={formData.empresa || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                name="responsavel"
                value={formData.responsavel || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_estimado">Valor Estimado</Label>
              <Input
                id="valor_estimado"
                name="valor_estimado"
                value={formData.valor_estimado || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "lead"}
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
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="desqualificado">Desqualificado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade || "media"}
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date picker for último contato */}
            <div className="space-y-2">
              <Label htmlFor="ultimo_contato">Último Contato</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !ultimoContato && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {ultimoContato ? format(ultimoContato, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={ultimoContato}
                    onSelect={setUltimoContato}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Date picker for data fechamento */}
            <div className="space-y-2">
              <Label htmlFor="data_fechamento">Previsão de Fechamento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataFechamento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFechamento ? format(dataFechamento, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFechamento}
                    onSelect={setDataFechamento}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="links">Links</Label>
            <Textarea
              id="links"
              name="links"
              value={formData.links || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''}`}>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className={isMobile ? 'w-full' : ''}
            >
              Excluir Cliente
            </Button>
            <div className={`${isMobile ? 'flex flex-row w-full gap-2' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className={isMobile ? 'flex-1' : ''}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className={isMobile ? 'flex-1' : ''}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
