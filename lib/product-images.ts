export const IMAGE_BUCKET = "product-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 12;
export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!Object.hasOwn(IMAGE_TYPES, file.type)) return "Choose a JPG, PNG, WebP or AVIF image.";
  if (file.size === 0) return "This image is empty. Choose another file.";
  if (file.size > MAX_IMAGE_BYTES) return "Each image must be 5 MB or smaller.";
  return null;
}

// Match the image hosts configured in next.config.ts before rendering a preview.
export function parseProductImage(value: string, projectUrl: string) {
  const url = new URL(value.trim());
  if (url.protocol !== "https:" || url.username || url.password || url.port) {
    throw new Error("Use a secure image link from Sai Furniture storage or images.unsplash.com.");
  }
  const prefix = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  if (url.origin === new URL(projectUrl).origin && url.pathname.startsWith(prefix)) {
    const path = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!path || path.split("/").some((part) => !part || part === "." || part === "..")) {
      throw new Error("Invalid product image path.");
    }
    return { image_url: url.href, storage_path: path };
  }
  if (url.hostname === "images.unsplash.com" && url.pathname !== "/") {
    return { image_url: url.href, storage_path: null };
  }
  throw new Error("Upload the photo from your device, or use a Sai Furniture or Unsplash image link.");
}
