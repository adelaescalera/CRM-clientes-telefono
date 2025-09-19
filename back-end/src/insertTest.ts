//ESTO ESTA BIEN ?????? COMO INSERTAR DATOS DE PRUEBA

//PREGUNTAAAAR

import { initOrm, DB } from "./config/typeorm";
import { Cliente } from "./entities/cliente";
import { Telefono } from "./entities/telefono";

const insertTestData = async () => {
  await initOrm();

  const clienteRepo = DB.getRepository(Cliente);
  const telefonoRepo = DB.getRepository(Telefono);

  // Crear cliente
  const cliente = clienteRepo.create({
    dni: "12345678A",
    nombre: "Juan Pérez",
    direccion: "Calle Falsa 123",
  });
  await clienteRepo.save(cliente);

  // Crear teléfono asociado
  const telefono = telefonoRepo.create({
    numero: "600111222",
    type: "mobile",
    cliente: cliente, // relación
  });
  await telefonoRepo.save(telefono);

  console.log("Datos de prueba insertados correctamente");
  process.exit(0);
};

insertTestData();
