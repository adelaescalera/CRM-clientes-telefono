import { DB } from "../config/typeorm";
import { Log } from "../entities/logs";

export class logsService {

    public static async getLogs() {
        try {
            const repo = DB.getRepository(Log);
            const logs = await repo.find();
            return logs;
        } catch (err) {
            console.error("Error en consumoService:", err);
            throw err;
        }
    }


    public static async addLog(data: Log) {
        try {
            let result = await DB.getRepository(Log).save(data);
            console.log("Log añadido:", result);
            return result;
        } catch (err) {
            console.error("Error en logService.addLog:", err);
            throw err;
        }
    }
}