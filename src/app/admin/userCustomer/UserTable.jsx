"use client";

import { useState } from "react";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function UserTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus user ?");
    if (!confirmDelete) return;

    try {
      // fetch Delete customer
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/customer/${id}`,
        {
          withCredentials: true,
        }
      );
      setUsers((prev) => prev.filter((item) => item._id !== id));
      toast.success("User berhasil dihapus", {
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
    } catch (error) {
      console.error("Gagal menghapus user:", error);
      if (error.response) {
        toast.error(
          `Gagal: ${error.response.data.message || "Error dari server"}`,
          {
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
          }
        );
      } else if (error.request) {
        toast.error(
          "Gagal: Tidak bisa terhubung ke server. Cek API dan CORS.",
          {
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
          }
        );
      } else {
        toast.error(`Gagal: ${error.message}`, {
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
    }
  };

  return (
    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-neutral-800 text-white">
        <tr>
          <th className="px-4 py-3 text-left font-poppins">No</th>
          <th className="px-4 py-3 text-left font-poppins">Username</th>
          <th className="px-4 py-3 text-left font-poppins">Nomor Telephone</th>
          <th className="px-4 py-3 text-center font-poppins">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 ? (
          <tr>
            <td
              colSpan="4"
              className="px-4 py-8 text-center text-black font-poppins bg-neutral-50"
            >
              Tidak ada data user
            </td>
          </tr>
        ) : (
          users.map((user, index) => (
            <tr
              key={user._id}
              className="text-black border-b border-neutral-200 hover:bg-neutral-100 transition"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 font-medium">{user.username}</td>
              <td className="px-4 py-3 font-medium">{user.nomorhp}</td>

              <td className="text-center px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="flex items-center justify-center bg-red-600 text-white px-3 py-2 text-sm rounded-md hover:bg-red-700 transition"
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
