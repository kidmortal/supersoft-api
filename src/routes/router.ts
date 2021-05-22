import FireBird from "firebird";
import { MercosController } from "../controllers/mercos";
import { PedidosController } from "../controllers/pedidos";

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
    process.env.DB_PATH,
    process.env.DB_USER,
    process.env.DB_PWD,
    ""
  );
  return DB;
}

export async function configRoutes(app) {
  let DB = await GetDatabase();
  app.get("/pedidos", async (req, res) => {
    PedidosController(req, res, DB);
  });
  app.post("/mercos", async (req, res) => {
    MercosController(req, res, DB);
  });
}
