import Employee from '../models/Employee.js';

export const uploadDocuments = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { documents: documentUrls } = req.body;  // <-- extract inner object

    console.log("➡️ Received document URLs for employee ID:", employeeId);
    console.log("📝 Document URLs:\n", JSON.stringify(documentUrls, null, 2));

    // Validate required fields (optional but good)
    const requiredFields = [
      'profilePhoto',
      'aadharCard',
      'panCard',
      'tenthMarksheet',
      'twelfthMarksheet',
      'competitiveMarksheet',
    ];

    for (let field of requiredFields) {
      if (!documentUrls[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing document URL: ${field}`,
        });
      }
    }

    // Update employee document info
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        $set: {
          documents: documentUrls,
          isDocumentsSubmitted: true,
        },
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    console.log("✅ Documents saved successfully for employee ID:", employeeId);

    res.status(200).json({
      success: true,
      message: "Documents uploaded and saved successfully.",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Error in uploadDocuments:\n", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving documents.",
      error: error.message,
    });
  }
};
