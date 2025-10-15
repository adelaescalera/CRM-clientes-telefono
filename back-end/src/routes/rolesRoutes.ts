import { Router } from "express";
import { rolesController } from "../controllers/rolesController";

const router = Router();

// GET /api/clientes
router.get("/roles", rolesController.getAll);

router.post("/add-rol", rolesController.addRol);


export default router;