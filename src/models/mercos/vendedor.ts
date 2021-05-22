import { MercosProduto } from "./produto";

export type MercosVendedor = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  administrador: boolean;
  excludo: boolean;
};
