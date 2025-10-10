import { Router } from 'express';
import clienteRoutes from "./clienteRoutes";
import generalRoutes from "./generalRoutes";
import consumoRoutes from "./consumoRoutes";
import emailRoutes from "./emailRoutes";

const router = Router();

router.use("/cliente", clienteRoutes); 
router.use("/",generalRoutes);
router.use("/consumo",consumoRoutes)
router.use("/email", emailRoutes);

export default router;