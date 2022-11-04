import nodemailer from "nodemailer";
const emailRegistro = async (datos) => {
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
        subject: "Email verification",
        text: "Email verification",
        headers: {
            priority: "high"
        },
        attachments: [
            {
                filename: "welcome.png",
                path: "../frontend/src/media/welcome.png",
                cid: process.env.EMAIL_USER
            }
        ],
        html: `<style>*{font-family: Arial;text-align: center;}</style>
        <h3 style=color:#4f46e5;>Greetings ${nombre.toUpperCase()}, click the following link to confirm your account: <a href="${process.env.FRONTEND_URL}/confirm/${token}">Here</a></h3>
        <p>If you didn't created an account you can ignore this message and your email will be deleted from our database</p>
        <blockquote style=text-align: end;> -Vet Cares Developer, Pedro </blockquote>
        <img style=width:100%;object-fit: cover; src="cid:${process.env.EMAIL_USER}"/>
        `
    })
    console.log(`Mensaje enviado: %s`, info.messageId);
};
export default emailRegistro
