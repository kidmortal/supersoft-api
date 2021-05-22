import FireBird from "firebird";
import { SSProduto } from "../models/supersoft/produto";
import { HandleResponse, ParseSql } from "./utils";

export async function BindProdutosToPedido(pedido, DB) {
  let pedidoNumero = parseInt(pedido.NUMPEDIDO);
  pedido.PRODUTOS = await FetchProdutosFromPedidoByNumero(pedidoNumero, DB);
  return pedido;
}

export async function FetchPedidoByNumero(numero, DB: FireBird.Connection) {
  let parsed = ParseSql("FetchPedidoByNumero", { numero });
  let pedido = await HandleResponse(parsed, DB);
  pedido = await BindProdutosToPedido(pedido, DB);
  return pedido;
}
export async function FetchPedidoByCliente(cnpj, DB: FireBird.Connection) {
  cnpj = `'${cnpj}'`;
  let parsed = ParseSql("FetchPedidoByCliente", { cnpj });
  let pedidos = await HandleResponse(parsed, DB);
  for (let index = 0; index < pedidos.length; index++) {
    let pedido = pedidos[index];
    pedido = await BindProdutosToPedido(pedido, DB);
  }
  return pedidos;
}

export async function FetchProdutosFromPedidoByNumero(
  numero,
  DB: FireBird.Connection
) {
  let parsed = ParseSql("FetchProdutosFromPedidoByNumero", { numero });
  return await HandleResponse(parsed, DB);
}

export async function FetchProdutoByCodigo(codigo, DB: FireBird.Connection) {
  let parsed = ParseSql("FetchProdutoByCodigo", { codigo });
  let response = await DB.querySync(parsed);
  let data = await response.fetchSync(1, true);
  if (data.length > 0) return data[0] as SSProduto;
  return null;
}
