import { Router } from "express";
import { clienteController } from "../controllers/clienteController.controller";

const router = Router();

// GET /api/clientes
router.get("/clientes", clienteController.getAll);

export default router;
