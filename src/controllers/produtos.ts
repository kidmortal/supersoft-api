import { Request, Response } from "express";
import { FireBirdDB } from "../database/FireBirdDB";

export async function ProdutosController(req: Request, res: Response, DB) {
  let { id } = req.params;
  if (id)
    return res.status(200).json(await FireBirdDB.FetchProdutoByCodigo(id, DB));

  return res.status(500).json({
    erro: "Nenhum parametro foi informado",
  });
}
