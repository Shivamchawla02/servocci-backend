import Employee from '../models/Employee.js';

export const uploadDocuments = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const files = req.files;

    if (!files) {
      return res.status(400).json({ success: false, message: "No files uploaded." });
    }

    // Construct updated document fields
    const updatedData = {
      documents: {
        profilePhoto: files.profilePhoto?.[0]?.path,
        aadharCard: files.aadharCard?.[0]?.path,
        panCard: files.panCard?.[0]?.path,
        tenthMarksheet: files.tenthMarksheet?.[0]?.path,
        twelfthMarksheet: files.twelfthMarksheet?.[0]?.path,
        competitiveMarksheet: files.competitiveMarksheet?.[0]?.path,
      },
      isDocumentsSubmitted: true, // ✅ Step 2: Mark as submitted
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updatedData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    res.status(200).json({ success: true, message: "Documents uploaded and status updated." });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: "Document upload failed." });
  }
};
