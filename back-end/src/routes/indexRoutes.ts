import { Router } from 'express';
import clienteRoutes from "./clienteRoutes";
import generalRoutes from "./generalRoutes";

const router = Router();

router.use("/cliente", clienteRoutes); 
router.use("/",generalRoutes);

export default router;