import FireBird from "firebird";
import { SSCliente } from "../models/supersoft/cliente";
import { SSCondicao } from "../models/supersoft/condicao";
import { SSProduto } from "../models/supersoft/produto";
import { SSTransportadora } from "../models/supersoft/transportadora";
import { SSVendedor } from "../models/supersoft/vendedor";
import { HandleResponse, NestPedidos, ParseSql } from "./utils";
import { GetTodayDateString, ParseDateToUS } from "../utils/functions";
import { ParseSqlPedidoParams } from "../controllers/pedidos";

class FirebirdClass {
  async ParseSqlPedido(filters: ParseSqlPedidoParams, DB) {
    let parsed = ParseSql("FetchPedidoByNumero", {});
    let query = "";
    if (Object.keys(filters).length > 0) {
      query = "\nWHERE \n";
      let filterArray = [];
      let { numero, cnpj, nome, dataInicio, dataFim, vendedor } = filters;
      if (nome) {
        let data = await this.FetchClienteByNome(nome, DB);
        console.log(data);
        if (data.length > 0) cnpj = data[0].NUMERO;
      }
      numero && filterArray.push(`NUMPEDIDO = ${numero}`);
      cnpj && filterArray.push(`NUMEROCLI = '${cnpj}'`);
      dataInicio &&
        filterArray.push(
          `DATAEMISSAO BETWEEN '${ParseDateToUS(dataInicio)}' AND '${
            ParseDateToUS(dataFim) || GetTodayDateString()
          }'`
        );
      vendedor && filterArray.push(`CODVENDEDOR = ${vendedor}`);
      let filter = filterArray.join("\nAND\n");
      query += filter;
    }
    console.log(parsed + query);
    return parsed + query;
  }

  async FetchPedidoByParams(
    params: ParseSqlPedidoParams,
    DB: FireBird.Connection
  ) {
    let parsed = await this.ParseSqlPedido(params, DB);
    let pedidos = await HandleResponse(parsed, DB);
    if (pedidos.length < 1)
      return {
        error: `Nao ha pedidos para os parametros selecionados`,
        params,
      };
    let nest = NestPedidos(pedidos);
    return nest;
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

  async FetchClienteByNome(nome, DB: FireBird.Connection) {
    let clientes: SSCliente[] = [];
    let cliente: SSCliente = {
      NUMERO: "000000",
      RAZSOC: `Cliente não encontrado`,
    };
    clientes.push(cliente);
    let parsed =
      ParseSql("FetchClienteByNome", {}) + `\nWHERE RAZSOC LIKE '%${nome}%'`;
    console.log(parsed);
    let response = await DB.querySync(parsed);
    let data = await response.fetchSync<SSCliente>(1, true);
    if (data.length > 0) return data;
    return clientes;
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
