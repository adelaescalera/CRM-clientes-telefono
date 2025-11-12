// parada.service.ts
import { DB } from "../config/typeorm";
import { Parada } from "../entities/parada";
import { LineaParada } from "../entities/lineas_paradas";
import { Linea } from "../entities/linea";
import { Repository, ObjectLiteral } from "typeorm";

export class ParadaService {

  private static paradaRepo = DB.getRepository(Parada);
  private static lineaRepo = DB.getRepository(Linea);
  private static lineaParadaRepo = DB.getRepository(LineaParada);

  public static async saveParadas(records: any[]): Promise<{ total: number }> {
    try {
      if (!records || records.length === 0) {
        return { total: 0 };
      }

      const paradasMap = new Map<number, Parada>();

      for (const record of records) {
        const { codParada, nombreParada, direccion, lat, lon } = record;

        if (!codParada || !nombreParada || lat == null || lon == null) continue;

        if (!paradasMap.has(codParada)) {
          const parada = new Parada();
          parada.codParada = codParada;
          parada.nombreParada = nombreParada;
          parada.direccion = direccion || null;
          parada.lat = lat || null;
          parada.lon = lon || null;
          paradasMap.set(codParada, parada);
        }
      }

      const paradasArray = Array.from(paradasMap.values());

      await this.storeByChunks(this.paradaRepo, paradasArray, 1000, ["codParada"]);

      return { total: paradasArray.length };

    } catch (error) {
      console.error("Error al guardar paradas:", error);
      throw error;
    }
  }


  public static async getParadasLinea(codLinea: number) {
    try {
      const relaciones = await this.lineaParadaRepo
        .createQueryBuilder("lp")
        .select("lp.codParada", "codParada")
        .where("lp.codLinea = :codLinea", { codLinea })
        .getRawMany();

      const codParadas = relaciones.map(r => r.codParada);

      if (codParadas.length === 0) {
        return [];
      }

      const paradas = await this.paradaRepo
        .createQueryBuilder("p")
        .where("p.codParada IN (:...codParadas)", { codParadas })
        .getMany();

      return paradas;
    } catch (error) {
      console.error("Error obteniendo paradas de la línea:", error);
      throw error;
    }
  }

  public static async getLineasPorParadas(codParada: number) {
    try {
      const relaciones = await this.lineaParadaRepo
        .createQueryBuilder("lp")
        .select("lp.codLinea", "codLinea")
        .where("lp.codParada = :codParada", { codParada })
        .getRawMany();

      const codLineas = relaciones.map(r => r.codLinea);
      if (codLineas.length === 0) {
        return [];
      }

      const lineas = await this.lineaRepo
        .createQueryBuilder("l")
        .where("l.codLinea IN (:...codLineas)", { codLineas })
        .getMany();

      return lineas;
    } catch (error) {
      console.error("Error obteniendo lineas de la parada", error);
      throw error;
    }
  }


  /**
   * Inserta o actualiza los datos por lotes
   */
  private static async storeByChunks<T extends ObjectLiteral>(
    repository: Repository<T>,
    entities: T[],
    chunkSize: number,
    conflictPaths: string[]
  ): Promise<void> {
    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);
      await repository.upsert(chunk, { conflictPaths });
    }
  }
}
