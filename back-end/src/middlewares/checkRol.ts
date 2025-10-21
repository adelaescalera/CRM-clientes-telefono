import { Request, Response, NextFunction } from 'express';
import RespGeneric from "../models/responses";

export function checkRole(allowedRoles: number[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = res.locals.user;
        const resp = new RespGeneric();
        console.log("User from token:", user);
        console.log("Allowed roles:", allowedRoles);
        console.log("User role ID:", user?.rol);
        if (!user || !allowedRoles.includes(user.rol)) {
            resp.msg = 'You do not have enough privileges to use this service';
            resp.cod = 403;
            res.status(resp.cod).json(resp);
            return;
        }

        next();
    };
}