import { Request, Response } from "express";
import { consumoService } from "../service/consumoService";
import RespGeneric from "../models/responses";

export class consumoController {
    public static getAll = async (req: Request, res: Response) => {
        const resp = new RespGeneric();

        try {
            resp.data = await consumoService.getAllConsumos();
            resp.msg = "Consumos obtenidos correctamente";
            resp.cod = 200;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }

        res.json(resp);
    }

    public static getAnual = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const id = Number(req.params.id);
        try {
            resp.data = await consumoService.getAnual(id);
            resp.msg = "Consumos obtenidos correctamente por año";
            resp.cod = 200;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }

        res.json(resp);
    }

    public static getConsumo = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const id = Number(req.params.id);
        try {
            resp.data = await consumoService.getConsumo(id);
            resp.msg = "Consumos obtenidos correctamente por año";
            resp.cod = 200;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }

        res.json(resp);
    }
    public static addConsumo = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const data = req.body;
        try {
            await consumoService.addConsumo(data);
            resp.msg = "Consumo agregado correctamente";
            resp.cod = 201;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }
        res.json(resp);
    }

    public static deleteConsumo = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const id = Number(req.params.id);

        try {
            await consumoService.deleteConsumo(id);
            resp.msg = "Consumo eliminado correctamente";
            resp.cod = 200;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }

        res.json(resp);
    };

    public static updateConsumo = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const id = Number(req.params.id);
        const data = req.body;

        try {
            const consumoActualizado = await consumoService.updateConsumo(id, data);
            resp.cod = 200;
            resp.msg = "Consumo actualizado correctamente";
            resp.data = consumoActualizado;
        } catch (error) {
            resp.cod = 500;
            resp.msg = error instanceof Error ? error.message : String(error);
        }

        res.json(resp);
    };


    // HACER MOSTRAR ANUAL


};


