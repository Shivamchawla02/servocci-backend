import { Resend } from 'resend';
import multer from 'multer';
import 'dotenv/config';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Setup multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadAndSendMail = [
  upload.single('pdf'), // Accepts `pdf` field in multipart/form-data
  async (req, res) => {
    try {
      const recipientEmail = req.body.universityEmail;
      const pdfBuffer = req.file?.buffer;
      const filename = req.file?.originalname || 'student-profile.pdf';

      if (!recipientEmail || !pdfBuffer) {
        return res.status(400).json({ message: 'Recipient email or PDF missing.' });
      }

      // Send email using Resend
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: recipientEmail,
        subject: 'Student Document Submission',
        text: 'Please find the attached student profile and documents.',
        attachments: [
          {
            filename: filename,
            content: pdfBuffer.toString("base64"),
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Email sent successfully.'
      });

    } catch (err) {
      console.error('Email sending error:', err);

      res.status(500).json({
        success: false,
        message: 'Failed to send email.'
      });
    }
  },
];