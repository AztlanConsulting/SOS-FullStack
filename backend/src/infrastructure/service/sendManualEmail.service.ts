import nodemailer from 'nodemailer';

import type {
  ManualEmailService,
  SendManualEmailDTO,
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

      console.log('Ethereal test account created:');
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

export const sendManualEmailService: ManualEmailService = {
  async sendManualEmail(data: SendManualEmailDTO): Promise<void> {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"SOS Encontrando Mascotas" <${process.env.SMTP_USER ?? 'test@sospets.local'}>`,
      to: data.to,
      subject: `Información sobre tu compra: ${data.manualName}`,
      html: `
       <div style="margin:0;padding:0;background-color:#f8f9fa;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;padding:40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
                
                <tr>
                  <td style="background-color:#f9cd48;height:6px;"></td>
                </tr>

                <tr>
                  <td align="center" style="padding: 32px 32px 24px 32px;">
                    <h1 style="margin:0;color:#1a1a1a;font-size:22px;letter-spacing:-0.5px;font-weight:bold;">
                      SOS Encontrando Mascotas
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 40px 40px 40px;color:#444444;line-height:1.6;">
                    <p style="font-size:16px;margin-bottom:12px;">Hola,</p>
                    <p style="font-size:15px;color:#666;margin-bottom:32px;">
                      ¡Gracias por tu compra! Aquí tienes el material que solicitaste para ayudar a tu mejor amigo.
                    </p>

                    <div style="background-color:#fcfcfc;border:1px solid #eeeeee;border-radius:16px;padding:30px;text-align:center;">
                      
                      <img src="${data.imageUrl}" alt="${data.manualName}" style="width:180px; height:auto; border-radius:8px; box-shadow: 0 8px 15px rgba(0,0,0,0.1); margin-bottom:20px;">
                      
                      <h2 style="margin:0 0 8px 0;font-size:20px;color:#1a1a1a;">${data.manualName}</h2>

                      ${
                        data.pdfUrl
                          ? `
                        <div style="margin-top:20px;">
                          <a href="${data.pdfUrl}" target="_blank" style="background-color:#f9cd48; color:#1a1a1a; padding:14px 32px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:16px; display:inline-block; transition: background-color 0.3s ease;">
                            Descargar Manual (PDF)
                          </a>
                        </div>
                        <p style="font-size:12px; color:#aaa; margin-top:15px;">
                          Si el botón no funciona, copia y pega este link: <br/>
                          <span style="color:#f9cd48;">${data.pdfUrl}</span>
                        </p>
                      `
                          : `
                        <p style="color:#d9534f; font-weight:bold;">Hubo un problema con la descarga del manual. <br/> Por favor, contáctanos <a href="mailto:hola@sosencontrandomascotas.com" style="text-decoration:underline;">aquí</a>.</p>
                      `
                      }
                    </div>

                    <p style="font-size:14px; color:#777; margin-top:30px; text-align:center;">
                      Esperamos que esta información sea de gran utilidad para ti y tu mascota.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:32px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
                    <p style="margin:0;font-size:13px;color:#777;">
                      ¿Tienes problemas con la descarga? <br/>
                      <a href="mailto:hola@sosencontrandomascotas.com" style="color:#f9cd48;text-decoration:none;font-weight:bold;">Contáctanos aquí</a>
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;margin-top:24px;">
                <tr>
                  <td align="center" style="font-size:11px;color:#aaa;line-height:1.5;">
                    <p>© ${new Date().getFullYear()} SOS Encontrando Mascotas. <br/>
                    Este es un correo automático para la entrega de productos digitales.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    if (Boolean(previewUrl)) {
      console.log('📨 Preview email:', previewUrl);
      console.log(
        'Timestamp:',
        new Date().toLocaleString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
    }
  },
};
