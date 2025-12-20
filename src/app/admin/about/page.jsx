import FeedbackTable from "./FeedbackTable";

export const dynamic = "force-dynamic";

async function fetchFeedbacks() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/feedbacks`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Gagal mengambil data feedback:", response.status);
      return [];
    }

    const responseData = await response.json();
    return responseData.data || [];
  } catch (error) {
    console.error("Gagal mengambil data feedback:", error);
    return [];
  }
}

export default async function FeedbackPage() {
  const feedbacks = await fetchFeedbacks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Feedback</h1>
        <p className="text-gray-500">
          Lihat ulasan dan penilaian dari pelanggan Ethereal Creative
        </p>
      </div>

      <FeedbackTable initialFeedbacks={feedbacks} />
    </div>
  );
}
