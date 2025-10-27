// middlewares/authenticate.ts

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import RespGeneric from "../models/responses";

export default async function authenticate(req: Request, res: Response,
    next: NextFunction): Promise<void> {

    console.log(req.headers);
    const authHeader = req.header('Authorization');
    console.log("Authorization header:", authHeader);
    // Remove 'Bearer header' if authorization mode of JWT was selected as Bearer
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const resp = new RespGeneric();
    console.log("Received token:", token);

    if (!token) {
        resp.msg = 'Authorization token is required.';
        resp.cod = 401;
        res.status(resp.cod).json(resp);
        return;
    }

    try {
        console.log("Verifying token:", token);
        console.log("Using secret:", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log("Decoded token:", decoded);
        res.locals.user = decoded;
        next();
    } catch (err) {
        resp.msg = 'Invalid token.';
        resp.cod = 401;
        res.status(resp.cod).json(resp);
    }
}