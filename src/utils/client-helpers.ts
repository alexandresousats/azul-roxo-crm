
import { Cliente } from "@/types/cliente";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const updateClientStatus = async (
  clientId: string,
  status: string,
  onSuccess?: () => void
) => {
  try {
    const { error } = await supabase
      .from("clientes")
      .update({ status })
      .eq("id", clientId);

    if (error) throw error;

    toast.success(`Status do cliente atualizado para ${status}`);
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    toast.error("Erro ao atualizar status do cliente");
  }
};

export const updateClientPriority = async (
  clientId: string,
  prioridade: string,
  onSuccess?: () => void
) => {
  try {
    const { error } = await supabase
      .from("clientes")
      .update({ prioridade })
      .eq("id", clientId);

    if (error) throw error;

    toast.success(`Prioridade do cliente atualizada para ${prioridade}`);
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Erro ao atualizar prioridade:", error);
    toast.error("Erro ao atualizar prioridade do cliente");
  }
};

export const deleteClient = async (
  clientId: string,
  onSuccess?: () => void
) => {
  try {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", clientId);

    if (error) throw error;

    toast.success("Cliente excluído com sucesso");
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    toast.error("Erro ao excluir o cliente");
  }
};

export const updateClientInfo = async (
  clientId: string,
  clientData: Partial<Cliente>,
  onSuccess?: () => void
) => {
  try {
    // Convert date objects to strings in ISO format for database storage
    const dataToSave = { ...clientData };
    
    if (clientData.ultimo_contato && typeof clientData.ultimo_contato !== 'string') {
      dataToSave.ultimo_contato = clientData.ultimo_contato instanceof Date 
        ? clientData.ultimo_contato.toISOString().split('T')[0]
        : clientData.ultimo_contato;
    }
    
    if (clientData.data_fechamento && typeof clientData.data_fechamento !== 'string') {
      dataToSave.data_fechamento = clientData.data_fechamento instanceof Date
        ? clientData.data_fechamento.toISOString().split('T')[0]
        : clientData.data_fechamento;
    }

    const { error } = await supabase
      .from("clientes")
      .update(dataToSave)
      .eq("id", clientId);

    if (error) throw error;

    toast.success("Informações do cliente atualizadas");
    if (onSuccess) onSuccess();
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    toast.error("Erro ao atualizar informações do cliente");
    return { success: false, error };
  }
};
