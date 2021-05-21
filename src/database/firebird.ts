import { Request, Response } from "express";
const sql = require("yesql")("src/database", { type: "mysql" });
import FireBird from "firebird";

type ParseParams = {
  sql: string;
  values: string[];
};

function ObjectToNestedObject(obj: object) {
  let nestedObject = {};
  let keys = Object.keys(obj);
  keys.forEach((key) => {
    let keyValue = obj[key];
    if (key.includes(".")) {
      let split = key.split(".");
      nestedObject[split[0]] = {};
      nestedObject[split[0]][split[1]] = keyValue;
    } else {
      nestedObject[key] = keyValue;
    }
  });
  return nestedObject;
}

function ArrayToNested(array: object[]) {
  let nestedArray = [];
  array.forEach((obj) => {
    let nestedObject = ObjectToNestedObject(obj);
    nestedArray.push(nestedObject);
  });

  return nestedArray;
}

function ParseSql(query: string, params: {}) {
  let parseParams: ParseParams = sql[query]?.(params);
  parseParams.sql = parseParams.sql.replace(`-- ${query}\n`, "");
  parseParams.values.forEach((param) => {
    parseParams.sql = parseParams.sql.replace(`?`, param);
  });
  return parseParams.sql;
}
async function HandleResponse(query: string, DB: FireBird.Connection) {
  let response = await DB.querySync(query);
  let data = await response.fetchSync("all", true);
  let nestedArray = ArrayToNested(data);
  return nestedArray;
}

async function BindProdutosToPedido(pedido, DB) {
  let pedidoNumero = parseInt(pedido.NUMPEDIDO);
  pedido.PRODUTOS = await FetchProdutosFromPedidoByNumero(pedidoNumero, DB);
  return pedido;
}

export async function PedidosController(req: Request, res: Response, DB) {
  let { numero, cnpj } = req.query;
  if (numero)
    return res.status(200).json(await FetchPedidoByNumero(numero, DB));
  if (cnpj) return res.status(200).json(await FetchPedidoByCliente(cnpj, DB));

  return res.status(500).json({ erro: "Nenhum parametro foi informado" });
}

async function FetchPedidoByNumero(numero, DB: FireBird.Connection) {
  let parsed = ParseSql("FetchPedidoByNumero", { numero });
  let pedido = await HandleResponse(parsed, DB);
  pedido = await BindProdutosToPedido(pedido, DB);
  return pedido;
}
async function FetchPedidoByCliente(cnpj, DB: FireBird.Connection) {
  cnpj = `'${cnpj}'`;
  let parsed = ParseSql("FetchPedidoByCliente", { cnpj });
  let pedidos = await HandleResponse(parsed, DB);
  for (let index = 0; index < pedidos.length; index++) {
    let pedido = pedidos[index];
    pedido = await BindProdutosToPedido(pedido, DB);
  }
  return pedidos;
}

async function FetchProdutosFromPedidoByNumero(
  numero,
  DB: FireBird.Connection
) {
  let parsed = ParseSql("FetchProdutosFromPedidoByNumero", { numero });
  return await HandleResponse(parsed, DB);
}
