import { Request, Response } from "express";
import FireBird from "firebird";
import { FireBirdDB } from "../database/FireBirdDB";
import { MercosPedido } from "../models/mercos/pedido";
import { MercosProduto } from "../models/mercos/produto";
import { erro } from "../models/misc/erro";
import { SSProduto } from "../models/supersoft/produto";
import { Mercos } from "../services/mercos";

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
  let vendedor = await ParseVendedor(pedido.criador_id, DB);
  return { cliente, transportadora, condicao, vendedor, produtos };
}

export async function ParseItems(
  produtos: MercosProduto[],
  DB: FireBird.Connection
) {
  if (produtos.length < 1) return { erro: "Array de items vazio" };
  let produtosSS: SSProduto[] = [];
  for (let index = 0; index < produtos.length; index++) {
    const produtoMercos = produtos[index];
    const produtoSS = await FireBirdDB.FetchProdutoByCodigo(
      produtoMercos.produto_codigo,
      DB
    );
    produtosSS.push(produtoSS);
  }
  return produtosSS;
}
export async function ParseCliente(cnpj, DB) {
  if (!cnpj) return { erro: "Nenhum cliente_cnpj no pedido" };
  const clienteSS = await FireBirdDB.FetchClienteByCnpj(cnpj, DB);
  return clienteSS;
}
export async function ParseTransportadora(codigo, DB) {
  if (!codigo) return { erro: "Nenhuma transportadora_id no pedido" };
  const transportadoraSS = await FireBirdDB.FetchTransportadoraByCodigo(
    codigo,
    DB
  );
  return transportadoraSS;
}
export async function ParseCondicao(condicao, DB) {
  if (!condicao) return { erro: "Nenhuma condicao_pagamento no pedido" };
  const condicaoSS = await FireBirdDB.FetchCondicaoByDescricao(condicao, DB);
  return condicaoSS;
}
export async function ParseVendedor(id, DB) {
  if (!id) return { erro: "Nenhuma criador_id no pedido" };
  let vendedorMercos = Mercos.FetchVendedorById(id);
  const condicaoSS = await FireBirdDB.FetchVendedorByNome(
    vendedorMercos.nome,
    DB
  );
  return condicaoSS;
}
