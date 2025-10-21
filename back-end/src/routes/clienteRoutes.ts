import { Router } from "express";
import { clienteController } from "../controllers/clienteController.controller";
import { checkRole } from "../middlewares/checkRol";

const router = Router();

// GET /api/clientes
 router.get("/clientes", checkRole([1]),clienteController.getAll);
//router.get("/clientes",clienteController.getAll);

router.get("/dni/:dni",clienteController.getClienteByDni);

router.post("/add-cliente" ,checkRole([1]),clienteController.addCliente);

router.delete("/:id",checkRole([1]), clienteController.deleteCliente);

router.put('/:id',checkRole([1]), clienteController.updateClient);



export default router;
