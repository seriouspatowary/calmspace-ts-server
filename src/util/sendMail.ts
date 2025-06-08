import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../../../../', '.env') });


const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure:true,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
    },
});

/**
 * Sends an email using Nodemailer
 * @param toEmail - Recipient's email address
 * @param subject - Email subject
 * @param htmlTemplate - HTML content of the email
 */
const sendCustomEmail = async (
  toEmail: string,
  subject: string,
  htmlTemplate: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export default sendCustomEmail;
