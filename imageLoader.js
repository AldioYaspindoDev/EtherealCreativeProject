export default function customImageLoader({ src, width, quality }) {
  // For local development URLs, return as-is to bypass Next.js optimization
  // This prevents the "resolved to private ip" error
  if (
    src.includes("localhost") ||
    src.includes("127.0.0.1") ||
    src.includes("::1")
  ) {
    return src;
  }

  // For Cloudinary or other remote images, apply optimization
  if (src.includes("cloudinary.com")) {
    // Cloudinary has its own optimization parameters
    return src;
  }

  // For other images, use Next.js default optimization
  return `${src}?w=${width}&q=${quality || 75}`;
}
