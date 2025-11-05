import {DB} from "../config/typeorm";
import { Horarios } from "../entities/horarios";
import { UbicacionBus } from "../entities/ubicacionBus";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";
import { Repository } from "typeorm";
import { parse } from "csv-parser";


export class UbicacionBusService {
  private static ubicacionRepo = DB.getRepository(UbicacionBus);
  private static horariosRepo= DB.getRepository(Horarios);

      private static async storeByChunks<T extends Record<string, any>>(
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

  /**
   * Carga los archivos CSV de `trips` y `stop_times`, 
   * los relaciona por trip_id, y guarda los datos en la tabla `horarios`.
   */
  public static async importarCSV(): Promise<void> {
    const horariosRepo = DB.getRepository(Horarios);

    const stopTimesPath = path.join(__dirname, "../csv/stop_times.csv");
    const tripsPath = path.join(__dirname, "../csv/trips.csv");

    const horarios: Horarios[] = [];

    console.log("📂 Leyendo CSVs...");

    // --- Leemos trips.csv ---
    const tripsData: Record<string, string> = {}; // trip_id -> route_id
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(tripsPath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on("data", (row: any) => {
          tripsData[row.trip_id] = row.route_id;
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // --- Leemos stop_times.csv ---
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(stopTimesPath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on("data", (row: any) => {
          const codLinea = parseInt(tripsData[row.trip_id]);
          if (isNaN(codLinea)) return;

          const h = new Horarios();
          h.codLinea = codLinea;
          h.codParada = parseInt(row.stop_id);
          h.tiempoLlegada = row.arrival_time;
          h.stopSequence = parseInt(row.stop_sequence);
          horarios.push(h);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`🧾 Total de registros leídos: ${horarios.length}`);

    // --- Guardamos en lotes ---
    await this.storeByChunks(horariosRepo, horarios, 500, ["id"]);

    console.log("✅ CSV importado correctamente en la base de datos (por chunks).");
  }

  /**
   * Genera ubicaciones aleatorias de autobuses para pruebas.
   */
  public static async generarUbicacionesIniciales(): Promise<void> {
    try {
      const ubicaciones: UbicacionBus[] = [];

      for (let i = 1; i <= 5; i++) {
        const u = new UbicacionBus();
        u.codBus = i;
        u.codLinea = i;
        u.sentido = i % 2 ? 1 : 2;
        u.lat = 36.720 + Math.random() * 0.02;
        u.lon = -4.420 + Math.random() * 0.02;
        ubicaciones.push(u);
      }

      await this.ubicacionRepo.clear();
      await this.ubicacionRepo.save(ubicaciones);
      console.log("✅ Ubicaciones iniciales creadas correctamente");
    } catch (error) {
      console.error("❌ Error al generar ubicaciones iniciales:", error);
    }
  }

  /**
   * Actualiza aleatoriamente las posiciones de los buses para simular movimiento.
   */
  public static async actualizarUbicacionesEnTiempoReal(): Promise<void> {
    try {
      const buses = await this.ubicacionRepo.find();

      for (const bus of buses) {
        // Movimiento leve simulado
        bus.lat += (Math.random() - 0.5) * 0.0005;
        bus.lon += (Math.random() - 0.5) * 0.0005;
      }

      await this.ubicacionRepo.save(buses);
      console.log("🟢 Ubicaciones actualizadas en tiempo real");
    } catch (error) {
      console.error("❌ Error al actualizar ubicaciones:", error);
    }
  }


}
