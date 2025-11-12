import { DB } from "../config/typeorm";
import { UbicacionBus } from "../entities/ubicacionBus";
import { UbicacionBusEstadistica } from "../entities/ubicacionBusEstadistica";
import axios from "axios";
import { Repository } from "typeorm";
import { io } from "../app";

export class UbicacionBusService {
  private static ubicacionRepo = DB.getRepository(UbicacionBus);
  private static ubiEstadisticaRepo = DB.getRepository(UbicacionBusEstadistica);
  private static limit=700;

  public static async fetchUbicacionBus() {
    try {
      const url = `${process.env.URL_UBIBUS}resource_id=${process.env.RESOURCE_ID2}&limit=${this.limit}`;
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
          ubicacion.lat = parseFloat(record.lat);
          ubiBusMap.set(codBus, ubicacion);
        }
      }

      const ubiBusArray = Array.from(ubiBusMap.values());
      await this.ubicacionRepo.clear();
      await this.storeByChunks(this.ubicacionRepo, ubiBusArray, 1000, ["codBus"]);
      const estadisticaArray = ubiBusArray.map(({ id, ...rest }) => rest);
      await this.insertByChunks(this.ubiEstadisticaRepo, estadisticaArray, 1000);
      io.emit('buses-actualizados');
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

  private static async insertByChunks<T extends Record<string, any>>(
    repository: Repository<T>, entities: T[], chunkSize: number
  ): Promise<void> {
    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);
      await repository.insert(chunk);
    }
  }




  //Para las graficas

  //resumen de buses activos por hora para un día específico
  public static async getEstadisticaHorasPunta(fecha: string, codLinea?: number) {
    try {
      const query = this.ubiEstadisticaRepo
        .createQueryBuilder("est")
        .select("HOUR(est.fecha)", "hora")
        .addSelect("COUNT(DISTINCT est.codBus)", "total_buses") 
        .where("DATE(est.fecha) = :fecha", { fecha });

      if (codLinea) {
        query.andWhere("est.codLinea = :codLinea", { codLinea });
      }

      const resultado = await query
        .groupBy("hora")
        .orderBy("hora", "ASC")
        .getRawMany();

      return resultado.map(item => ({
        hora: parseInt(item.hora, 10),
        total_buses: parseInt(item.total_buses, 10)
      }));

    } catch (error) {
      console.error("Error al generar estadística de horas punta:", error);
      throw error;
    }
  }

  public static async getFechasDisponibles() {
    try {
      const fechas = await this.ubiEstadisticaRepo
        .createQueryBuilder("est")
        // Formatea la fecha a 'YYYY-MM-DD' y obtén solo las únicas
        .select("DISTINCT DATE_FORMAT(est.fecha, '%Y-%m-%d')", "fecha_dia")
        .orderBy("fecha_dia", "DESC") // Ordena de más nueva a más vieja
        .getRawMany();
      return fechas; // Devuelve un array ej: [{ fecha_dia: '2025-11-12' }, ...]
    } catch (error) {
      console.error("Error al obtener las fechas disponibles:", error);
      throw error;
    }
  }

  /**
   * Devuelve todos los puntos [lat, lon] de los últimos 10 minutos
   * para el mapa de calor.
   */
  public static async getDatosHeatmap(codLinea?: number) {
    try {
      const query = this.ubiEstadisticaRepo
        .createQueryBuilder("est")
        .select(["est.lat AS lat", "est.lon AS lon"])
        // Filtra por los últimos 10 minutos 
        .where("est.fecha >= NOW() - INTERVAL 10 MINUTE");

      if (codLinea) {
        query.andWhere("est.codLinea = :codLinea", { codLinea });
      }

      const puntos = await query.getRawMany();

      return puntos.map(p => [
        parseFloat(p.lat), 
        parseFloat(p.lon)
      ]);

    } catch (error)
 {
      console.error("Error al generar datos del heatmap:", error);
      throw error;
    }
  }
}