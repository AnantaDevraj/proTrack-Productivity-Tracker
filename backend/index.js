// index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './model/db.js';

// Import Routes & Middleware
import authRoutes from './routes/authRoutes.js';
import auth from './middleware/auth.js'; // for protected routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(' ProTrack Backend is Live with ES Modules!');
});

// Public Routes
app.use('/api/auth', authRoutes);

// Example of a Protected Route
app.get('/api/profile', auth, (req, res) => {
  res.json({ msg: `Welcome! Your user ID is ${req.user}` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
