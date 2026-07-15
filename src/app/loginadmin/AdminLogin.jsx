"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        { username, password },
        { withCredentials: true }
      );

      console.log("Admin login success:", res.data);

      // Simpan token di COOKIES (bukan localStorage)
      if (res.data.token) {
        document.cookie = `adminToken=${res.data.token}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`; // 7 hari
        console.log("Admin token saved to cookies");
      }

      // Redirect
      setTimeout(() => {
        window.location.href = "/admin";
      }, 100);
    } catch (err) {
      console.error("Admin login error:", err);
      toast.error("Login gagal. Periksa username dan password.", {
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
    <section className="flex flex-col md:flex-row w-full h-screen">
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10"
        >
          <h1 className="text-3xl font-semibold font-['Poppins'] text-center mb-10 text-gray-800">
            Admin Panel
          </h1>

          {/* Username */}
          <div className="mb-6">
            <label className="block text-lg text-gray-700 font-medium mb-2 font-['Poppins']">
              Username
            </label>
            <input
              type="text"
              placeholder="Masukan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-[40px] text-lg text-gray-800 placeholder-neutral-400 focus:ring-2 focus:ring-blue-900/40 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-lg text-gray-700 font-medium mb-2 font-['Poppins']">
              Password
            </label>
            <input
              type="password"
              placeholder="Masukan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-[40px] text-lg text-gray-800 placeholder-neutral-400 focus:ring-2 focus:ring-blue-900/40 focus:outline-none"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-600 text-center text-sm mb-4 font-['Poppins']">
              {error}
            </p>
          )}

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white text-lg font-bold rounded-[40px] shadow-md transition font-['Poppins'] disabled:opacity-60"
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
      </div>

      <div className="flex-1 relative hidden md:block">
        <Image
          src="/assetgambar/imagelogin.webp"
          alt="Background"
          fill
          className="object-cover blur-sm brightness-90"
          priority
        />

        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />

        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/assetgambar/MainLogo.png"
            alt="Logo"
            width={400}
            height={400}
            className="object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
