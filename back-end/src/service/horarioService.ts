import { DB } from "../config/typeorm";
import { Horarios } from "../entities/horarios";
import { UbicacionBus } from "../entities/ubicacionBus";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";
import { Repository } from "typeorm";

export class HorarioService {
    private static ubicacionRepo = DB.getRepository(UbicacionBus);
    private static horariosRepo = DB.getRepository(Horarios);

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

    public static async getTiempoLLegada(codLinea: number, codParada: number) {
        try {
            const tiempos = await this.horariosRepo
                .createQueryBuilder("h")
                .select("h.tiempoLlegada", "tiempoLlegada")
                .where("h.codLinea = :codLinea", { codLinea })
                .andWhere("h.codParada = :codParada", { codParada })
           //     .andWhere("h.tiempoLlegada > CURRENT_TIME()")
                .orderBy("h.tiempoLlegada", "ASC")
                .limit(1)
                .getRawOne();
            return tiempos;
        } catch (error) {
            console.error("Error al obtener las tiempos:", error);
            throw error;
        }
    }

    // importamos de trips y stop_times cruzando trip_id
    public static async importarCSV(): Promise<void> {
        const stopTimesPath = path.join(__dirname, "../csv/stop_times.csv");
        const tripsPath = path.join(__dirname, "../csv/trips.csv");

        const horarios: Horarios[] = [];


        const tripsData: Record<string, string> = {}; // trip_id = route_id
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(tripsPath)
                .pipe(csv())
                .on("data", (row: any) => {
                    tripsData[row.trip_id] = row.route_id;
                })
                .on("end", resolve)
                .on("error", reject);
        });

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(stopTimesPath)
                .pipe(csv())
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
        });;

        await this.storeByChunks(this.horariosRepo, horarios, 1024, ["id"]);

        console.log(" CSV importado correctamente en la base de datos con n de datos: ", horarios.length);
    }


}