import { Router } from "express";
import { BusController} from "../controllers/busController";

const router = Router();

router.post("/lineas",BusController.saveBaseDatosLineas);
router.get("/todasLineas",BusController.getLineas);
router.get("/paradasDeLinea/:codLinea", BusController.getParadasByLinea);
router.post("/importarCSV", BusController.importarCSV);
router.post("/generarUbicacionesAleatorias", BusController.generarUbicacionesAleatorias);
router.get("/generarUbicacionBus", BusController.generarUbicacionBus);

export default router;