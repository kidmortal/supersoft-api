import { Request, Response } from "express";
import { FireBirdDB } from "../database/FireBirdDB";

export async function PedidosController(req: Request, res: Response, DB) {
  let { numero, cnpj } = req.query;
  if (numero)
    return res
      .status(200)
      .json(await FireBirdDB.FetchPedidoByNumero(numero, DB));
  if (cnpj)
    return res
      .status(200)
      .json(await FireBirdDB.FetchPedidoByCliente(cnpj, DB));

  return res.status(500).json({ erro: "Nenhum parametro foi informado" });
}
