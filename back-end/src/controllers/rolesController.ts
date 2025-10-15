import { Request, Response } from "express";
import { rolesService } from "../service/rolesService";
import RespGeneric from "../models/responses";

export class rolesController {
    public static getAll = async (req: Request, res: Response) => {
        const resp = new RespGeneric();

        try {
            resp.data = await rolesService.getRoles();
            resp.msg = "Roles obtenidos correctamente";
            resp.cod = 200;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }

        res.json(resp);
    }

      public static addRol = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const data = req.body;
        try {
          await rolesService.addRol(data);
          resp.msg = "Rol agregado correctamente";
          resp.cod = 201;
        } catch (error) {
          resp.msg = error instanceof Error ? error.message : String(error);
          resp.cod = 500;
        }
        res.json(resp);
      }
}