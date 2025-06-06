//for managing CRUD operation :
import Task from "../model/taskModel.js";

//CREATE
export const createTask = async (req, res) => {
  try {
    const { startDate } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset time to start of day

    if (new Date(startDate) < today) {
      return res.status(400).json({ msg: "Start date cannot be before today" });
    }

    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

//GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!task) {
      return res.status(404).json({ msg: "Task not found or not authorized" });
    }
    
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

//GET ALL TASKS
export const getTasks = async(req , res) =>{
    try{
        const tasks = await Task.find({userId: req.user.id});
        res.status(200).json(tasks);
    }catch(err){
        res.status(400).json({msg : err.message});
    }
};

//UPDATE
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ msg: "Task not found or not authorized" });
    }

    // Manually update allowed fields
    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.startDate = req.body.startDate ?? task.startDate;
    task.endDate = req.body.endDate ?? task.endDate;
    task.goalForToday = req.body.goalForToday ?? task.goalForToday;
    task.milestones = req.body.milestones ?? task.milestones;

    if (
      Array.isArray(task.milestones) &&
      task.milestones.length > 0 &&
      task.milestones.every(m => m.done)
    ) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


//DELETE
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Task not found or not authorized" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error: " + err.message });
  }
};
//TODAY GOALS
export const getTodayGoals = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const tasks = await Task.find({
      userId: req.user.id,
      goalForToday: true,
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error while fetching today\'s goals' });
  }
};

//Toggle Milestone
export const toggleMilestone = async (req, res) => {
  const { taskId, index } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const milestone = task.milestones[index];
    if (!milestone) return res.status(404).json({ msg: "Milestone not found" });

    milestone.done = !milestone.done;

    await task.save();
    res.json({ msg: "Milestone toggled", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

//CREATE STATS
export const getWeeklyStats = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    const weeklyStats = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    tasks.forEach(task => {
      if (task.completedAt) {
        const day = new Date(task.completedAt).toLocaleString("en-US", { weekday: "long" });
        if (weeklyStats[day] !== undefined) {
          weeklyStats[day].push({ title: task.title, date: task.completedAt });
        }
      }
    });

    res.json(weeklyStats);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch weekly stats" });
  }
};
