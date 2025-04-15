
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
