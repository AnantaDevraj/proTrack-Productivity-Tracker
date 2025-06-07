const BASE_URL = "https://protrack-productivity-tracker.onrender.com";

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/users/login`,
  REGISTER: `${BASE_URL}/api/users/register`,
  PROFILE: `${BASE_URL}/api/users/profile`,
  TASKS: `${BASE_URL}/api/tasks`,
  TASK_BY_ID: (id) => `${BASE_URL}/api/tasks/${id}`,
  WEEKLY_STATS: `${BASE_URL}/api/tasks/weekly-stats`,
  TODAY_GOALS: `${BASE_URL}/api/tasks/today`,
  TOGGLE_MILESTONE: (taskId, index) => `${BASE_URL}/api/tasks/${taskId}/milestones/${index}/toggle`,
};

export default BASE_URL; 