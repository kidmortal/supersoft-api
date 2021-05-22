import FireBird from "firebird";
import { erro } from "../models/misc/erro";
import { SSCliente } from "../models/supersoft/cliente";
import { SSCondicao } from "../models/supersoft/condicao";
import { SSProduto } from "../models/supersoft/produto";
import { SSTransportadora } from "../models/supersoft/transportadora";
import { SSVendedor } from "../models/supersoft/vendedor";
import { HandleResponse, ParseSql } from "./utils";

async function BindProdutosToPedido(pedido, DB) {
  let pedidoNumero = parseInt(pedido.NUMPEDIDO);
  pedido.PRODUTOS = await this.FetchProdutosFromPedidoByNumero(
    pedidoNumero,
    DB
  );
  return pedido;
}

class FirebirdClass {
  async FetchPedidoByNumero(numero, DB: FireBird.Connection) {
    let parsed = ParseSql("FetchPedidoByNumero", { numero });
    let pedido = await HandleResponse(parsed, DB);
    pedido = await BindProdutosToPedido(pedido, DB);
    return pedido;
  }
  async FetchPedidoByCliente(cnpj, DB: FireBird.Connection) {
    cnpj = `'${cnpj}'`;
    let parsed = ParseSql("FetchPedidoByCliente", { cnpj });
    let pedidos = await HandleResponse(parsed, DB);
    for (let index = 0; index < pedidos.length; index++) {
      let pedido = pedidos[index];
      pedido = await BindProdutosToPedido(pedido, DB);
    }
    return pedidos;
  }

  async FetchProdutosFromPedidoByNumero(numero, DB: FireBird.Connection) {
    let parsed = ParseSql("FetchProdutosFromPedidoByNumero", { numero });
    return await HandleResponse(parsed, DB);
  }

  async FetchProdutoByCodigo(codigo, DB: FireBird.Connection) {
    let produto: SSProduto = {
      CODIGO: codigo,
      DESCRICAO: `Produto nao cadastrado`,
    };
    let parsed = ParseSql("FetchProdutoByCodigo", { codigo });
    let response = await DB.querySync(parsed);
    let data = await response.fetchSync<SSProduto>(1, true);
    if (data.length > 0) produto = data[0];
    return produto;
  }

  async FetchClienteByCnpj(cnpj, DB: FireBird.Connection) {
    let cliente: SSCliente = {
      NUMERO: cnpj,
      RAZSOC: `Cliente não encontrado`,
    };
    cnpj = `'${cnpj}'`;
    let parsed = ParseSql("FetchClienteByCnpj", { cnpj });
    let response = await DB.querySync(parsed);
    let data = await response.fetchSync<SSCliente>(1, true);
    if (data.length > 0) cliente = data[0];
    return cliente;
  }

  async FetchTransportadoraByCodigo(codigo, DB: FireBird.Connection) {
    let transportadora: SSTransportadora = {
      NUMERO: codigo,
      NOME: "Transportadora nao encontrada",
    };
    let parsed = ParseSql("FetchTransportadoraByCodigo", { codigo });
    let response = await DB.querySync(parsed);
    let data = await response.fetchSync<SSTransportadora>(1, true);
    if (data.length > 0) transportadora = data[0];
    return transportadora;
  }

  async FetchCondicaoByDescricao(descricao, DB: FireBird.Connection) {
    let condicao: SSCondicao = {
      DESCRICAO: `Condicao '${descricao}' nao cadastrada`,
    };
    descricao = `'${descricao}'`;
    let parsed = ParseSql("FetchCondicaoByDescricao", { descricao });
    let response = await DB.querySync(parsed);
    let data = await response.fetchSync<SSCondicao>(1, true);
    if (data.length > 0) condicao = data[0];
    return condicao;
  }

  async FetchVendedorByNome(nome, DB: FireBird.Connection) {
    let vendedor: SSVendedor = {
      NOME: `Vendedor '${nome}' nao encontrado`,
    };
    nome = `'${nome}'`;
    let parsed = ParseSql("FetchVendedorByNome", { nome });
    let response = await DB.querySync(parsed);
    let data = await response.fetchSync<SSVendedor>(1, true);
    if (data.length > 0) vendedor = data[0];
    return vendedor;
  }
}

export const FireBirdDB = new FirebirdClass();
