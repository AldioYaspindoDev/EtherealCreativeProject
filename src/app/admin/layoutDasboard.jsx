"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";
import {
  Users,
  ShoppingBag,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  UserCheck,
  RefreshCw,
  LayoutDashboard as DashboardIcon,
} from "lucide-react";

export default function LayoutDashboard() {
  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalCustomers: 0,
    totalCatalogs: 0,
    totalPortfolios: 0,
    totalOrders: 0, // Belum difilter statusnya, ambil total semua
    totalArticles: 0,
    totalFeedbacks: 0,
    currentUser: "Loading...",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("adminToken");

      const [
        adminsRes,
        customersRes,
        catalogsRes,
        portfoliosRes,
        ordersRes,
        articlesRes,
        feedbacksRes,
      ] = await Promise.all([
        fetchAdmins(token),
        fetchCustomers(token),
        fetchCatalogs(),
        fetchPortfolios(),
        fetchOrders(),
        fetchArticles(),
        fetchFeedbacks(),
      ]);

      setStats({
        totalAdmins: adminsRes.length,
        totalCustomers: customersRes.length,
        totalCatalogs: catalogsRes.length,
        totalPortfolios: portfoliosRes.length,
        totalOrders: ordersRes.length,
        totalArticles: articlesRes.length,
        totalFeedbacks: feedbacksRes.length,
        currentUser: getCurrentUserRole(token),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      return res.data.data || [];
    } catch (error) {
      console.error("Fetch Admins Error:", error);
      return [];
    }
  };

  const fetchCustomers = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/customer/`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      return res.data.data || [];
    } catch (error) {
      console.error("Fetch Customers Error:", error);
      return [];
    }
  };

  const fetchCatalogs = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/catalogs`,
        {
          withCredentials: true,
        }
      );
      return res.data.data || [];
    } catch (error) {
      return [];
    }
  };

  const fetchPortfolios = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/portofolio`,
        {
          withCredentials: true,
        }
      );
      return Array.isArray(res.data.data) ? res.data.data : [];
    } catch (error) {
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        withCredentials: true,
      });
      // Assuming response structure similar to others, or direct array
      // OrderTable uses res.data.data usually.
      return res.data.data || [];
    } catch (error) {
      return [];
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        {
          withCredentials: true,
        }
      );
      return res.data.data || [];
    } catch (error) {
      return [];
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/feedbacks`,
        {
          withCredentials: true,
        }
      );
      return res.data.data || [];
    } catch (error) {
      return [];
    }
  };

  const getCurrentUserRole = (token) => {
    try {
      if (!token) return "Guest";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || "User";
    } catch (error) {
      return "User";
    }
  };

  const menuItems = [
    {
      title: "User Admin",
      count: stats.totalAdmins,
      icon: <UserCheck className="w-8 h-8 text-blue-600" />,
      color: "bg-blue-50",
      link: "/admin/user",
      label: "Administrator terdaftar",
    },
    {
      title: "User Customer",
      count: stats.totalCustomers,
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      color: "bg-indigo-50",
      link: "/admin/userCustomer",
      label: "Pelanggan terdaftar",
    },
    {
      title: "Katalog Produk",
      count: stats.totalCatalogs,
      icon: <ShoppingBag className="w-8 h-8 text-orange-600" />,
      color: "bg-orange-50",
      link: "/admin/catalog",
      label: "Item dalam katalog",
    },
    {
      title: "Order Masuk",
      count: stats.totalOrders,
      icon: <div className="text-emerald-600 font-bold text-xl">🛒</div>, // Fallback if icon issue, but using emoji/icon mixed ok.
      // Better use Lucide:
      icon: <ShoppingBag className="w-8 h-8 text-emerald-600" />,
      color: "bg-emerald-50",
      link: "/admin/order",
      label: "Total transaksi pemesanan",
    },
    {
      title: "Portofolio",
      count: stats.totalPortfolios,
      icon: <ImageIcon className="w-8 h-8 text-pink-600" />,
      color: "bg-pink-50",
      link: "/admin/portofolio",
      label: "Karya/Project ditampilkan",
    },
    {
      title: "Artikel Blog",
      count: stats.totalArticles,
      icon: <FileText className="w-8 h-8 text-cyan-600" />,
      color: "bg-cyan-50",
      link: "/admin/article",
      label: "Artikel dipublikasikan",
    },
    {
      title: "Feedback",
      count: stats.totalFeedbacks,
      icon: <MessageSquare className="w-8 h-8 text-violet-600" />,
      color: "bg-violet-50",
      link: "/admin/about",
      label: "Ulasan pengguna diterima",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang di Dashboard, {stats.currentUser}!
          </h1>
          <p className="text-neutral-300 max-w-2xl">
            Pantau dan kelola seluruh aktivitas website Ethereal Creative dari
            panel ini.
          </p>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Control Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-800">
          <DashboardIcon className="w-5 h-5" />
          <h2 className="text-xl font-bold">Ringkasan Statistik</h2>
        </div>
        <button
          onClick={fetchAllData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-32 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  {item.count}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
