import { MercosProduto } from "./produto";

export type MercosPedido = {
  id: number;
  cliente_id: number;
  cliente_razao_social: string;
  cliente_nome_fantasia: string;
  cliente_cnpj: string;
  cliente_inscricao_estadual: string;
  cliente_rua: string;
  cliente_numero: string;
  cliente_complemento: string;
  cliente_cep: string;
  cliente_bairro: string;
  cliente_cidade: string;
  cliente_estado: string;
  cliente_suframa: string;
  representada_id: number;
  representada_nome_fantasia: string;
  representada_razao_social: string;
  transportadora_id: number;
  criador_id: number;
  nome_contato: string;
  status: "0" | "1" | "2"; // 0 cancelado , 1 orcamento , 2 pedido
  numero: number;
  rastreamento: string;
  valor_frete: number;
  total: number;
  condicao_pagamento: string;
  condicao_pagamento_id: number;
  tipo_pedido_id: number;
  forma_pagamento_id: number;
  data_emissao: Date;
  observacoes: string;
  status_faturamento: number; // 0 nao faturado , 1 parcialmente faturado, 2 faturado
  status_custom_id: number;
  items: MercosProduto[];
};
