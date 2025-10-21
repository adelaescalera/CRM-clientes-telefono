import { Router } from 'express';
import clienteRoutes from "./clienteRoutes";
import generalRoutes from "./generalRoutes";
import consumoRoutes from "./consumoRoutes";
import emailRoutes from "./emailRoutes";
import rolesRoutes from "./rolesRoutes";
import usuarioRoutes from "./usuarioRoutes";
import logsRoutes from "./logsRoutes";

const router = Router();

router.use("/cliente", clienteRoutes); 
router.use("/",generalRoutes);
router.use("/consumo",consumoRoutes)
router.use("/email", emailRoutes);
router.use("/roles",rolesRoutes)
router.use("/logs",logsRoutes)


router.use("/usuario",usuarioRoutes)

export default router;