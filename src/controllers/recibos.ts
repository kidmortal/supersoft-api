import FireBird from "firebird";
import { Request, Response } from "express";
import { FireBirdDB } from "../database/FireBirdDB";
import { HandleResponse, ParseSql } from "../database/utils";
import { GetTodayDateString, ParseDateToUS } from "../utils/functions";
import { SSPedido } from "../models/supersoft/pedido";

export type ParseSqlPedidoParams = {
  numero?: number;
  cnpj?: string;
  nome?: string;
  dataInicio?: string;
  dataFim?: string;
  vendedor?: number;
};

export async function RecibosController(req: Request, res: Response, DB) {
  let { params } = req.body;
  let { id } = req.params;

  if (id)
    return res
      .status(200)
      .json(await FetchReciboByParams({ numero: parseInt(id) }, DB));

  if (params)
    return res.status(200).json(await FetchReciboByParams(params, DB));

  if (req.method === "GET")
    return res.status(200).json(await FireBirdDB.FetchPedidoByParams({}, DB));

  return res.status(500).json({
    erro: "Nenhum parametro foi informado",
    params: {
      numero: 0,
      cnpj: "00000",
      dataInicio: "00/00/0000",
      dataFim: "00/00/0000",
    } as ParseSqlPedidoParams,
  });
}

async function ParseSqlRecibo(filters: ParseSqlPedidoParams, DB) {
  let parsed = ParseSql("FetchReciboByNumero", {});
  let query = "\nWHERE\n";
  if (Object.keys(filters).length > 0) {
    let filterArray = [];
    filterArray.push("RECIBOS.MODELO = 'RC'");
    let { numero, cnpj, nome, dataInicio, dataFim, vendedor } = filters;
    if (nome) {
      let data = await this.FetchClienteByNome(nome, DB);
      console.log(data);
      if (data.length > 0) cnpj = data[0].NUMERO;
    }
    numero && filterArray.push(`RECIBOS.NUMNOTA = ${numero}`);
    cnpj && filterArray.push(`RECIBOS.NUMEROCLI = '${cnpj}'`);
    dataInicio &&
      filterArray.push(
        `RECIBOS.DTEMISSAO BETWEEN '${ParseDateToUS(dataInicio)}' AND '${
          ParseDateToUS(dataFim) || GetTodayDateString()
        }'`
      );
    vendedor && filterArray.push(`RECIBOS.CODVENDEDOR = ${vendedor}`);
    let filter = filterArray.join("\nAND\n");
    query += filter;
  }
  console.log(parsed + query);
  return parsed + query;
}

async function FetchReciboByParams(
  params: ParseSqlPedidoParams,
  DB: FireBird.Connection
) {
  let parsed = await ParseSqlRecibo(params, DB);
  let pedidos = await HandleResponse(parsed, DB);
  if (pedidos.length < 1)
    return {
      error: `Nao ha recibos para os parametros selecionados`,
      params,
    };
  return pedidos;
}

function NestPedidos(array: SSPedido[]) {
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
