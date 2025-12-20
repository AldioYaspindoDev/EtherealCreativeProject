"use client";
import OrderTable from "./orderTabel";

export default function OrderPage() {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Pesanan
          </h1>
          <p className="text-gray-500">Pantau dan kelola semua pesanan masuk</p>
        </div>

        <OrderTable />
      </div>
    </div>
  );
}
