// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './model/db.js';

// ✅ Import Routes
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

// ✅ Import Middleware
import auth from './middleware/auth.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('ProTrack Backend is Live with ES Modules!');
});

// ✅ Public Routes
app.use('/api/auth', authRoutes);

// ✅ Protected Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// ✅ Sample Protected Test Route
app.get('/api/profile', auth, (req, res) => {
  res.json({ msg: `Welcome! Your user ID is ${req.user}` });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
