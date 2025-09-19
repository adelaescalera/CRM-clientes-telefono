import { DB } from "../config/typeorm";
import { Cliente } from "../entities/cliente";

export class clienteService {
  public static async getAllClientes() {
    try {
      const repo = DB.getRepository(Cliente);
      const clientes = await repo.find();
//    const clientes = await repo.find({ relations: ["telefonos"] }); //para que te muestre tambien los telefonos
      return clientes;
    } catch (err) {
      console.error("Error en clienteService.getAllClientes:", err);
      throw err;
    }
  }
}
