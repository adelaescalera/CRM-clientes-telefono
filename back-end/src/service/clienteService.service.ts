import { DB } from "../config/typeorm";
import { Cliente } from "../entities/cliente";

export class clienteService {

  public static async getAllClientes() {
    try {
      const repo = DB.getRepository(Cliente);
      //   const clientes = await repo.find();
      const clientes = await repo.find({ relations: ["telefonos"] }); //para que te muestre tambien los telefonos
      return clientes;
    } catch (err) {
      console.error("Error en clienteService.getAllClientes:", err);
      throw err;
    }
  }

  public static async addCliente(data: Cliente) {
    try {
      let result = await DB.getRepository(Cliente).save(data);
      console.log("Cliente añadido:", result);
      return result;
    } catch (err) {
      console.error("Error en clienteService.addCliente:", err);
      throw err;
    }
  }

  public static async deleteCliente(id: number): Promise<void> {
    const clienteRepo = DB.getRepository(Cliente);

    const cliente = await clienteRepo.findOneBy({ id });
    if (!cliente) {
      throw new Error(`Cliente con id ${id} no encontrado`);
    }

    await clienteRepo.remove(cliente);
  }

  public static async updateCliente(id: number, data: Partial<Cliente>) {
    const repo = DB.getRepository(Cliente);
    const cliente = await repo.findOne({ where: { id } });
    if (!cliente) return null;

    Object.assign(cliente, data);
    return await repo.save(cliente);
  }
}

/* en postman hacemos con post , body , raw , json ---->
{
    "dni": "11223344A",
    "nombre": "Test"
}  */


