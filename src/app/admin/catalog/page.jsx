import CatalogTable from "./CatalogTable";

export const dynamic = "force-dynamic";

async function fetchCatalogs() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/catalogs`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Gagal mengambil data catalogs:", response.status);
      return [];
    }

    const responseData = await response.json();
    return Array.isArray(responseData.data) ? responseData.data : [];
  } catch (error) {
    console.error("Gagal mengambil data catalog : ", error);
    return [];
  }
}

export default async function CatalogPage() {
  const catalogs = await fetchCatalogs();

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manajemen Katalog
          </h1>
          <p className="text-gray-500">
            Buat, edit, dan kelola produk toko Anda
          </p>
        </div>

        <CatalogTable initialCatalogs={catalogs} />
      </div>
    </div>
  );
}
