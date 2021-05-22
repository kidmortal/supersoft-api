import { MercosVendedor } from "../models/mercos/vendedor";

class MercosClass {
  FetchVendedorById(id: number) {
    let vendedor: MercosVendedor = {
      id: 100,
      nome: "GUSTAVO BRAZ DE OLIVEIRA",
      email: "eunaolembro@gmail",
      telefone: "999999",
      administrador: false,
      excludo: false,
    };
    return vendedor;
  }
}

export const Mercos = new MercosClass();
