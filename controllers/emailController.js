import Employee from "../models/Employee.js";
import EmailLog from "../models/EmailLog.js";
import { sendEmail } from "../services/emailService.js";

export const sendStudentEmail = async (req, res) => {
  try {
    const { employeeId, subject, message } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!employee.email) {
      return res.status(400).json({
        success: false,
        message: "Student email not available",
      });
    }

    const html = `
      <div style="font-family:Arial;padding:20px;">
        <h2>Servocci Counsellors</h2>

        <p>Dear ${employee.fullName},</p>

        <div>
            ${message}
        </div>

        <br/>

        <p>
        Regards,<br/>
        Servocci Counsellors
        </p>
      </div>
    `;

    const result = await sendEmail({
      to: employee.email,
      subject,
      html,
    });

    await EmailLog.create({
      employee: employee._id,
      sentBy: req.user._id || req.user.id,
      to: employee.email,
      subject,
      body: message,
      status: result.success ? "sent" : "failed",
      resendId: result.data?.id,
      error: result.error?.message,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Email failed",
      });
    }

    return res.json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudentEmails = async (req, res) => {
  try {

    const emails = await EmailLog.find({
      employee: req.params.employeeId,
    })
      .populate("sentBy", "name")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      emails,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};