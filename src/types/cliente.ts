
export interface Cliente {
  id: string;
  empresa: string;
  nome: string;
  ultimo_contato?: string | Date;
  user_id: string;
  created_at: string;
  links?: string;
  telefone?: string;
  email: string;
  responsavel?: string;
  valor_estimado?: string;
  prioridade: string;
  data_fechamento?: string | Date;
  status: string;
}
