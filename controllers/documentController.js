import Employee from '../models/Employee.js';

export const uploadDocuments = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No documents uploaded.",
      });
    }

    // Extract uploaded Cloudinary URLs
    const uploadedDocs = {
      profilePhoto: files.profilePhoto?.[0]?.path || '',
      aadharCard: files.aadharCard?.[0]?.path || '',
      panCard: files.panCard?.[0]?.path || '',
      tenthMarksheet: files.tenthMarksheet?.[0]?.path || '',
      twelfthMarksheet: files.twelfthMarksheet?.[0]?.path || '',
      competitiveMarksheet: files.competitiveMarksheet?.[0]?.path || '',
    };

    // Update employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        $set: {
          documents: uploadedDocs,
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

    res.status(200).json({
      success: true,
      message: "Documents uploaded to Cloudinary and saved.",
      documents: uploadedDocs,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Document upload failed.",
    });
  }
};
