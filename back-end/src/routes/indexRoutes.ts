import { Router } from 'express';
import clienteRoutes from "./clienteRoutes";
// import generalRoutes from "./generalRoutes";
import consumoRoutes from "./consumoRoutes";
import emailRoutes from "./emailRoutes";
import rolesRoutes from "./rolesRoutes";
import usuarioRoutes from "./usuarioRoutes";
import logsRoutes from "./logsRoutes";
import authenticate from '../middlewares/authenticate.middleware';
import busesRoutes from './busesRoutes';

const router = Router();

router.use("/cliente",authenticate, clienteRoutes); 
router.use("/consumo",authenticate,consumoRoutes)
router.use("/email", authenticate,emailRoutes);
router.use("/roles",authenticate,rolesRoutes)
router.use("/logs",authenticate,logsRoutes)
router.use("/buses",busesRoutes);


router.use("/usuario",usuarioRoutes)

export default router;