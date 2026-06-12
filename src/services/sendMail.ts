import nodemailer from "nodemailer";
import { envConfig } from "../config/config.js";

interface Idata {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async (data: Idata) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envConfig.sendMail,
      pass: envConfig.emailPass,
    },
  });
  const mailOptions = {
    from: "sakham07@gmail.com",
    to: data.to,
    subject: data.subject,
    text: data.text,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error occured at semdEmail", error);
  }
};

export default sendEmail;
