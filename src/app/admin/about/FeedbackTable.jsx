"use client";

import { useState } from "react";
import axios from "axios";
import { Trash2, Search, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function FeedbackTable({ initialFeedbacks = [] }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus feedback ini?")) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/feedbacks/${id}`);
      setFeedbacks(feedbacks.filter((f) => f._id !== id));
      toast.success("Feedback berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus feedback:", error);
      toast.error("Terjadi kesalahan saat menghapus feedback.");
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.komentar?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-current" : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Daftar Feedback</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ulasan dan masukkan dari pelanggan
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari komentar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                No
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Komentar
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data feedback ditemukan.
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((feedback, index) => (
                <tr
                  key={feedback._id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-lg">
                    {feedback.komentar}
                  </td>
                  <td className="px-6 py-4">{renderStars(feedback.rating)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Total {filteredFeedbacks.length} Feedback
        </span>
      </div>
    </div>
  );
}
