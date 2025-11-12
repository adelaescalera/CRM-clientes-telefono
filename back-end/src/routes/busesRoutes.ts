import { Router } from "express";
import { BusController} from "../controllers/busController";


const router = Router();

router.post("/lineas",BusController.saveBaseDatosLineas);
router.get("/todasLineas",BusController.getLineas);
router.get("/paradasDeLinea/:codLinea", BusController.getParadasByLinea);
router.post("/importarCSV", BusController.importarCSV);
router.post("/actualizarUbicacionBuses", BusController.actualizarUbicacionBuses);
router.get("/tiempoLlegada/:codLinea/:codParada", BusController.getTiempoLlegada)
router.get("/ubiBuses/:codLinea",BusController.getUbicacionBuses);
router.get("/lineaPorParada/:codParada",BusController.getLineasDeParada);

export default router;