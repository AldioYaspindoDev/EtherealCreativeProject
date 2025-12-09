"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";

export default function LayoutDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    currentUser: "Loading...",
    totalArticles: 0,
    totalCatalogs: 0,
    totalFeedbacks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Ambil token dari localStorage atau cookie
      const token = localStorage.getItem("adminToken") || "";

      // Fetch semua data secara paralel
      const [usersRes, catalogsRes, articlesRes, feedbacksRes] =
        await Promise.all([
          fetchUsers(token),
          fetchCatalogs(),
          fetchArticles(),
          fetchFeedbacks(),
        ]);

      setStats({
        totalUsers: usersRes.length,
        currentUser: getCurrentUserRole(token), // Fungsi untuk mendapatkan role user saat ini
        totalArticles: articlesRes.length,
        totalCatalogs: catalogsRes.length,
        totalFeedbacks: feedbacksRes.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // 1. Ambil token secara manual dari cookie
      const token = Cookies.get("adminToken");

      const res = await axios.get(
        // Pastikan URL di sini benar, harus mencakup port 5000
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/`, // Asumsi endpoint ini mengembalikan user
        {
          headers: {
            // 2. Tambahkan token ke Header Otorisasi
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      ); // Periksa: Jika res.data adalah array user
      return res.data.data || [];
    } catch (error) {
      console.error("ERROR FETCH USERS:", error);
      return [];
    }
  };

  const fetchCatalogs = async () => {
    try {
      // Pastikan menggunakan NEXT_PUBLIC_API_URL
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogs`,
        { withCredentials: true }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("ERROR FETCH CATALOGS:", error);
      return [];
    }
  };

  const fetchArticles = async () => {
    try {
      // Pastikan menggunakan NEXT_PUBLIC_API_URL
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        { withCredentials: true }
      );
      return response.data.data || [];
    } catch (error) {
      console.error("ERROR FETCH ARTICLES:", error);
      return [];
    }
  };

  const fetchFeedbacks = async () => {
    try {
      // Pastikan menggunakan NEXT_PUBLIC_API_URL
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/feedbacks`,
        { withCredentials: true }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("ERROR FETCH FEEDBACKS:", error);
      return [];
    }
  };

  const getCurrentUserRole = (token) => {
    try {
      if (!token) return "Guest";
      // Decode JWT token untuk mendapatkan role user
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || "User";
    } catch (error) {
      return "User";
    }
  };

  return (
    <div className="w-full min-h-screenp-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-semibold font-['Poppins'] text-neutral-900 mb-12">
          Dashboard Admin
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-2xl text-gray-500">Loading data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card User */}
            <div className="bg-blue-700 rounded-3xl p-8 text-white">
              <h2 className="text-4xl font-semibold font-['Poppins'] mb-6">
                User
              </h2>
              <p className="text-2xl font-medium font-['Poppins'] mb-3">
                User Saat Ini: {stats.currentUser}
              </p>
              <p className="text-2xl font-medium font-['Poppins'] mb-6">
                Jumlah User: {stats.totalUsers}
              </p>
              <Link
                href="/admin/user"
                className="text-black text-base font-normal font-['Poppins'] underline inline-block mt-4"
              >
                Kelola User
              </Link>
            </div>

            {/* Card Katalog */}
            <div className="bg-orange-600 rounded-3xl p-8 text-white">
              <h2 className="text-4xl font-semibold font-['Poppins'] mb-6">
                Katalog
              </h2>
              <p className="text-2xl font-medium font-['Poppins'] mb-6">
                Jumlah Katalog Saat ini: {stats.totalCatalogs}
              </p>
              <Link
                href="/admin/catalog"
                className="text-black text-base font-normal font-['Poppins'] underline inline-block mt-4"
              >
                Kelola Katalog
              </Link>
            </div>

            {/* Card Artikel */}
            <div className="bg-green-400 rounded-3xl p-8 text-white">
              <h2 className="text-4xl font-semibold font-['Poppins'] mb-6">
                Artikel
              </h2>
              <p className="text-2xl font-medium font-['Poppins'] mb-6">
                Jumlah Artikel Saat ini: {stats.totalArticles}
              </p>
              <Link
                href="/admin/article"
                className="text-black text-base font-normal font-['Poppins'] underline inline-block mt-4"
              >
                Kelola Artikel
              </Link>
            </div>

            {/* Card Feedback */}
            <div className="bg-purple-600 rounded-3xl p-8 text-white">
              <h2 className="text-4xl font-semibold font-['Poppins'] mb-6">
                Feedback
              </h2>
              <p className="text-2xl font-medium font-['Poppins'] mb-6">
                Jumlah Feedback Saat ini: {stats.totalFeedbacks}
              </p>
              <Link
                href="/admin/about"
                className="text-black text-base font-normal font-['Poppins'] underline inline-block mt-4"
              >
                Kelola Feedback
              </Link>
            </div>
          </div>
        )}

        {/* Button Refresh */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchAllData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
