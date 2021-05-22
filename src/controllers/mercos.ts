import { Request, Response } from "express";
import FireBird from "firebird";
import {
  FetchProdutoByCodigo,
  FetchClienteByCnpj,
  FetchTransportadoraByCodigo,
  FetchCondicaoByDescricao,
} from "../database/fetch";
import { MercosPedido } from "../models/mercos/pedido";
import { MercosProduto } from "../models/mercos/produto";
import { SSCliente } from "../models/supersoft/cliente";
import { SSProduto } from "../models/supersoft/produto";
import { SSTransportadora } from "../models/supersoft/transportadora";

export async function MercosController(req: Request, res: Response, DB) {
  let { pedido } = req.body;
  if (pedido)
    return res
      .status(200)
      .json(await InsertPedidoFromMercosToSupersoft(pedido, DB));

  return res.status(500).json({ erro: "Nenhum pedido foi informado" });
}

export async function InsertPedidoFromMercosToSupersoft(
  pedido: MercosPedido,
  DB: FireBird.Connection
) {
  if (!pedido.items) return { erro: "Nenhum array de item no pedido" };
  let produtos = await ParseItems(pedido.items, DB);
  let cliente = await ParseCliente(pedido.cliente_cnpj, DB);
  let transportadora = await ParseTransportadora(pedido.transportadora_id, DB);
  let condicao = await ParseCondicao(pedido.condicao_pagamento, DB);
  return { cliente, transportadora, condicao, produtos };
}

export async function ParseItems(
  produtos: MercosProduto[],
  DB: FireBird.Connection
) {
  if (produtos.length < 1) return { erro: "Array de items vazio" };
  let produtosSS = [];
  for (let index = 0; index < produtos.length; index++) {
    const produtoMercos = produtos[index];
    const produtoSS = await FetchProdutoByCodigo(
      produtoMercos.produto_codigo,
      DB
    );
    produtosSS.push(produtoSS);
  }
  return produtosSS;
}
export async function ParseCliente(cnpj, DB) {
  if (!cnpj) return { erro: "Nenhum cliente_cnpj no pedido" };
  const clienteSS = await FetchClienteByCnpj(cnpj, DB);
  return clienteSS;
}
export async function ParseTransportadora(codigo, DB) {
  if (!codigo) return { erro: "Nenhuma transportadora_id no pedido" };
  const transportadoraSS = await FetchTransportadoraByCodigo(codigo, DB);
  return transportadoraSS;
}
export async function ParseCondicao(condicao, DB) {
  if (!condicao) return { erro: "Nenhuma condicao_pagamento no pedido" };
  const condicaoSS = await FetchCondicaoByDescricao(condicao, DB);
  return condicaoSS;
}
