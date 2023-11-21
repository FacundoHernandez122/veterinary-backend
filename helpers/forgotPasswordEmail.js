import nodemailer from "nodemailer";

const sendGridTransporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey", // Este es el nombre de usuario para SendGrid
    pass: process.env.SENDGRID_API_KEY, // Reemplaza con tu clave de API de SendGrid
  },
});

const forgotPasswordEmail = async (data) => {
  const { email, name, token } = data;

  const info = await sendGridTransporter.sendMail({
    from: "Veterinary App",
    to: email,
    subject: "Reset your password!",
    text: "Reset your password",
    html: `<p> Hi ${name}, you have requested to change your password. </p>
        <p>To change your password you must click on the following link
        <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset password</a></p>

        <p>If this email does not correspond to you, please ignore the message.</p>
        `,
  });

  console.log("Email sent:", info.messageId);
};

export default forgotPasswordEmail;