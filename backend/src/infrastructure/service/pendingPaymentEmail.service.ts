import nodemailer from 'nodemailer';

import type {
  StripeEmailService,
  SendStripePaymentEmailDTO,
} from '@domain/ports/emailService.port';

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

const formatExpirationTime = (timestamp: number | null) => {
  if (!timestamp) return 'Tiempo desconocido';

  const timeRemaining = timestamp * 1000 - Date.now();

  if (timeRemaining <= 0) return 'Expirado';

  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} día${days !== 1 ? 's' : ''} y ${hours}h`;
  }

  if (hours > 0) {
    return `${hours} hora${hours !== 1 ? 's' : ''} y ${minutes}m`;
  }

  return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
};

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
    // const isDevelopment = process.env.ENV !== 'production';

    // if (isDevelopment) {
    //   const testAccount = await nodemailer.createTestAccount();

    //   console.log('Ethereal test account created:');
    //   console.log('User:', testAccount.user);
    //   console.log('Pass:', testAccount.pass);

    //   return nodemailer.createTransport({
    //     host: testAccount.smtp.host,
    //     port: testAccount.smtp.port,
    //     secure: testAccount.smtp.secure,
    //     auth: {
    //       user: testAccount.user,
    //       pass: testAccount.pass,
    //     },
    //   });
    // }

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

export const pendingPaymentEmailService: StripeEmailService = {
  async sendStripePaymentEmail(data: SendStripePaymentEmailDTO): Promise<void> {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"SOS Encontrando Mascotas" <${process.env.SMTP_USER ?? 'test@sospets.local'}>`,
      to: data.to,
      subject:
        data.method === 'oxxo'
          ? 'Información de tu pago en OXXO'
          : 'Datos para tu transferencia SPEI',
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
                    <td align="center" style="padding: 32px 32px 32px 32px;">
                      <h1 style="margin:0;color:#1a1a1a;font-size:22px;letter-spacing:-0.5px;font-weight:bold;">
                        SOS Encontrando Mascotas
                      </h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 30px 40px 30px;color:#444444;line-height:1.6;">
                      <p style="font-size:16px;margin-bottom:12px;">Hola <strong>${data.name}</strong>,</p>
                      <p style="font-size:15px;color:#666;margin-bottom:32px;">
                        Gracias por elegir nuestros servicios. Para completar tu solicitud y obtener los beneficios de tu compra, es necesario realizar el pago. Sigue las instrucciones a continuación:
                      </p>

                      <div style="background-color:#fcfcfc;border:1px solid #eeeeee;border-radius:12px;padding:20px;text-align:center;">
                        <p style="margin:0 0 8px 0;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;">Total a pagar</p>
                        <h2 style="margin:0 0 24px 0;font-size:36px;color:#1a1a1a;">$${data.amount} <span style="font-size:18px;font-weight:normal;color:#888;">MXN</span></h2>

                        ${
                          data.method === 'oxxo'
                            ? `
                          <div style="border-top:1px solid #eee;margin-top:20px;padding-top:20px;">
                              <div style="margin-bottom:12px; background-color: #f9cd48; padding: 20px; border-radius: 8px;">
                                <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${data.oxxoNumber}&includetext&scale=2&height=15" 
                                    alt="Código de Barras" 
                                    style="max-width:100%; height:auto; display:block; margin: 0 auto; mix-blend-mode: multiply;">
                              </div>

                              <div style="margin-bottom:25px; text-align:center;">
                                <p style="margin:0 0 4px 0; font-size:12px; color:#999; line-height:1.4;">
                                  ¿No se puede escanear? Intenta aumentando el brillo de tu celular o usa el link de abajo:
                                </p>
                                <a href="${data.voucherUrl}" target="_blank" style="font-size:14px; color:#f9cd48; text-decoration:underline; font-weight:bold;">
                                    Ver voucher con código de barras
                                </a>
                              </div>
                            
                            <p style="border-top:1px solid #eee;margin-top:20px;padding-top:20px;margin:0; font-size:12px; color:#999; text-transform:uppercase;">Número de referencia</p>
                            <div style="font-size:18px; font-weight:bold; color:#1a1a1a; margin-bottom:20px; letter-spacing:1px;">
                              ${data.oxxoNumber}
                            </div> 

                            <div style="text-align:left; background:#f9f9f9; border-radius:8px; padding:16px; border:1px solid #eee;">
                              <p style="margin:0 0 8px 0; font-size:13px; font-weight:bold; color:#1a1a1a;">¿Cómo pagar en OXXO?</p>
                              <ul style="margin:0; padding-left:18px; font-size:12px; color:#666; line-height:1.4;">
                                <li>Presenta este código de barras en caja.</li>
                                <li>El pago debe ser en <strong>efectivo</strong>.</li>
                                <li>OXXO cobrará una pequeña comisión al momento de pagar.</li>
                              </ul>
                            </div>                            
                            <p style="font-size:11px; color:#bbb; margin-top:15px;">Vence el: ${formatExpirationTime(data.expiresAfter ?? null)}</p>
                          </div>
                        `
                            : `
                          <div style="border-top:1px solid #eee; margin-top:20px; padding-top:20px; text-align:left;">
                            <div style="background:#fff9e6; border-radius:10px; padding:18px; margin-bottom:12px; border:1px solid #ffeeba;">
                              <p style="margin:0 0 10px 0; font-size:13px; font-weight:bold; color:#856404; display:flex; align-items:center;">
                                ⚠️  Instrucciones importantes:
                              </p>
                              <p style="margin:0; font-size:13px; color:#856404; line-height:1.6;">
                                Para que tu pago se valide automáticamente, es <strong>obligatorio</strong> capturar:
                                <br/>• La <strong>CLABE</strong> correctamente.
                                <br/>• El <strong>monto exacto</strong> de $${data.amount}.
                                <br/>• La <strong>referencia</strong> indicada abajo.
                              </p>
                            </div>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:15px; border-collapse:collapse;">
                              <tr>
                                <td style="padding:10px 0; border-bottom:1px solid #f8f8f8; font-size:14px; color:#888;">CLABE</td>
                                <td align="right" style="padding:10px 0; border-bottom:1px solid #f8f8f8; font-size:15px; font-weight:bold; color:#1a1a1a; font-family:monospace; letter-spacing:0.5px;">${data.clabe}</td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0; border-bottom:1px solid #f8f8f8; font-size:14px; color:#888;">Titular</td>
                                <td align="right" style="padding:10px 0; border-bottom:1px solid #f8f8f8; font-size:15px; font-weight:bold; color:#1a1a1a;">${data.holderName}</td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0; border-bottom:1px solid #f8f8f8; font-size:14px; color:#888;">Banco</td>
                                <td align="right" style="padding:10px 0; border-bottom:1px solid #f8f8f8; font-size:15px; font-weight:bold; color:#1a1a1a;">${data.bankName}</td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0; font-size:14px; color:#888;">Referencia</td>
                                <td align="right" style="padding:10px 0; font-size:15px; font-weight:bold; color:#1a1a1a;">${data.reference}</td>
                              </tr>
                            </table>

                            ${
                              data.holderAddress
                                ? `
                              <div style="margin-bottom:25px; padding:12px; background-color:#fcfcfc; border-radius:8px; border:1px solid #f0f0f0;">
                                <span style="display:block; font-size:11px; font-weight:bold; color:#aaa; text-transform:uppercase; margin-bottom:4px; letter-spacing:0.5px;">Dirección del Titular</span>
                                <p style="margin:0; font-size:12px; color:#777; line-height:1.4;">
                                  ${[
                                    data.holderAddress?.line1,
                                    data.holderAddress?.line2,
                                    data.holderAddress?.postal_code,
                                    data.holderAddress?.city,
                                    data.holderAddress?.state,
                                    data.holderAddress?.country,
                                  ]
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              </div>
                            `
                                : ''
                            }
                          </div>
                        `
                        }
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td align="center" style="padding:32px;background-color:#fafafa;border-top:1px solid #f0f0f0;">
                      <p style="margin:0;font-size:13px;color:#777;">
                        ¿Tienes dudas sobre tu pago? <br/>
                        <a href="mailto:hola@sosencontrandomascotas.com" style="color:#f9cd48;text-decoration:none;font-weight:bold;">Contáctanos aquí</a>
                      </p>
                    </td>
                  </tr>
                </table>

                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;margin-top:24px;">
                  <tr>
                    <td align="center" style="font-size:11px;color:#aaa;line-height:1.5;">
                      <p>© ${new Date().getFullYear()} SOS Encontrando Mascotas. <br/>
                      Este es un correo automático, por favor no respondas directamente.</p>
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
