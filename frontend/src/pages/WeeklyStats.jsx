import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { toast } from "react-toastify";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border">
        <p className="font-semibold">{label}</p>
        <p className="text-blue-600">Completed Tasks: {payload[0].value}</p>
        {payload[0].payload.tasks && (
          <div className="mt-2">
            <p className="text-sm font-semibold">Tasks:</p>
            <ul className="text-sm text-gray-600">
              {payload[0].payload.tasks.map((task, index) => (
                <li key={index}>• {task}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const WeeklyStats = () => {
  const [stats, setStats] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/weekly-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Convert object to array format for recharts
        const formatted = Object.entries(res.data).map(([day, data]) => ({
          day,
          completed: data.count,
          tasks: data.tasks || [],
        }));

        setStats(formatted);
      } catch (err) {
        toast.error("Failed to fetch weekly stats");
        console.error("Error fetching weekly stats:", err.response?.data?.msg || err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
        📊 Weekly Task Completion Stats
      </h2>

      {stats.length === 0 ? (
        <p className="text-gray-600 text-center">No completed tasks this week.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                tick={{ fill: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="completed" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeeklyStats;
