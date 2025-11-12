// middlewares/authenticate.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import RespGeneric from "../models/responses";

export default async function authenticate(req: Request, res: Response,
    next: NextFunction): Promise<void> {
    const authHeader = req.header('Authorization');
    // Remove 'Bearer header' if authorization mode of JWT was selected as Bearer
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const resp = new RespGeneric();

    if (!token) {
        resp.msg = 'Authorization token is required.';
        resp.cod = 401;
        res.status(resp.cod).json(resp);
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        res.locals.user = decoded;
        next();
    } catch (err) {
        resp.msg = 'Invalid token.';
        resp.cod = 401;
        res.status(resp.cod).json(resp);
    }
}