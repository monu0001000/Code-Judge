import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

export const createSubmission = async (data) => {
  const res = await api.post("/submissions", data);
  return res.data;
};

export const getSubmissionById = async (id) => {
  const res = await api.get(`/submissions/${id}`);
  return res.data;
};

// Public, unauthenticated — used by the landing page's live demo. Runs code
// through the real sandbox against a fixed set of test cases, no login and
// no submission history involved. Short client-side timeout so a cold
// backend just falls back to an error state instead of hanging.
export const runPlayground = async (code) => {
  const res = await api.post(
    "/playground/run",
    { code },
    { timeout: 8000 }
  );
  return res.data;
};