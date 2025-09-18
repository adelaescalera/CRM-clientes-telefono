import db from "../config/db";

export class generalService {
  public static async getTables() {
    try {
      const rows = await db.query("SHOW TABLES");
      return rows;
    } catch (err) {
      console.error("Error en generalService.getTables:", err);
      throw err;
    }
  }
}
