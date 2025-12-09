"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hapus semua kode pengecekan token manual dan toast error di frontend

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/register`, // URL KOREKSI
        form,
        {
          withCredentials: true, // ANDALKAN PENGIRIMAN COOKIE OTOMATIS
        }
      );
      toast.success("User berhasil dibuat!", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#ffffff",
          color: "black",
          padding: "12px 24px",
          borderRadius: "999px",
          fontSize: "14px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        },
      });
      router.push("/admin/user");
    } catch (error) {
      // Tangani kegagalan otorisasi 401/403 yang dikirim dari backend
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi berakhir/Izin ditolak. Silakan login ulang.", {
          duration: 4000,
          position: "bottom-center",
          style: {
            background: "#ffffff",
            color: "black",
            padding: "16px 20px",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(245, 87, 108, 0.4)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            minWidth: "320px",
          },
        });
        router.push("/loginadmin");
      } else {
        console.error("CREATE USER ERROR:", error);
        toast.error("Gagal membuat user.", {
          duration: 4000,
          position: "bottom-center",
          style: {
            background: "#ffffff",
            color: "black",
            padding: "16px 20px",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(245, 87, 108, 0.4)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            minWidth: "320px",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 text-black bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Tambah User</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
