import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    goalForToday: false,
    milestonesText: "",
  });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const token = localStorage.getItem("authToken");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(
        "Failed to fetch tasks:",
        err.response?.data?.msg || err.message
      );
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const milestones = form.milestonesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((title) => ({ title, done: false }));

    const payload = {
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      goalForToday: form.goalForToday,
      milestones,
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/tasks/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/tasks", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        goalForToday: false,
        milestonesText: "",
      });

      fetchTasks();
    } catch (err) {
      console.error(
        "Error submitting task:",
        err.response?.data?.msg || err.message
      );
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title || "",
      description: task.description || "",
      startDate: task.startDate?.slice(0, 10) || "",
      endDate: task.endDate?.slice(0, 10) || "",
      goalForToday: task.goalForToday || false,
      milestonesText: task.milestones?.map((m) => m.title).join("\n") || "",
    });
    setEditId(task._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(
        "Error deleting task:",
        err.response?.data?.msg || err.message
      );
    }
  };

  const handleToggleMilestone = async (taskId, milestoneIndex) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/milestones/${milestoneIndex}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // Refresh the updated task list
    } catch (err) {
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
        📋 Dashboard
      </h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            showForm ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowForm(true)}
        >
          ➕ Create Task
        </button>
        <button
          className={`px-4 py-2 rounded ${
            !showForm ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowForm(false)}
        >
          📄 View Tasks
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block font-semibold">Task Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="block font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div className="w-full">
              <label className="block font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="goalForToday"
              checked={form.goalForToday}
              onChange={handleChange}
            />
            <label className="font-semibold">Mark as today’s goal</label>
          </div>

          <div>
            <label className="block font-semibold">
              Milestones (one per line)
            </label>
            <textarea
              name="milestonesText"
              value={form.milestonesText}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Eg: Setup project\nDesign schema\nCreate frontend"
            />
          </div>

          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
            {editId ? "Update Task" : "Save Task"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-100 p-4 rounded shadow hover:shadow-md transition"
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
                  onClick={() => handleEdit(task)}
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
      )}
    </div>
  );
};

export default Dashboard;
