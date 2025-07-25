import { API_URL } from "../constants";

export function parseImageUrl(image: string | undefined | null): string {
  if (!image || typeof image !== "string") {
    return `${API_URL}/ImagesFiles/default.png`;
  }

  // Normalize path separators (handle both \ and /)
  const normalizedPath = image.replace(/\\/g, "/");
  const fileName = normalizedPath.split("/").pop();

  return `${API_URL}/ImagesFiles/${fileName}`;
}
