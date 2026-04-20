import nodemailer from 'nodemailer';
import { emailPort } from '../../domain/ports/email.port';

export const emailService: emailPort = {
    sendCredentials: async (email: string, petName: string): Promise<void> => {
        // 1. Transporter configuration
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, 
            port: Number(process.env.EMAIL_PORT),
            secure: false, // true for port 465, false for other
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 2. E-mail content definition
        const mailOptions = {
            from: '"SOS Mascotas" <no-reply@sosmascotas.com>',
            to: email,
            subject: '¡Tu cuenta ha sido creada!',
            text: `Hola! Hemos recibido tu solicitud. Ya puedes acceder con:\nUsuario: ${email}\nContraseña: ${petName}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h1>¡Bienvenido a SOS Mascotas!</h1>
                    <p>Mientras procesamos tu pago, ya hemos habilitado tu acceso.</p>
                    <p><b>Tus credenciales de acceso:</b></p>
                    <ul>
                        <li><b>Usuario:</b> ${email}</li>
                        <li><b>Contraseña:</b> ${petName}</li>
                    </ul>
                </div>
            `
        };

        // 3. Send e-mail
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Correo de bienvenida enviado a: ${email}`);
        } catch (error) {
            console.error('Error enviando el correo:', error);
        }
    }
};