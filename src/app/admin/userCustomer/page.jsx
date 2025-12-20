import UserTable from "./UserTable";
import { cookies } from "next/headers";
import axios from "axios";

export const dynamic = "force-dynamic";

const fetchUsers = async () => {
  try {
    const cookieStore = await cookies();
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Pelanggan
          </h1>
          <p className="text-gray-500">
            Lihat data pelanggan yang terdaftar di sistem
          </p>
        </div>

        <UserTable initialUsers={users} />
      </div>
    </div>
  );
}
