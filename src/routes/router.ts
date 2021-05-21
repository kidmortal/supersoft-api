import { PedidosController } from "../database/firebird";
import FireBird from "firebird";

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
    "C:/Users/User/Desktop/database/SUPERSOFT.FDB",
    "sysdba",
    "masterkey",
    ""
  );
  return DB;
}

export async function configRoutes(app) {
  let DB = await GetDatabase();
  app.get("/pedidos", async (req, res) => {
    PedidosController(req, res, DB);
  });
}
