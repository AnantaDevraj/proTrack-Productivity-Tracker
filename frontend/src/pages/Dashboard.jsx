import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/profile', {
        headers: { Authorization: token },
      })
      .then(res => setMsg(res.data.msg))
      .catch(() => setMsg('Not authorized'));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-4">{msg}</p>
    </div>
  );
};

export default Dashboard;
