import { SSPedido } from "../models/supersoft/pedido";
import { ParseSql } from "./utils";

export function InsertPedidoAsPedido(pedido: SSPedido) {
  let parsed = ParseSql("FetchPedidoByNumero", pedido);
}

export function InsertPedidoAsOrcamento() {}
