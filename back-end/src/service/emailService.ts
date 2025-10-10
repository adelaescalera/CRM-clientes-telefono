import nodemailer from 'nodemailer';

// Método para enviar correo con PDF adjunto
export async function enviarPDF(to: string, message: string, pdf: Buffer) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'candelario.langworth@ethereal.email',
      pass: 'nCr8v3TYRcTGEB19gy'
    }
  });

  const mailOptions = {
    from: '"CRM Telefonía" <candelario.langworth@ethereal.email>',
    to,
    subject: 'Consumos del año seleccionado',
    text: message,
    attachments: [
      {
        filename: 'consumos.pdf',
        content: pdf,
        contentType: 'application/pdf',
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Ver el correo en Ethereal:', nodemailer.getTestMessageUrl(info));
}
