"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UserTableClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Fungsi fetch (client-side) untuk memuat ulang data

  const fetchUsersClient = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin`,
        { withCredentials: true }
      );
      setUsers(res.data.data || []);
      return res.data.data || [];
    } catch (error) {
      console.error(
        "ERROR FETCH USERS (Client):",
        error.response?.status,
        error.response?.data
      );
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sesi habis atau izin ditolak.", {
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
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [router]); // Fungsi yang dipanggil saat tombol hapus diklik

  const handleDeleteUser = async (userId) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user ID: ${userId}?`)) {
      return;
    }
    setLoading(true);
    try {
      // 1. KIRIM PERMINTAAN DELETE
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${userId}`,
        { withCredentials: true }
      );
      toast.success(`User ${userId} berhasil dihapus.`, {
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

      // Filter list users saat ini, hanya menyisakan user yang TIDAK memiliki userId ini
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      //    tapi tampilkan pesan sukses lebih dulu.
      await fetchUsersClient();
    } catch (error) {
      console.error("DELETE ERROR:", error);

      // Jika gagal, tampilkan pesan error, dan JANGAN UBAH STATE users di sini.
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Izin ditolak atau sesi berakhir.");
      } else if (error.response?.status === 404) {
        toast.error("User tidak ditemukan.");
      } else if (error.response?.status === 400) {
        toast.error("Tidak Dapat menghapus akun admin sendiri");
      } else {
        toast.error("Gagal menghapus user.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-neutral-800 text-white">
        <tr>
          <th className="px-4 py-3 text-left font-poppins">No</th>
          <th className="px-4 py-3 text-left font-poppins">Username</th>
          <th className="px-4 py-3 text-center font-poppins">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {/* ... (loading dan users.length checks) */}
        {users.map((user, index) => (
          <tr
            key={user._id}
            className="text-black border-b border-neutral-200 hover:bg-neutral-50"
          >
            <td className="px-4 py-3">{index + 1}</td>
            <td className="px-4 py-3 font-medium">{user.username}</td>
            <td className="text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="flex items-center justify-center bg-red-600 text-white px-2 py-2 text-sm rounded hover:bg-red-700 transition"
                  disabled={loading}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
