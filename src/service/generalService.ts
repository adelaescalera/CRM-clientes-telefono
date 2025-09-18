import { DB } from "../config/typeorm";

export class generalService {
  public static async getTables() {
    try {
      //const rows = await DB.query("SHOW TABLES");
      //return rows;
      return DB.entityMetadatas.map(entity => entity.tableName);


    } catch (err) {
      console.error("Error en generalService.getTables:", err);
      throw err;
    }
  }
}
