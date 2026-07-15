"use client";
import AdminMenu from "./AdminMenu";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminMenu />
      <main className="flex-1 bg-zinc-300 p-8">{children}</main>
    </div>
  );
}
