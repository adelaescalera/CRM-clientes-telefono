import { Request, Response } from 'express';
import { enviarPDF } from '../service/emailService';

export async function enviarPDFController(req: Request, res: Response) {
  const { to, message, pdfBase64 } = req.body;

  if (!to || !pdfBase64) {
    return res.status(400).json({ success: false, message: 'Faltan parámetros obligatorios' });
  }

  // Convertimos Base64 a Buffer
  const pdf = Buffer.from(pdfBase64, 'base64');

  try {
    await enviarPDF(to, message, pdf);
    res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (err: any) {
    console.error('Error enviando correo:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
