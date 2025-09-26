import { Request, Response } from "express";
import { clienteService } from "../service/clienteService.service";
import RespGeneric from "../models/responses";

export class clienteController {
  public static getAll = async (req: Request, res: Response) => {
    const resp = new RespGeneric();

    try {
      resp.data = await clienteService.getAllClientes()
      resp.msg = "Clientes obtenidos correctamente";
      resp.cod = 200;
    } catch (error) {
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
      resp.msg = "Cliente agregado correctamente";
      resp.cod = 201;
    } catch (error) {
      resp.msg = error instanceof Error ? error.message : String(error);
      resp.cod = 500;
    }
    res.json(resp);
  }

  public static deleteCliente = async (req: Request, res: Response) => {
    const resp = new RespGeneric();
    const id = Number(req.params.id);

    try {
      await clienteService.deleteCliente(id);
      resp.msg = "Cliente eliminado correctamente";
      resp.cod = 200;
    } catch (error) {
      resp.msg = error instanceof Error ? error.message : String(error);
      resp.cod = 500;
    }

    res.json(resp);
  };

  public static updateCliente = async (req: Request, res: Response) => {
    const resp = new RespGeneric();
    const { id } = req.params;
    const data = req.body;

    try {
      const updated = await clienteService.updateCliente(Number(id), data);

      if (!updated) {
        resp.msg = "Cliente no encontrado";
        resp.cod = 404;
      } else {
        resp.msg = "Cliente actualizado correctamente";
        resp.cod = 200;
        resp.data = updated;
      }
    } catch (error) {
      resp.msg = error instanceof Error ? error.message : String(error);
      resp.cod = 500;
    }

    res.json(resp);
  };


};
