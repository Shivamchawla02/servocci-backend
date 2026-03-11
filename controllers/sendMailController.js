import { Resend } from 'resend';
import multer from 'multer';
import 'dotenv/config';
import Employee from '../models/Employee.js'; // adjust path if needed

const resend = new Resend(process.env.RESEND_API_KEY);

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadAndSendMail = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      const { universityEmail, studentName, regNumber, email } = req.body;
      const pdfBuffer = req.file?.buffer;
      const filename = req.file?.originalname || 'student-profile.pdf';

      if (!universityEmail || !pdfBuffer) {
        return res.status(400).json({
          message: 'Recipient email or PDF missing.'
        });
      }

      // 🔥 Fetch student from DB to get Cloudinary document URLs
      const employee = await Employee.findOne({ regNumber });

      if (!employee) {
        return res.status(404).json({ message: 'Student not found.' });
      }

      const documents = employee.documents || {};

      // 🔥 Build document links section
      let documentLinksHTML = '';

      Object.entries(documents).forEach(([key, url]) => {
        if (url) {
          const formattedName = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

          documentLinksHTML += `
            <tr>
              <td style="padding:8px 0;">
                <a href="${url}" target="_blank" 
                  style="color:#2c6975; text-decoration:none; font-weight:500;">
                  ${formattedName}
                </a>
              </td>
            </tr>
          `;
        }
      });

      // 🚀 Send via Resend
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: universityEmail,
        subject: `Student Application - ${studentName} (${regNumber})`,
        html: `
          <div style="font-family:Arial, sans-serif; padding:20px; max-width:600px;">
            
            <h2 style="color:#001b48;">Student Application Submission</h2>

            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>Registration No:</strong> ${regNumber}</p>
            <p><strong>Email:</strong> ${email}</p>

            <hr style="margin:20px 0;" />

            <h3 style="color:#ff4f00;">Original Documents (Secure Cloudinary Links)</h3>

            <table style="margin-top:10px;">
              ${documentLinksHTML}
            </table>

            <br/>

            <p>
              Please find the compiled student profile attached as PDF for your review.
            </p>

            <br/>

            <p style="font-size:12px; color:gray;">
              Regards,<br/>
              Servocci Counsellors<br/>
              Official Admission Support Team
            </p>
          </div>
        `,
        attachments: [
          {
            filename: filename,
            content: pdfBuffer.toString('base64'),
          },
        ],
      });

      res.status(200).json({
        success: true,
        message: 'Email sent successfully with document links.'
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