import { Router } from 'express';
//import { pool } from '../../config/db';
import clienteRoutes from "./clienteRoutes";
import { generalController } from '../controllers/generalController';

const router = Router();


// Ejemplo de ruta principal
router.get('/', (req, res) => {
    res.send('API Home');
});

router.get("/show-tables", generalController.showTables);
router.use("/", clienteRoutes); 

//router.get('/show-tables', generalController.showTables);

// Exportar el router como módulo principal
export default router;