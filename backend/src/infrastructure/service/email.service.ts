import nodemailer from 'nodemailer';

import type {
  EmailService,
  SendActivatePlanEmailDTO,
} from '@domain/ports/emailService.port';

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

/**
 * Development:
 * Uses Ethereal test SMTP automatically.
 *
 * Production:
 * Uses real SMTP credentials from .env
 */
const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (transporterPromise) {
    return transporterPromise;
  }

  transporterPromise = (async () => {
    const isDevelopment = process.env.ENV !== 'production';

    if (isDevelopment) {
      const testAccount = await nodemailer.createTestAccount();

      console.log('📩 Ethereal test account created:');
      console.log('User:', testAccount.user);
      console.log('Pass:', testAccount.pass);

      return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  })();

  return transporterPromise;
};

export const emailService: EmailService = {
  async sendActivatePlanEmail(data: SendActivatePlanEmailDTO): Promise<void> {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"SOS Pets" <${process.env.SMTP_USER ?? 'test@sospets.local'}>`,
      to: data.to,
      subject: 'Tu pago fue confirmado',
      html: `
          <h2>Tu reporte fue activado correctamente</h2>

          <p><b>Usuario:</b> ${data.username}</p>

          <p><b>Contraseña:</b> ${data.password}</p>

          <hr/>

          <p><b>Facebook:</b> ${data.facebookUrl ?? 'Pendiente'}</p>

          <p><b>Instagram:</b> ${data.instagramUrl ?? 'Pendiente'}</p>

          <p>Gracias por confiar en SOS.</p>
        `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    if (Boolean(previewUrl)) {
      console.log('📨 Preview email:', previewUrl);
    }
  },
};
