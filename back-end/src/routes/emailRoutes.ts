import { Router } from 'express';
import { enviarPDFController } from '../controllers/emailController';

const router = Router();

router.post('/enviar-pdf', enviarPDFController);

export default router;
