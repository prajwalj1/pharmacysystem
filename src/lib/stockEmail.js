import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, // Gmail with port 465 requires secure=true
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This should be your Gmail App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"PharmaCare Alerts" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}
