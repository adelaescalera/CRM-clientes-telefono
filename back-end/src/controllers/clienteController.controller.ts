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
  }

  public static addCliente = async (req: Request, res: Response) => {
    const resp = new RespGeneric();
    const data = req.body;
    try {
      await clienteService.addCliente(data);
      resp.data = {};
      resp.msg = "Cliente agregado correctamente";
      resp.cod = 201;
    }catch (error) {
      resp.data = {};
      resp.msg = error instanceof Error ? error.message : String(error);
      resp.cod = 500;
    }
    res.json(resp);
}
};
