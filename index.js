import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import CouncellorRouter from './routes/councellor.js';
import connectToDatabase from './db/db.js';

connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/councellor', CouncellorRouter);

// Serve static files (like images)
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
