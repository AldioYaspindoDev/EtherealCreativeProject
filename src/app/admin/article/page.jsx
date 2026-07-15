import ArticleTable from "./ArticleTable";

export const dynamic = "force-dynamic";

async function fetchArtikels() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }
    const responseData = await response.json();
    return Array.isArray(responseData.data) ? responseData.data : [];
  } catch (error) {
    console.error("Gagal mengambil data artikel : ", error);
    return [];
  }
}

export default async function ArtikelPage() {
  const artikels = await fetchArtikels();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Artikel</h1>
        <p className="text-gray-500">
          Buat dan kelola konten artikel blog yang menarik
        </p>
      </div>

      <ArticleTable initialArtikels={artikels} />
    </div>
  );
}
