export type SSPedido = {
  ABREV?: string;
  MODELO?: "PE";
  NUMPEDIDO?: string;
  NUMEROCLI?: string;
  CODCONDPAG?: number;
  VALORTOTAL?: number;
  DATAEMISSAO?: Date;
  CODVENDEDOR?: number;
  ITEM?: SSPedidoItem;
  ITEMS?: SSPedidoItem[];
};

export type SSPedidoItem = {
  CODIGO?: string;
  QUANTIDADE?: number;
  PRECO?: number;
  LOCAL?: string;
};
