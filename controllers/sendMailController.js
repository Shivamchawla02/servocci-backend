import nodemailer from 'nodemailer';
import multer from 'multer';

// Setup multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadAndSendMail = [
  upload.single('pdf'), // Accepts `pdf` field in multipart/form-data
  async (req, res) => {
    try {
      const recipientEmail = req.body.universityEmail; // ✅ FIXED: Matches frontend field name
      const pdfBuffer = req.file?.buffer;
      const filename = req.file?.originalname || 'student-profile.pdf';

      if (!recipientEmail || !pdfBuffer) {
        return res.status(400).json({ message: 'Recipient email or PDF missing.' });
      }

      // Nodemailer transporter using domain email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,      // ✅ uses correct key from .env
          pass: process.env.EMAIL_PASS,      // ✅ FIXED: should match .env
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Student Document Submission',
        text: 'Please find the attached student profile and documents.',
        attachments: [
          {
            filename,
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
