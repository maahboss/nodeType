import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_DOMAIN_HOST,
  port: Number(process.env.EMAIL_DOMAIN),
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const mailer = (email: string, subject: string, content: string) =>
  new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject,
        text: subject,
        html: content,
      },
      (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(`Email sent: ${info.response}`);
        }
      }
    );
  });
