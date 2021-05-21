import { configRoutes } from "./routes/router";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configRoutes(app);
app.listen(process.env.PORT, () =>
  console.log(`🍰 Servidor Rodando na porta ${process.env.PORT}`)
);
