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
import usageLogRoutes from './routes/UsageLog.js'

connectToDatabase();

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: 'https://servocci.in',
  credentials: true,
}));

// ✅ Handle preflight OPTIONS
app.options('*', cors({
  origin: 'https://servocci.in',
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/councellor', CouncellorRouter);
app.use('/api/usage-log', usageLogRoutes);

// Serve static files
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.send('Backend is working ✅');
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
