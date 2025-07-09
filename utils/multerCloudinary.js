import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'servocci/student-documents',
    format: file.mimetype.split('/')[1], // dynamically set extension
    public_id: `${req.params.phone || Date.now()}-${file.fieldname}`,
  }),
});

const upload = multer({ storage });

export default upload;
