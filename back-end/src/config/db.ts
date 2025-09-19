































// db.ts
/*
import mysql, { Pool } from "mysql2/promise";
import configEnv from "./config"; // tus variables de entorno ya comprobadas

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: configEnv.db.host,
      user: configEnv.db.user,
      password: configEnv.db.password,
      database: process.env.DB_NAME,
      port: configEnv.db.port,
      waitForConnections: true,
      connectionLimit: 10, // máximo de conexiones simultáneas
      queueLimit: 0,       // ilimitado
    });
  }

  public async getConnection(): Promise<void> {
    try {
      const connection = await this.pool.getConnection();
      console.log("Conexión al pool exitosa!");
    } catch (err) {
      console.error("Error al conectar a la base de datos:", err);
      throw err;
    }
  }

  // Método genérico para ejecutar consultas
  public async query(sql: string, params?: any): Promise<any> {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (err) {
      console.error("Error en la query:", err);
      throw err;
    }
  }

  // Cerrar el pool de conexiones
  public async close(): Promise<void> {
    try {
      await this.pool.end();
      console.log("Pool cerrado correctamente");
    } catch (err) {
      console.error("Error al cerrar el pool:", err);
    }
  }

  // Obtener el pool directamente si es necesario
  public getPool(): Pool {
    return this.pool;
  }
}

// Exportamos una instancia lista para usar
export default new Database();



/*

 // Método para probar la conexión y listar tablas
  public connect(): void {
    this.pool.getConnection((err: any, connection: PoolConnection) => {
      if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
        return;
      }
      console.log("Conexión al pool exitosa!");

      // Ejemplo: listar tablas
      connection.query("SHOW TABLES", (err, results) => {
        if (err) {
          console.error("Error al ejecutar SHOW TABLES:", err.message);
        } else {
          console.log("Tablas en la base de datos:", results);
        }

        connection.release(); // devolvemos la conexión al pool
      });
    });
  }

  */