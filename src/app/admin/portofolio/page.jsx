import PortofolioTable from "./portofolioTable";

export const dynamic = "force-dynamic";

async function fetchPortofolio() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/portofolio`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Gagal mengambil data portofolio:", response.status);
      return [];
    }

    const responseData = await response.json();
    return Array.isArray(responseData.data) ? responseData.data : [];
  } catch (error) {
    console.error("Gagal mengambil data portofolio : ", error);
    return [];
  }
}

export default async function PortofolioPage() {
  const portofoliosData = await fetchPortofolio();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Manajemen Portofolio
        </h1>
        <p className="text-gray-500">
          Atur dan perbarui koleksi portofolio yang ditampilkan di website
        </p>
      </div>

      <PortofolioTable initialPortofolios={portofoliosData} />
    </div>
  );
}
