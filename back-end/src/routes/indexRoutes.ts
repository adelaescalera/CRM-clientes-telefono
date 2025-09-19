import { Router } from 'express';
//import { pool } from '../../config/db';
import clienteRoutes from "./clienteRoutes";
import generalRoutes from "./generalRoutes";

const router = Router();

router.use("/cliente", clienteRoutes); 
router.use("/",generalRoutes);

export default router;