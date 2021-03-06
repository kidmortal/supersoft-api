import { exec } from "child_process";
import { Request, Response } from "express";
import FireBird from "firebird";
import { MercosController } from "../controllers/mercos";
import { PedidosController } from "../controllers/pedidos";
import { ProdutosController } from "../controllers/produtos";
import { RecibosController } from "../controllers/recibos";
import { AutoUpdateFromGithub } from "../utils/autoUpdate";

function checkKey(req, res) {
  let { key } = req.query;
  if (!key) {
    res.status(200).json({ erro: "Key não informada" });
    return true;
  }
  if (key !== process.env.APIKEY) {
    res.status(200).json({ erro: "Key Incorreta" });
    return true;
  }
}
async function GetDatabase(): Promise<FireBird.Connection> {
  const DB = FireBird.createConnection();
  DB.connectSync(
    `${process.cwd()}\\${process.env.DB_NAME}`,
    process.env.DB_USER,
    process.env.DB_PWD,
    ""
  );
  return DB;
}

export async function configRoutes(app) {
  let DB = await GetDatabase();
  app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({ message: "isso ae" });
  });
  app.post("/pedidos", async (req, res) => {
    PedidosController(req, res, DB);
  });
  app.get("/pedidos", async (req, res) => {
    PedidosController(req, res, DB);
  });
  app.get("/pedidos/:id", async (req, res) => {
    PedidosController(req, res, DB);
  });
  app.get("/recibos", async (req, res) => {
    RecibosController(req, res, DB);
  });
  app.get("/recibos/:id", async (req, res) => {
    RecibosController(req, res, DB);
  });
  app.get("/produtos", async (req, res) => {
    ProdutosController(req, res, DB);
  });
  app.get("/produtos/:id", async (req, res) => {
    ProdutosController(req, res, DB);
  });
  app.post("/mercos", async (req, res) => {
    MercosController(req, res, DB);
  });
  app.post("/github", async (req, res) => {
    AutoUpdateFromGithub(req, res);
  });
}
