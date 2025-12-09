"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CustomerRegister() {
  const [username, setUsername] = useState("");
  const [nomorhp, setNomorhp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/customer/register`, {
        username,
        nomorhp,
        password,
      });

      toast.success("Customer berhasil terdaftar!", {
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
      window.location.href = "/login"; // redirect ke login
    } catch (err) {
      setError(err.response?.data?.message || "Register gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row w-full h-screen">
      {/* FORM REGISTER */}
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-50">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10"
        >
          <h1 className="text-3xl font-semibold font-['Poppins'] text-center mb-10 text-gray-800">
            Register Customer
          </h1>

          {/* Nama */}
          <div className="mb-6">
            <label className="block text-lg text-gray-700 font-medium mb-2 font-['Poppins']">
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Lengkap"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-[40px] text-lg text-gray-800 placeholder-neutral-400 focus:ring-2 focus:ring-blue-900/40 focus:outline-none"
              required
            />
          </div>

          {/* Nomor Telepon */}
          <div className="mb-6">
            <label className="block text-lg text-gray-700 font-medium mb-2 font-['Poppins']">
              Nomor Telepon
            </label>
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={nomorhp}
              onChange={(e) => setNomorhp(e.target.value)}
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
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-[40px] text-lg text-gray-800 placeholder-neutral-400 focus:ring-2 focus:ring-blue-900/40 focus:outline-none"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-center text-sm mb-4 font-['Poppins']">
              {error}
            </p>
          )}

          {/* Button Register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white text-lg font-bold rounded-[40px] shadow-md transition font-['Poppins'] disabled:opacity-60"
          >
            {loading ? "Loading..." : "REGISTER"}
          </button>

          <div className="text-center mt-2">
            <span className="text-gray-400">Sudah punya akun </span>
            <Link href="/login">
              <span className="text-blue-400 hover:text-blue-700">
                Login disini!
              </span>
            </Link>
          </div>
        </form>
      </div>

      {/* KANAN: GAMBAR (AUTO HIDE DI HP) */}
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
