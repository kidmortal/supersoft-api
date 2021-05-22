import { Request, Response } from "express";
import { FetchPedidoByCliente, FetchPedidoByNumero } from "../database/fetch";

export async function PedidosController(req: Request, res: Response, DB) {
  let { numero, cnpj } = req.query;
  if (numero)
    return res.status(200).json(await FetchPedidoByNumero(numero, DB));
  if (cnpj) return res.status(200).json(await FetchPedidoByCliente(cnpj, DB));

  return res.status(500).json({ erro: "Nenhum parametro foi informado" });
}
