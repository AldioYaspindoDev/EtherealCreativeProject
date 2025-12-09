"use client";

import { useState } from "react";
import axios from "axios"; // Boleh dipakai di Client Component
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function FeedbackTable({ initialFeedbacks }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus feedback ini?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/feedbacks/${id}`);
      setFeedbacks(feedbacks.filter((f) => f._id !== id));
      toast.success("Feedback berhasil dihapus!", {
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
      console.error("Gagal menghapus feedback:", error);
      toast.error("Terjadi kesalahan saat menghapus feedback.", {
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
  };

  return (
    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-neutral-800 text-white">
        <tr>
          <th className="px-4 py-3 text-left font-poppins">No</th>
          <th className="px-4 py-3 text-left font-poppins">Komentar</th>
          <th className="px-4 py-3 text-left font-poppins">Rating</th>
          <th className="px-6 py-3 text-center font-poppins">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {feedbacks.length === 0 ? (
          <tr>
            <td colSpan="4" className="px-4 py-8 text-center text-black">
              Tidak ada data feedback
            </td>
          </tr>
        ) : (
          feedbacks.map((feedback, index) => (
            <tr
              key={feedback._id}
              className="text-black border-b border-neutral-200 hover:bg-neutral-50"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3 text-sm">{feedback.komentar}</td>
              <td className="px-4 py-3 text-sm">{feedback.rating}</td>
              <td className="px-6 py-3 text-center">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleDelete(feedback._id)}
                    className="flex items-center justify-center w-9 h-9 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
