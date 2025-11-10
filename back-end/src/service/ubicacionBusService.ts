import { DB } from "../config/typeorm";
import { UbicacionBus } from "../entities/ubicacionBus";
import axios from "axios";
import { Repository } from "typeorm";

export class UbicacionBusService {
  private static ubicacionRepo = DB.getRepository(UbicacionBus);

  public static async fetchUbicacionBus() {
    try {
      const url = `${process.env.URL_UBIBUS}resource_id=${process.env.RESOURCE_ID2}&limit=7000`;
      const response = await axios.get(url);
      const records = response.data.result?.records;

      const ubiBusMap = new Map<number, UbicacionBus>();

      for (const record of records) {
        const codBus = parseInt(record.codBus);
        const codLinea = parseInt(record.codLinea);
        if (codBus && !ubiBusMap.has(codBus) && codLinea) {
          const ubicacion = new UbicacionBus();
          ubicacion.codBus = codBus;
          ubicacion.codLinea = codLinea;
          ubicacion.sentido = record.sentido;
          ubicacion.lon = parseFloat(record.lon);
          console.log("longitud en fetchUbicacionBus en service",ubicacion.lon);
          ubicacion.lat = parseFloat(record.lat);
          const codParaIniParsed = parseInt(record.codParaIni);
          ubicacion.codParaIni = isNaN(codParaIniParsed) ? 0 : codParaIniParsed;

          ubiBusMap.set(codBus, ubicacion);
        }
      }

      const ubiBusArray = Array.from(ubiBusMap.values());

      await this.storeByChunks(this.ubicacionRepo, ubiBusArray, 1000, ["codBus"]);

    } catch (error) {
      console.error("Error al obtener la ubicación de los buses:", error);
      throw error;
    }

  }

  public static async getUbiDeBuses(codL: number) {
    try {

      const buses = await this.ubicacionRepo
        .createQueryBuilder("u")

        .select([
          "u.codBus AS codBus",
          "u.lat AS lat",
          "u.lon AS lon",
          "u.sentido AS sentido"
        ])

        .where("u.codLinea = :codLinea", { codLinea: codL })

        .getRawMany();

      return buses;

    } catch (error) {
      console.error("Error al obtener las ubicaciones de los buses:", error);
      throw error;
    }

  }

  private static async storeByChunks<T extends Record<string, any>>(
    repository: Repository<T>, entities: T[], chunkSize: number, conflictPaths: string[]
  ): Promise<void> {
    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);
      await repository.upsert(chunk, { conflictPaths });
    }
  }

}