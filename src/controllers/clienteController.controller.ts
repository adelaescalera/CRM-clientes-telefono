/*
Para devolver la respuesta en el controller usamos Generic Response: que es un formato estándar para devolver datos desde los controllers al frontend. La estructura puede ser la siguiente: 
 
export interface IGenericResponse {
  message?: string;
  data?: any;
  code?: number
}
*/

import { Request, Response } from "express";
import { clienteService } from "../service/clienteService.service";
import RespGeneric from "../models/responses";

export class clienteController {
  public static getAll = async (req: Request, res: Response) => {
    const resp = new RespGeneric();

    try {
      const clientes = await clienteService.getAllClientes();
      resp.data = { clientes };
      resp.msg = "Clientes obtenidos correctamente";
      resp.cod = 200;
    } catch (error) {
      resp.data = {};
      resp.msg = error instanceof Error ? error.message : String(error);
      resp.cod = 500;
    }

    res.json(resp);
  };
}
