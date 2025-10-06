import { Router } from "express";
import { consumoController } from "../controllers/consumoController";

const router = Router();

// GET /api/consumos
router.get("/consumos", consumoController.getAll);

router.post("/add-consumo", consumoController.addConsumo);

router.delete("/:id", consumoController.deleteConsumo);

router.put('/:id', consumoController.updateConsumo);

//router.get('/:id', consumoController.getAnual)

router.get('/:id', consumoController.getConsumo)

export default router;

