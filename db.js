//MODULARIZAR LA CONEXIÓN A LA BASE DE DATOS CON CLASES COMO DANI


import dotenv from "dotenv";
import mysql from "mysql2";

// Cargar variables de entorno desde .env
dotenv.config();

// Crear la conexión
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Conectar a la base de datos y manejar errores para que no se quede colgado
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
    return;
  }
  console.log("Conexión a la base de datos exitosa!");

  /* Línea añadida: mostrar tablas existentes
   connection.query("SHOW TABLES", (err, results) => {
    if (err) {
      console.error("Error al ejecutar SHOW TABLES:", err.message);
    } else {
      console.log("Tablas en la base de datos:", results);
    }
   */


    // Cerrar la conexión después de la consulta
    connection.end((err) => {
      if (err) {
        console.error("Error al cerrar la conexión:", err.message);
        return;
      }
      console.log("Conexión cerrada correctamente");
    });
  });
//});

// Exportar la conexión si más adelante quieres usarla en otros archivos
export default connection;
