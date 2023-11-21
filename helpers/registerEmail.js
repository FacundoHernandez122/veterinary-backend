import nodemailer from "nodemailer";

const sendGridTransporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey", // Este es el nombre de usuario para SendGrid
    pass: process.env.SENDGRID_API_KEY, // Reemplaza con tu clave de API de SendGrid
  },
});

const registerEmail = async (data) => {
  const { email, name, token } = data;

  const info = await sendGridTransporter.sendMail({
    from: "Veterinary App",
    to: email,
    subject: "Check your account in Veterinary App!",
    text: "Check your account in veterinary app",
    html: `<p> Hi ${name}, check your account in veterinary app </p>
        <p>Confirm your account in the following link to start using it
        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a></p>

        <p>If this email does not correspond to you, please ignore the message.</p>
        `,
  });

  console.log("Email sent:", info.messageId);
};

export default registerEmail;