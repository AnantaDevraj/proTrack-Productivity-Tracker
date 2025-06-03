import express from 'express';
import {
  createTask,
  getTasks,
  getTodayGoals,
  updateTask,
  deleteTask,
  toggleMilestone // ✅ added here
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

// ✅ Update a task by ID
router.put('/:id', updateTask);

// ✅ Delete a task by ID
router.delete('/:id', deleteTask);

// ✅ Toggle milestone completion
router.put('/:taskId/milestones/:index/toggle', auth, toggleMilestone);

export default router;
