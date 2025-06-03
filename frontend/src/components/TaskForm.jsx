import { useState } from 'react';

const TaskForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    goalForToday: false,
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input" />
      <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="input" />
      <label>
        <input type="checkbox" name="goalForToday" checked={form.goalForToday} onChange={handleChange} />
        Goal for Today
      </label>
      <button type="submit" className="btn">Save Task</button>
    </form>
  );
};

export default TaskForm;
