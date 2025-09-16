import dotenv from "dotenv";
import mysql, { Connection } from "mysql2";

// Cargar variables de entorno desde .env
dotenv.config();

class Database {
  private connection: Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT), // aseguramos que sea número
    });
  }

  public connect(): void {
    this.connection.connect((err) => {
      if (err) {
        console.error("❌ Error al conectar a la base de datos:", err.message);
        return;
      }
      console.log("✅ Conexión a la base de datos exitosa!");

      // Ejemplo de query opcional para comprobar conexión
      this.connection.query("SHOW TABLES", (err, results) => {
        if (err) {
          console.error("❌ Error al ejecutar SHOW TABLES:", err.message);
        } else {
          console.log("📂 Tablas en la base de datos:", results);
        }

        this.close(); // cerramos después de la prueba
      });
    });
  }

  public close(): void {
    this.connection.end((err) => {
      if (err) {
        console.error("❌ Error al cerrar la conexión:", err.message);
        return;
      }
      console.log("🔒 Conexión cerrada correctamente");
    });
  }

  public getConnection(): Connection {
    return this.connection;
  }
}

// Exportamos una instancia lista para usar
const db = new Database();
export default db;
