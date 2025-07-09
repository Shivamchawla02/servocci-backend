import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'servocci/student-documents',
    format: ['jpg', 'jpeg', 'png', 'pdf'], // optional
    public_id: `${req.params.phone}-${file.fieldname}-${Date.now()}`,
  }),
});

const upload = multer({ storage });

export default upload;
