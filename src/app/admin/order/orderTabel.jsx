"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Search,
  FileDown,
  RefreshCw,
  CheckCircle,
  XCircle,
  Package,
  Filter,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [currentUser, setCurrentUser] = useState("Admin");
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Generate year options (5 tahun terakhir)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Month options
  const monthOptions = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  useEffect(() => {
    fetchOrders();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    try {
      const token = Cookies.get("adminToken");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(
          payload.name || payload.username || payload.email || "Admin"
        );
      }
    } catch (error) {
      console.error("Error getting current user:", error);
      setCurrentUser("Admin");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("adminToken");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = Cookies.get("adminToken");

      // Tentukan endpoint berdasarkan status baru
      let endpoint = "";
      switch (newStatus) {
        case "verified":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/verify`;
          break;
        case "cancelled":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`;
          break;
        case "completed":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/complete`;
          break;
        default:
          toast.error("Status tidak valid");
          return;
      }

      await axios.patch(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Status berhasil diubah ke ${getStatusText(newStatus)}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Gagal mengubah status pesanan");
    }
  };

  // Fungsi untuk menghapus order yang dipilih
  const deleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Pilih pesanan yang ingin dihapus");
      return;
    }

    if (!confirm(`Yakin ingin menghapus ${selectedOrders.length} pesanan?`)) {
      return;
    }

    try {
      const token = Cookies.get("adminToken");

      // Hapus satu per satu
      for (const orderId of selectedOrders) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }

      // Update state
      setOrders((prev) =>
        prev.filter((order) => !selectedOrders.includes(order._id))
      );
      setSelectedOrders([]);
      toast.success(`${selectedOrders.length} pesanan berhasil dihapus`);
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error("Gagal menghapus pesanan");
    }
  };

  // Toggle select single order
  const toggleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Toggle select all orders (yang terfilter)
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order._id));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "verified":
        return "Terverifikasi";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "verified":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Package className="w-4 h-4" />;
      case "verified":
        return <CheckCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    // Filter by year
    let matchesYear = true;
    if (yearFilter !== "all" && order.createdAt) {
      const orderYear = new Date(order.createdAt).getFullYear();
      matchesYear = orderYear === parseInt(yearFilter);
    }

    // Filter by month
    let matchesMonth = true;
    if (monthFilter !== "all" && order.createdAt) {
      const orderMonth = new Date(order.createdAt).getMonth() + 1; // getMonth() returns 0-11
      matchesMonth = orderMonth === parseInt(monthFilter);
    }

    return matchesSearch && matchesStatus && matchesYear && matchesMonth;
  });

  // Statistik
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => !o.status || o.status === "pending").length,
    verified: orders.filter((o) => o.status === "verified").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  // Fungsi Generate PDF - Template seperti gambar
  const generatePDF = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      toast.error("Tidak ada data untuk dicetak");
      return;
    }

    setIsGeneratingPDF(true);

    const currentYear = new Date().getFullYear();
    const currentDate = format(new Date(), "dd MMMM yyyy", { locale: id });

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Laporan Pesanan - ${currentYear}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: A4;
              margin: 20mm;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11pt;
              line-height: 1.4;
              color: #333;
              padding: 20px;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 2px solid #333;
            }
            
            .logo {
              display: flex;
              align-items: center;
            }
            
            .logo img {
              height: 50px;
              width: auto;
            }
            
            .report-info {
              text-align: right;
            }
            
            .report-info h2 {
              font-size: 14pt;
              font-style: italic;
              color: #333;
              margin-bottom: 5px;
            }
            
            .report-info p {
              font-size: 11pt;
              color: #666;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            
            th {
              background: #fff;
              padding: 12px 10px;
              text-align: left;
              font-size: 10pt;
              font-weight: bold;
              color: #333;
              border-bottom: 2px solid #333;
              border-top: 1px solid #333;
            }
            
            td {
              padding: 10px;
              font-size: 10pt;
              border-bottom: 1px solid #ddd;
              vertical-align: top;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-right {
              text-align: right;
            }
            
            .price {
              font-weight: 600;
            }
            
            .status-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 9pt;
              font-weight: 600;
            }
            
            .status-verified {
              background: #d4edda;
              color: #155724;
            }
            
            .status-cancelled {
              background: #f8d7da;
              color: #721c24;
            }
            
            .status-pending {
              background: #fff3cd;
              color: #856404;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 9pt;
              color: #666;
            }
            
            .summary {
              margin-top: 20px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 5px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
            }
            
            .summary-row.total {
              font-weight: bold;
              font-size: 12pt;
              border-top: 1px solid #ddd;
              padding-top: 10px;
              margin-top: 10px;
            }
            
            .signature-section {
              margin-top: 50px;
              display: flex;
              justify-content: flex-end;
            }
            
            .signature-box {
              text-align: center;
              width: 250px;
            }
            
            .signature-box .location-date {
              font-size: 11pt;
              margin-bottom: 10px;
            }
            
            .signature-box .title {
              font-size: 10pt;
              margin-bottom: 80px;
            }
            
            .signature-box .name {
              font-size: 11pt;
              font-weight: bold;
              border-top: 1px solid #333;
              padding-top: 5px;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 9pt;
              color: #666;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo"><img src="/assetgambar/MainLogo.png" alt="Ethereal Logo" style="height: 25px; width: auto;" /></div>
            <div class="report-info">
              <h2>Laporan Pesanan</h2>
              <p>Per : ${currentYear}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 15%">Pelanggan</th>
                <th style="width: 12%">No. Telepon</th>
                <th style="width: 12%">Tanggal</th>
                <th style="width: 8%">Items</th>
                <th style="width: 15%">Total</th>
                <th style="width: 12%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders
                .map(
                  (order, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${order.customerName || "-"}</td>
                  <td>${order.customerPhone || "-"}</td>
                  <td>${
                    order.createdAt
                      ? format(new Date(order.createdAt), "dd/MM/yyyy", {
                          locale: id,
                        })
                      : "-"
                  }</td>
                  <td class="text-center">${order.items?.length || 0}</td>
                  <td class="price">${formatPrice(order.totalAmount || 0)}</td>
                  <td>
                    <span class="status-badge status-${
                      order.status || "pending"
                    }">
                      ${getStatusText(order.status)}
                    </span>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-row">
              <span>Total Pesanan:</span>
              <span>${filteredOrders.length} pesanan</span>
            </div>
            <div class="summary-row">
              <span>Diterima:</span>
              <span>${
                filteredOrders.filter((o) => o.status === "verified").length
              } pesanan</span>
            </div>
            <div class="summary-row">
              <span>Dibatalkan:</span>
              <span>${
                filteredOrders.filter((o) => o.status === "cancelled").length
              } pesanan</span>
            </div>
            <div class="summary-row total">
              <span>Total Pendapatan:</span>
              <span>${formatPrice(
                filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
              )}</span>
            </div>
          </div>
          
          <div class="signature-section">
            <div class="signature-box">
              <p class="location-date">Kota Padang, ${currentDate}</p>
              <p class="title">Diverifikasi oleh,</p>
              <p class="name">${currentUser}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Dokumen ini dibuat secara otomatis oleh sistem.</p>
            <p>© ${currentYear} Ethereal Creative</p>
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(printContent);
    iframeDoc.close();

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (error) {
          console.error("Error printing:", error);
          toast.error("Gagal membuka dialog print");
        }

        setTimeout(() => {
          document.body.removeChild(iframe);
          setIsGeneratingPDF(false);
        }, 100);
      }, 250);
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Memuat data pesanan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Pesanan</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total Pendapatan</p>
          <p className="text-lg font-bold text-blue-600">
            {formatPrice(stats.totalAmount)}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-xs text-yellow-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs text-blue-700 mb-1">Terverifikasi</p>
          <p className="text-2xl font-bold text-blue-800">{stats.verified}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-xs text-green-700 mb-1">Selesai</p>
          <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-xs text-red-700 mb-1">Dibatalkan</p>
          <p className="text-2xl font-bold text-red-800">{stats.cancelled}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Daftar Pesanan</h2>
            <p className="text-sm text-gray-500 mt-1">
              Kelola dan pantau semua pesanan masuk
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pesanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-black r-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none bg-white text-gray-800 cursor-pointer"
              >
                <option value="all" className="text-gray-800">
                  Semua Status
                </option>
                <option value="pending" className="text-gray-800">
                  Pending
                </option>
                <option value="verified" className="text-gray-800">
                  Terverifikasi
                </option>
                <option value="completed" className="text-gray-800">
                  Selesai
                </option>
                <option value="cancelled" className="text-gray-800">
                  Dibatalkan
                </option>
              </select>
            </div>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 text-gray-800 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value="all">Semua Tahun</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Month Filter */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 text-gray-800 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value="all">Semua Bulan</option>
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            {/* Delete Button - tampil jika ada yang dipilih */}
            {selectedOrders.length > 0 && (
              <button
                onClick={deleteSelectedOrders}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Hapus ({selectedOrders.length})
              </button>
            )}

            {/* Download PDF Button */}
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF || filteredOrders.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileDown className="w-4 h-4" />
              {isGeneratingPDF ? "Memproses..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-4 text-center w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrders.length === filteredOrders.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">
                      Tidak ada pesanan ditemukan
                    </p>
                    <p className="text-sm">
                      Coba ubah filter atau kata kunci pencarian
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`hover:bg-blue-50/30 transition-colors group ${
                      selectedOrders.includes(order._id) ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleSelectOrder(order._id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm px-2 py-1 bg-gray-100 rounded text-gray-700">
                        #{order._id?.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerPhone || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.createdAt
                        ? format(
                            new Date(order.createdAt),
                            "dd MMM yyyy, HH:mm",
                            { locale: id }
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} item
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatPrice(order.totalAmount || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* Tombol Verifikasi - hanya tampil jika status pending */}
                        {(!order.status || order.status === "pending") && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "verified")
                            }
                            className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            title="Verifikasi Pesanan"
                          >
                            Verifikasi
                          </button>
                        )}

                        {/* Tombol Selesai - tampil jika verified */}
                        {order.status === "verified" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "completed")
                            }
                            className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            title="Tandai Selesai"
                          >
                            Selesai
                          </button>
                        )}

                        {/* Tombol Batal - tampil jika pending atau verified */}
                        {(!order.status ||
                          order.status === "pending" ||
                          order.status === "verified") && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "cancelled")
                            }
                            className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            title="Batalkan Pesanan"
                          >
                            Batal
                          </button>
                        )}

                        {/* Status final - tidak ada aksi */}
                        {(order.status === "completed" ||
                          order.status === "cancelled") && (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Menampilkan {filteredOrders.length} dari {orders.length} pesanan
          </span>
        </div>
      </div>
    </div>
  );
}
