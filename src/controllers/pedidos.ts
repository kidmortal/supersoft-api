import { Request, Response } from "express";
import { FireBirdDB } from "../database/FireBirdDB";

export type ParseSqlPedidoParams = {
  numero?: number;
  cnpj?: string;
  nome?: string;
  dataInicio?: string;
  dataFim?: string;
  vendedor?: number;
};

export async function PedidosController(req: Request, res: Response, DB) {
  let { params } = req.body;
  let { id } = req.params;

  if (id)
    return res
      .status(200)
      .json(await FireBirdDB.FetchPedidoByParams({ numero: parseInt(id) }, DB));

  if (params)
    return res
      .status(200)
      .json(await FireBirdDB.FetchPedidoByParams(params, DB));

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
