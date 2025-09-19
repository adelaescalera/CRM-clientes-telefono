
import { Request, Response } from "express";
import { generalService } from "../service/generalService";
import RespGeneric from "../models/responses";

export class generalController {
  public static showTables = async (req: Request, res: Response) => {
    const resp = new RespGeneric();

    try {
      const tables = await generalService.getTables();
      resp.data = { tables };
      resp.msg = "Tablas obtenidas correctamente";
      resp.cod = 200;
    } catch (error) {
      resp.data = {};
      resp.msg = error instanceof Error ? error.message : String(error);
      resp.cod = 500;
    }

    res.json(resp);
  };
}
