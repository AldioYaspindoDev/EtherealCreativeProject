import axios from "axios";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import UserTable from "./UserTable";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

const fetchUsers = async () => {
  try {
    const token = cookies().get("adminToken")?.value; // Server-side token
    if (!token) {
      console.log("TOKEN TIDAK ADA (Server)");
      return [];
    }

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin`,
      {
        withCredentials: true, // penting agar cookie dikirim otomatis
      }
    );

    console.log("Users fetched:", res.data.data);
    return res.data.data || [];
  } catch (error) {
    console.error(
      "ERROR FETCH USERS (Server):",
      error.response?.status,
      error.response?.data
    );
    return [];
  }
};
export default async function UserPage() {
  const users = await fetchUsers();
  return (
    <div>
      {/* Header */}
      <div className="relative w-full h-48 mt-10 mx-auto max-w-[1171px]">
        <img
          src="/assetgambar/imageStore.webp"
          alt=""
          width={1171}
          height={192}
          className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg"
        />
        <div className="absolute inset-0 bg-neutral-700/20 rounded-lg backdrop-blur-sm" />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-6xl font-poppins">
          USER ADMIN
        </h1>
      </div>
      <div className="mt-[30px] ms-[15px] flex flex-col w-[140px]">
        <Link
          href="/admin/user/createUser"
          className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          <span>Tambah</span>
        </Link>
      </div>
      <div className="mx-auto max-w-[1171px] mt-10 px-4 mb-10">
        {/* Kirim data 'users' yang sudah di-fetch sebagai 'initialUsers' */}
        <UserTable initialUsers={users} />
      </div>
    </div>
  );
}
