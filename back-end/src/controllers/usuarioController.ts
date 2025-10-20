import { Request, Response } from "express";
import { usuarioService } from "../service/usuarioService";
import RespGeneric from "../models/responses";

export class usuariosController {
    public static getAll = async (req: Request, res: Response) => {
        const resp = new RespGeneric();

        try {
            resp.data = await usuarioService.getUsuarios();
            resp.msg = "Usuarios obtenidos correctamente";
            resp.cod = 200;
        } catch (error) {
            resp.msg = error instanceof Error ? error.message : String(error);
            resp.cod = 500;
        }

        res.json(resp);
    }

      public static addUsuario = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const data = req.body;
        try {
          await usuarioService.addUsuario(data);
          resp.msg = "Usuario agregado correctamente";
          resp.cod = 201;
        } catch (error) {
          resp.msg = error instanceof Error ? error.message : String(error);
          resp.cod = 500;
        }
        res.json(resp);
      }

      public static login = async (req: Request, res: Response) => {
        const resp = new RespGeneric();
        const data = req.body;
        try {
          const user = await usuarioService.login(data);
          resp.data = user;
          resp.msg = "Login exitoso";
          resp.cod = 200;
        } catch (error) {
          resp.msg = error instanceof Error ? error.message : String(error);
          resp.cod = 401;
        }
        res.json(resp);
      }
//validar token?nnpm
}