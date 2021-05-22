import { ParseSql } from "./utils";

export function InsertPedidoAsPedido(pedido: SSPedido) {
  let parsed = ParseSql("FetchPedidoByNumero", pedido);
}

export function InsertPedidoAsOrcamento() {}
