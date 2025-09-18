import { Request, Response } from "express";
import { generalService } from "../service/generalService";
import RespGeneric from "../models/responses";


export class generalController {
    public static showTables = async (req: Request, res: Response) => {
        let resp = new RespGeneric();

        try {
            let result = await generalService.getTables();
            resp.data = { result };
            resp.msg = "All db tables";
            resp.cod = result ? 200 : 400;
        }
        catch (e) {
            resp.msg = e as string;
            resp.cod = 500;
        }
        res.json(resp);
    };
}
