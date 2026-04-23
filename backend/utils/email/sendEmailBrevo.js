import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});


if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is missing");
}

export const sendEmailBrevoNoAttachments = async ({ toEmail, subject, htmlContent }) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail }],
      subject,
      htmlContent,
    });

    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error("Brevo Email Error:", error?.message || error);
    throw error;
  }
};




const sendEmailBrevo = async ({
  toEmail,
  subject,
  htmlContent,
  attachments = []
}) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail }],
      subject,
      htmlContent,
      attachment: attachments, // ✅ THIS LINE
    });

    return response;
  } catch (error) {
    console.error("Brevo Email Error:", error?.message || error);
    throw error;
  }
};


export default sendEmailBrevo;