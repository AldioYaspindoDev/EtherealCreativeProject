import UserTableClient from "./UserTableClient";
import { fetchUsers } from "./server";

export const dynamic = "force-dynamic";

export default async function UserPage() {
  const users = await fetchUsers();

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Admin</h1>
          <p className="text-gray-500">
            Kelola akun administrator yang memiliki akses ke dashboard
          </p>
        </div>

        <UserTableClient initialUsers={users} />
      </div>
    </div>
  );
}
