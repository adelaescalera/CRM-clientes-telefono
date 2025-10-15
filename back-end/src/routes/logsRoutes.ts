import { Router } from "express";
import { logsController } from "../controllers/logsController";

const router = Router();


router.get("/logs", logsController.getAll);

router.post("/add-log", logsController.addLog);


export default router;