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

  public static async addCliente( data:Cliente) {
    try {
      let result= await DB.getRepository(Cliente).save(data);
      console.log("Cliente añadido:", result);
      return result;
    } catch (err) {
      console.error("Error en clienteService.addCliente:", err);
      throw err;
  }
  }

  
/* en postman hacemos con post , body , raw , json ---->
{
    "dni": "11223344A",
    "nombre": "Test"
}  */

}
