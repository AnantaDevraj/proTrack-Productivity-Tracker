import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    goalForToday: false,
    milestonesText: "",
  });
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { taskId } = useParams();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const task = res.data;
        setForm({
          title: task.title || "",
          description: task.description || "",
          startDate: task.startDate?.slice(0, 10) || "",
          endDate: task.endDate?.slice(0, 10) || "",
          goalForToday: task.goalForToday || false,
          milestonesText: task.milestones?.map((m) => m.title).join("\n") || "",
        });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch task details");
        console.error("Error fetching task:", err.response?.data?.msg || err.message);
        navigate("/dashboard");
      }
    };

    fetchTask();
  }, [taskId, token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Validate startDate
    if (name === "startDate") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError("Start date cannot be before today.");
      } else {
        setDateError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("Start date cannot be earlier than today.");
      return;
    }

    if (end < start) {
      toast.error("End date must be greater than or equal to the start date.");
      return;
    }

    // Prevent submission if date is invalid
    if (dateError) return;

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
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Task updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
        ✏️ Edit Task
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 mb-8 space-y-4">
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
            {dateError && (
              <p className="text-red-500 text-sm mt-1">{dateError}</p>
            )}
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
          <label className="font-semibold">Mark as today's goal</label>
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!!dateError}
            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Update Task
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask; 