import { DB } from "../config/typeorm";
import { Cliente } from "../entities/cliente";
import { Telefono } from "../entities/telefono";

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

public static async updateClient(id: number, data: any) {
    const clienteRepo = DB.getRepository(Cliente);
    const telefonoRepo = DB.getRepository(Telefono);

    const cliente = await clienteRepo.findOne({
      where: { id },
      relations: ["telefonos"] // traer los teléfonos
    });

    if (!cliente) throw new Error("Cliente no encontrado");


    cliente.nombre = data.nombre ?? cliente.nombre;
    cliente.dni = data.dni ?? cliente.dni;
    cliente.direccion = data.direccion ?? cliente.direccion;

    
    if (data.telefonos && Array.isArray(data.telefonos)) {

      await telefonoRepo.delete({ cliente: { id: cliente.id } });

      cliente.telefonos = data.telefonos.map((t: any) => {
        const tel = new Telefono();
        tel.numero = t.numero;
        tel.type = t.type;
        tel.cliente = cliente; 
        return tel;
      });
    }

    await clienteRepo.save(cliente);

    return {
      id: cliente.id,
      nombre: cliente.nombre,
      dni: cliente.dni,
      direccion: cliente.direccion,
      telefonos: cliente.telefonos.map(t => ({
        numero: t.numero,
        type: t.type
      }))
    };
  }


}

/* en postman hacemos con post , body , raw , json ---->
{
    "dni": "11223344A",
    "nombre": "Test"
}  */


