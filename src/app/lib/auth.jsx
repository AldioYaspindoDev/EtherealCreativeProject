// frontend/src/lib/auth.js
import api from "@/utils/axios";

export const loginUser = async (username, password) => {
  try {
    const res = await api.post("/api/customer/login", { username, password });
    const { token } = res.data;
    localStorage.setItem("token", token);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Login gagal";
  }
};
