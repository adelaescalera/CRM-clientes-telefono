import { Router } from "express";
import { clienteController } from "../controllers/clienteController.controller";

const router = Router();

// GET /api/clientes
router.get("/clientes", clienteController.getAll);

router.get("/dni/:dni", clienteController.getClienteByDni);

router.post("/add-cliente", clienteController.addCliente);

router.delete("/:id", clienteController.deleteCliente);

router.put('/:id', clienteController.updateClient);



export default router;
