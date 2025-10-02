import { Router } from 'express';
import clienteRoutes from "./clienteRoutes";
import generalRoutes from "./generalRoutes";
import consumoRoutes from "./consumoRoutes";

const router = Router();

router.use("/cliente", clienteRoutes); 
router.use("/",generalRoutes);
router.use("/consumo",consumoRoutes)

export default router;