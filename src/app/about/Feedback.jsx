"use client";

import axios from "axios";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Feedback() {
  const [komentar, setKomentar] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!komentar || rating === 0) {
      toast.error("komentar atau rating tidak boleh kosong", {
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

      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/feedbacks`, {
        komentar,
        rating,
      });
      toast.success("Terima kasih atas feedback Anda!", {
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

      setKomentar("");
      setRating(0);
    } catch (error) {
      console.error("Gagal menyimpan feedback:", error.message);
      toast.error("Gagal mengirim feedback. Coba lagi nanti.", {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    // Kontainer Utama: Padding dan lebar maksimum responsif
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-xl rounded-2xl mt-8 md:mt-12 border border-blue-900">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
        Beri Komentar & Rating
      </h2>

      <form onSubmit={handleSubmit }>
        {/* Komentar */}
        <div className="mb-6">
          <label
            htmlFor="Komentar"
            className="block text-gray-700 font-semibold mb-2"
          >
            Komentar Anda
          </label>
          <textarea
            id="Komentar"
            name="Komentar"
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            required
            rows="4" // Tinggi baris dikurangi sedikit agar lebih ringkas
            className="w-full px-4 py-3 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150 shadow-inner resize-y border-blue-900 "
            placeholder="Bagikan pengalaman dan masukan Anda di sini..."
          />
        </div>

        {/* Rating Bintang */}
        <div className="mb-6">
          <p className="block text-gray-700 font-semibold mb-3 text-center">
            Pilih Rating Anda:
          </p>
          <div className="flex justify-center gap-3 md:gap-4 ">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  type="button"
                  key={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`Beri ${ratingValue} bintang`}
                >
                  <FaStar
                    size={30} // Ukuran bintang dikurangi sedikit untuk kerapian
                    className={`transition-all duration-200 cursor-pointer
                      ${
                        ratingValue <= (hover || rating)
                          ? "text-yellow-500 transform scale-110" // Efek visual saat dipilih
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-800 text-white text-lg font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                {/* Spinner Icon */}
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Menyimpan...
            </div>
          ) : (
            "Kirim Feedback"
          )}
        </button>
      </form>
    </div>
  );
}
