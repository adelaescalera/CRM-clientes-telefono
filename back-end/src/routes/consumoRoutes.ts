import { Router } from "express";
import { consumoController } from "../controllers/consumoController";
import { checkRole } from "../middlewares/checkRol";

const router = Router();

// GET /api/consumos
router.get("/consumos", consumoController.getAll);

router.post("/add-consumo", checkRole([1]), consumoController.addConsumo);

router.delete("/:id",checkRole([1]), consumoController.deleteConsumo);

router.put('/:id', checkRole([1]),consumoController.updateConsumo);

//router.get('/:id', consumoController.getAnual)

router.get('/:id', consumoController.getConsumo);

router.get("/estadisticas/:id", consumoController.getEstadisticasAnuales);


export default router;

