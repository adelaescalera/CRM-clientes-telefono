import { Router } from "express";
import { usuariosController } from "../controllers/usuarioController";

const router = Router();


router.get("/usuarios", usuariosController.getAll);

router.post("/add-usuario", usuariosController.addUsuario);

router.post("/login", usuariosController.login);

export default router;