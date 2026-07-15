import Navbar from "@/components/Navbar";
import CatalogSection from "./CatalogSection";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

async function getCatalogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/catalogs?page=1&limit=20`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error("Failed to fetch catalogs");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching catalogs on server:", error);
    return { data: [], pagination: null };
  }
}

export default async function Catalog() {
  const initialData = await getCatalogs();

  return (
    <main>
      <Navbar />
      <CatalogSection 
        initialData={Array.isArray(initialData.data) ? initialData.data : []} 
        initialPagination={initialData.pagination} 
      />
      <Footer />
    </main>
  );
}
