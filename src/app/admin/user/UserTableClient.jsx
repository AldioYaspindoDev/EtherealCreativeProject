"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2, Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserTableClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsersClient = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin`,
        { withCredentials: true }
      );

      setUsers(res.data.data || []);
    } catch (error) {
      console.error("ERROR FETCH USERS (Client):", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Sesi habis. Silakan login.");
        router.push("/loginadmin");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleDeleteUser = async (userId) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user ID: ${userId}?`))
      return;

    setLoading(true);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${userId}`,
        {
          withCredentials: true,
        }
      );

      toast.success(`User berhasil dihapus.`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("DELETE ERROR:", error);
      const status = error?.response?.status;

      if (status === 401) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        router.push("/loginadmin");
      } else {
        toast.error(error.response?.data?.message || "Gagal menghapus user.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Daftar Admin</h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola akun administrator sistem
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari Username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <Link
            href="/admin/user/createUser"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Tambah Admin
          </Link>
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
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada admin ditemukan.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Hapus"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
          Total {filteredUsers.length} Admin
        </span>
      </div>
    </div>
  );
}
