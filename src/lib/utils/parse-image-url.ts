import { apiAsset } from "../demo/config";

export function parseImageUrl(image: string | undefined | null): string {
  if (!image || typeof image !== "string") {
    return apiAsset(null);
  }

  // Normalize path separators (handle both \ and /)
  const normalizedPath = image.replace(/\\/g, "/");
  if (normalizedPath.includes("/demo/")) {
    return apiAsset(normalizedPath);
  }

  const fileName = normalizedPath.split("/").pop();
  return apiAsset(`/ImagesFiles/${fileName}`);
}
