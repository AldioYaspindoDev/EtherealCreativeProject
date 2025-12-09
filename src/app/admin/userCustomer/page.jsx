import axios from "axios";
import UserTable from "./UserTable";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

const fetchUsers = async () => {
  try {
    const cookieStore = await cookies(); // Tunggu dulu cookies-nya
    const token = cookieStore.get("adminToken")?.value;

    if (!token) {
      console.log("TOKEN TIDAK ADA (Server)");
      return [];
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("ERROR: NEXT_PUBLIC_API_URL tidak ditemukan!");
      return [];
    }

    const res = await axios.get(`${apiUrl}/api/admin/customer/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data?.data ?? [];
  } catch (error) {
    console.error("ERROR FETCH USERS (Server):", error);
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
          alt="Store Banner"
          width={1171}
          height={192}
          className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg"
        />
        <div className="absolute inset-0 bg-neutral-700/20 rounded-lg backdrop-blur-sm" />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-6xl font-poppins">
          USER CUSTOMER
        </h1>
      </div>

      <div className="mt-[30px] ms-[15px] flex flex-col w-[140px]" />

      <div className="mx-auto max-w-[1171px] mt-10 px-4 mb-10">
        <UserTable initialUsers={users} />
      </div>
    </div>
  );
}
