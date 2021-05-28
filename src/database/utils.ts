import FireBird from "firebird";
import { SSPedido } from "../models/supersoft/pedido";
const sql = require("yesql")("src/database", { type: "mysql" });

type ParseParams = {
  sql: string;
  values: string[];
};

export function ObjectToNestedObject(obj: object) {
  let nestedObject = {};
  let keys = Object.keys(obj);
  keys.forEach((key) => {
    let keyValue = obj[key];
    if (key.includes(".")) {
      let split = key.split(".");
      if (!nestedObject[split[0]]) nestedObject[split[0]] = {};
      nestedObject[split[0]][split[1]] = keyValue;
    } else {
      nestedObject[key] = keyValue;
    }
  });
  return nestedObject;
}

export function PedidoItemsToArray(pedidos: []) {
  pedidos.forEach((pedido) => {});
}

export function ArrayToNested(array: object[]) {
  let nestedArray = [];
  array.forEach((obj) => {
    let nestedObject = ObjectToNestedObject(obj);
    nestedArray.push(nestedObject);
  });

  return nestedArray;
}

export function NestPedidos(array: SSPedido[]) {
  let nestedPedidos = {};
  array.forEach((pedido) => {
    let num = parseInt(pedido.NUMPEDIDO);
    if (!nestedPedidos[num]) {
      nestedPedidos[num] = { ...pedido };
      let nested: SSPedido = nestedPedidos[num];
      nested.ITEMS = [{ ...nested.ITEM }];
      delete nested.ITEM;
    }
    if (nestedPedidos[num]) {
      let nested: SSPedido = nestedPedidos[num];
      nested.ITEMS.push(pedido.ITEM);
    }
  });
  return nestedPedidos;
}

export function ParseSql(query: string, params: {}) {
  let parseParams: ParseParams = sql[query]?.(params);
  parseParams.sql = parseParams.sql.replace(`-- ${query}\n`, "");
  parseParams.values.forEach((param) => {
    parseParams.sql = parseParams.sql.replace(`?`, param);
  });
  return parseParams.sql;
}
export async function HandleResponse(query: string, DB: FireBird.Connection) {
  let response = await DB.querySync(query);
  let data = await response.fetchSync("all", true);
  let nestedArray = ArrayToNested(data);
  return nestedArray;
}
