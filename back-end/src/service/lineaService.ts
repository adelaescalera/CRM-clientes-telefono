// linea.service.ts
import { DB } from "../config/typeorm";
import { Linea } from "../entities/linea";
import { LineaParada } from "../entities/lineas_paradas";
import { Parada } from "../entities/parada";
import axios from "axios";
import { Repository } from "typeorm";
import { ParadaService } from "./paradaService";


export class LineaService {

  private static lineaRepo = DB.getRepository(Linea);
  private static lineaParadaRepo = DB.getRepository(LineaParada);

  public static async getLineas() {
    try {
      const lineas = await this.lineaRepo.find();
      return lineas;
    } catch (error) {
      console.error("Error al obtener las líneas:", error);
      throw error;
    }
  }

  public static async fetchLineas() {
    try {
      const url = `${process.env.URL_LINEASPARADASEMT}resource_id=${process.env.RESOURCE_ID}&limit=7000`;
      const response = await axios.get(url);
      const records = response.data.result?.records;


      await ParadaService.saveParadas(records);

      const LineaMap = new Map<number, Linea>();
      const LineaParadaMap = new Map<string, LineaParada>();

      for (const record of records) {
        const codLinea = record.codLinea;
        const codParada = record.codParada;
        if (!LineaMap.has(codLinea) && record.nombreLinea != null) {
          const linea = new Linea();
          linea.codLinea = codLinea;
          linea.nombreLinea = record.nombreLinea;
          linea.cabeceraIda = record.cabeceraIda || "";
          linea.cabeceraVuelta = record.cabeceraVuelta || "";
          LineaMap.set(codLinea, linea);
        }
        if (codParada != null && codLinea != null) {
          LineaParadaMap.set(`${codLinea}-${codParada}`, { codLinea: codLinea, codParada: codParada } as LineaParada);
        }

      }

      const ArrayLineas = Array.from(LineaMap.values());
      const ArrayLineasParadas = Array.from(LineaParadaMap.values());

      console.log(`✅ ${ArrayLineas.length} líneas y ${ArrayLineasParadas.length} relaciones línea-parada preparadas para guardar.`);

      await this.storeLinesByChunksCAMBIAR(this.lineaRepo, ArrayLineas, 1024);
      await this.storeLinesByChunks(this.lineaParadaRepo, ArrayLineasParadas, 1024, ["codLinea", "codParada"]);

      return { success: true, total: records.length };

    } catch (error) {
      console.error(" Error al guardar las líneas:", error);
      throw error;
    }

  }
  private static async storeLinesByChunksCAMBIAR(busLinesRepository: Repository<Linea>,
    busLines: Array<Linea>, chunkSize: number): Promise<void> {
        for (let i = 0; i < busLines.length; i += chunkSize) {
            const chunk = busLines.slice(i, i + chunkSize);
            // Upsert only add register with diferents "codLine" (in this case)
            // If other register is repeated with same "codLine", it will be
            // updated if others values were provided.
            // Sumarising, that avoid duplicate registers given second param.
            await busLinesRepository.upsert(chunk, ["codLinea"]);
        }
    }
 

  private static async storeLinesByChunks<T extends Record<string, any>>(
    repository: Repository<T>, entities: T[], chunkSize: number, conflictPaths: string[]
  ): Promise<void> {
    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);
      await repository.upsert(chunk, { conflictPaths });
    }
  }




}
