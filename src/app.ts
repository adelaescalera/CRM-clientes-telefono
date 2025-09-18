import db from "./config/db";
import express from "./config/express";

const server = new express();
const PORT = process.env.PORT || 3000;

server.start(async() => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
  await db.getConnection();
});


/*
async function main() {
  try {
    // Ejecutar una consulta
    const tables = await db.query("SHOW TABLES");
    console.log("Tablas en la base de datos:", tables);

    // Insertar un cliente
    await db.query(
      "INSERT INTO cliente (DNI, Nombre, Direccion) VALUES (?, ?, ?)",
      ["99988877Z", "Juan Torres", "Calle Nueva 12"]
    );

    // Consultar clientes
    const clients = await db.query("SELECT * FROM cliente");
    console.log("Clientes:", clients);
  } catch (err) {
    console.error(err);
  } finally {
    await db.close(); // cerrar pool al final
  }
}

main();


// Esto conecta y luego muestra las tablas
//db.connect();

*/