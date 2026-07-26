import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const analyzeCode = async (problemId, code) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/ai/analyze`,
    { problemId, code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.analysis;
};