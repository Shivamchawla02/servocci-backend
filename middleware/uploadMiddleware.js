import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads/documents directory exists
const documentsPath = path.join('public/uploads', 'documents');
fs.mkdirSync(documentsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

export default upload;
