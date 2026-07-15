import axios from "axios";
import { cookies } from "next/headers";

export async function fetchUsers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) return [];

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      }
    );

    return res.data.data || [];
  } catch (err) {
    console.log("FETCH SERVER ERROR:", err.response?.data);
    return [];
  }
}
