import { Router } from "express";
import { generalController } from '../controllers/generalController';

const router = Router();

router.get("/show-tables", generalController.showTables);

export default router;