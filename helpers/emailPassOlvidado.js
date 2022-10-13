import nodemailer from "nodemailer";
const emailPassOlvidado = async (datos) => {
    //Credenciales
    const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });
    const {email, nombre, token} = datos;

    
    // --------------- Enviar EMAIL REAL --------------------
        
    const info = await transport.sendMail({
        from: `Vet Cares <${process.env.EMAIL_USER}>`,
        to: `${nombre.toUpperCase()} <${email}>`,
        subject: "Password Reset",
        text: "Password Reset",
        headers: {
            priority: "high"
        },
        attachments: [
            {
                filename: "welcome.png",
                path: "../frontend/src/media/dogWalking.png",
                cid: process.env.EMAIL_USER
            }
        ],
        html: `<style>*{font-family: Arial;text-align: center;}</style>
        <h3 style=color:#4f46e5;>Greetings ${nombre.toUpperCase()}, click the following link to reset your password from Vet Cares <a href="${process.env.FRONTEND_URL1}/forgot-password/${token}">Here</a></h3>
        <p>If you didn't ask for this you can ignore this message.</p>
        <blockquote style=text-align: end;> -Vet Cares Developer, Pedro </blockquote>
        <img style=width:100%;object-fit: cover; src="cid:${process.env.EMAIL_USER}"/>
        `
    })
    console.log(`Mensaje enviado: %s`, info.messageId);
};
export default emailPassOlvidado;