import express from 'express';
import {createTask , getTasks , updateTask , deletetask} from '../controllers/taskController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
router.use(auth); //to protect all routes

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.put('/:id', deletetask);

export default router;
