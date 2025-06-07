import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TodayGoals from "../components/TodayGoals";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all, today, completed, overdue
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.TASKS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []); // Ensure we always set an array
    } catch (err) {
      toast.error("Failed to fetch tasks");
      console.error(
        "Failed to fetch tasks:",
        err.response?.data?.msg || err.message
      );
      setTasks([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_ENDPOINTS.TASK_BY_ID(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      toast.error("Failed to delete task");
      console.error(
        "Error deleting task:",
        err.response?.data?.msg || err.message
      );
    }
  };

  const handleToggleMilestone = async (taskId, milestoneIndex) => {
    try {
      await axios.put(
        API_ENDPOINTS.TOGGLE_MILESTONE(taskId, milestoneIndex),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      toast.error("Failed to toggle milestone");
      console.error(
        "Failed to toggle milestone:",
        err.response?.data?.msg || err.message
      );
    }
  };

  const calculateMilestoneProgress = (task) => {
    if (!task.milestones || task.milestones.length === 0) return 0;
    const completed = task.milestones.filter((m) => m.done).length;
    return Math.floor((completed / task.milestones.length) * 100);
  };

  const isTaskOverdue = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(task.endDate);
    return endDate < today && calculateMilestoneProgress(task) < 100;
  };

  const isTaskToday = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    return startDate <= today && endDate >= today;
  };

  const isTaskCompleted = (task) => {
    return calculateMilestoneProgress(task) === 100;
  };

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "today":
        return isTaskToday(task);
      case "completed":
        return isTaskCompleted(task);
      case "overdue":
        return isTaskOverdue(task);
      default:
        return true;
    }
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">📋 Dashboard</h2>
        <button
          onClick={() => navigate("/create-task")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
          ➕ Create Task
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter("today")}
          className={`px-4 py-2 rounded ${
            filter === "today"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Today's Tasks
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Completed Tasks
        </button>
        <button
          onClick={() => setFilter("overdue")}
          className={`px-4 py-2 rounded ${
            filter === "overdue"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Overdue Tasks
        </button>
      </div>

      <TodayGoals tasks={tasks} />

      <div className="space-y-4 mt-8">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={`bg-white p-4 rounded shadow hover:shadow-md transition ${
              isTaskOverdue(task) ? "border-l-4 border-red-500" : ""
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              {task.title}
            </h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500">
              Start: {new Date(task.startDate).toLocaleDateString()} | End:{" "}
              {new Date(task.endDate).toLocaleDateString()}
            </p>

            {task.milestones?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {task.milestones.map((m, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={m.done}
                      onChange={() => handleToggleMilestone(task._id, index)}
                    />
                    <span
                      className={m.done ? "line-through text-gray-500" : ""}
                    >
                      {m.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-sm text-green-600 mt-2">
              Progress: {calculateMilestoneProgress(task)}%
            </p>
            <div className="w-full bg-gray-300 h-2 rounded">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${calculateMilestoneProgress(task)}%` }}
              ></div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => navigate(`/edit-task/${task._id}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-sm text-red-600 hover:underline"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
