//for managing CRUD operation :
import Task from "../model/taskModel.js";

//CREATE
export const createTask = async(req , res) => {
    try {
        const task = await Task.create({...req.body , userId: req.user.id});
        res.status(201).json(task);
    }catch(err){
        res.status(400).json({msg : err.message});
    }
};

//GET
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
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Task not found or not authorized" });

    res.json(updated);
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


