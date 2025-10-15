import { Request, Response } from "express";
import { logsService } from "../service/logsService";
import RespGeneric from "../models/responses";

export class logsController {
    public static getAll = async (req: Request, res: Response) => {
        const resp = new RespGeneric();

        try {
            resp.data = await logsService.getLogs();
            resp.msg = "Logs obtenidos correctamente";
            resp.cod = 200;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }

        res.json(resp);
    }

      // public static addLog = async (req: Request, res: Response) => {
      //   const resp = new RespGeneric();
      //   const data = req.body;
      //   try {
      //     await logsService.addLog(data);
      //     resp.msg = "Log agregado correctamente";
      //     resp.cod = 201;
      //   } catch (error) {
      //     resp.msg = error instanceof Error ? error.message : String(error);
      //     resp.cod = 500;
      //   }
      //   res.json(resp);
      // }
}