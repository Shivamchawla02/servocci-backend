import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
  attachments = [],
}) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Resend Error:", error);

    return {
      success: false,
      error,
    };
  }
};