import FeedbackTable from "./FeedbackTable";
export const dynamic = "force-dynamic";

async function fetchFeedbacks() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/feedbacks`,
      {
        cache: "no-store", // Selalu ambil data baru
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
    <div>
      <div className="relative w-full h-48 mt-10 mx-auto max-w-[1171px]">
        <img
          src="/assetgambar/imageStore.webp"
          alt="Header"
          className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg"
        />
        <div className="absolute inset-0 bg-neutral-700/20 rounded-lg backdrop-blur-sm" />
        <h1 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white text-6xl font-poppins">
          FEEDBACK
        </h1>
      </div>

      <div className="mx-auto max-w-[1171px] mt-10 px-4 mb-10">
        <FeedbackTable initialFeedbacks={feedbacks} />
      </div>
    </div>
  );
}
