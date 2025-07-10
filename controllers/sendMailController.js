import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Setup multer to store files temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadAndSendMail = [
  upload.single('pdf'), // Accepts `pdf` field in multipart/form-data
  async (req, res) => {
    try {
      const recipientEmail = req.body.recipientEmail;
      const pdfBuffer = req.file?.buffer;
      const filename = req.file?.originalname || 'student-profile.pdf';

      if (!recipientEmail || !pdfBuffer) {
        return res.status(400).json({ message: 'Recipient email or PDF missing.' });
      }

      // Nodemailer transporter using your domain email
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your SMTP provider if using Zoho/Domain
        auth: {
          user: 'hello@servocci.com', // ✅ Use your domain email
          pass: process.env.EMAIL_PASSWORD, // ✅ Store password in .env
        },
      });

      const mailOptions = {
        from: 'hello@servocci.com',
        to: recipientEmail,
        subject: 'Student Document Submission',
        text: 'Please find the attached student profile and documents.',
        attachments: [
          {
            filename: filename,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (err) {
      console.error('Email sending error:', err);
      res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
  },
];
