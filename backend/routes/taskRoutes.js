import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  getTodayGoals,
  updateTask,
  deleteTask,
  toggleMilestone,
  getWeeklyStats
} from '../controllers/taskController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ Protect all routes using auth middleware
router.use(auth);

// ✅ Create a new task
router.post('/', createTask);

// ✅ Get all tasks for the user
router.get('/', getTasks);

// ✅ Get only today's goal tasks
router.get('/today', getTodayGoals);

// ✅ Weekly Stats
router.get('/weekly-stats', getWeeklyStats);

// ✅ Get a single task by ID
router.get('/:id', getTaskById);

// ✅ Update a task by ID
router.put('/:id', updateTask);

// ✅ Delete a task by ID
router.delete('/:id', deleteTask);

// ✅ Toggle milestone completion
router.put('/:taskId/milestones/:index/toggle', toggleMilestone);

export default router;
