import { Router } from 'express';
import clienteRoutes from "./clienteRoutes";
// import generalRoutes from "./generalRoutes";
import consumoRoutes from "./consumoRoutes";
import emailRoutes from "./emailRoutes";
import rolesRoutes from "./rolesRoutes";
import usuarioRoutes from "./usuarioRoutes";
import logsRoutes from "./logsRoutes";
import authenticate from '../middlewares/authenticate.middleware';

const router = Router();

router.use("/cliente",authenticate, clienteRoutes); 
router.use("/consumo",authenticate,consumoRoutes)
router.use("/email", authenticate,emailRoutes);
router.use("/roles",authenticate,rolesRoutes)
router.use("/logs",authenticate,logsRoutes)

// router.use("/cliente", clienteRoutes); 
// router.use("/consumo",consumoRoutes)
// router.use("/email",emailRoutes);
// router.use("/roles",rolesRoutes)
// router.use("/logs",logsRoutes)



router.use("/usuario",usuarioRoutes)

export default router;