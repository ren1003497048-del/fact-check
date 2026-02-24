/**
 * Image utility functions
 * Safe parsing and validation for image data
 */

export interface ParsedBase64 {
  mimeType: string;
  base64: string;
}

/**
 * Safely parse a base64 data URL
 * @param dataUrl - The data URL string (e.g., "data:image/jpeg;base64,...")
 * @returns Parsed object with mimeType and base64 data, or null if invalid
 */
export function parseBase64DataUrl(dataUrl: string): ParsedBase64 | null {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return null;
  }

  try {
    // Use regex to extract mime type and base64 data
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

    if (!match || match.length < 3) {
      return null;
    }

    const mimeType = match[1];
    const base64 = match[2];

    // Validate that we have both parts
    if (!mimeType || !base64) {
      return null;
    }

    return { mimeType, base64 };
  } catch (error) {
    console.error('[parseBase64DataUrl] Failed to parse data URL:', error);
    return null;
  }
}

/**
 * Calculate estimated file size from base64 string
 * @param base64 - The base64 encoded string
 * @returns Estimated size in bytes
 */
export function estimateBase64Size(base64: string): number {
  return Math.floor((base64.length * 3) / 4);
}

/**
 * Resize an image file to fit within max width while maintaining aspect ratio
 * @param file - The image file to resize
 * @param maxWidth - Maximum width for the resized image (default from CONFIG)
 * @param quality - JPEG compression quality (default from CONFIG)
 * @returns Promise resolving to base64 data URL of resized image
 */
export function resizeImage(
  file: File,
  maxWidth: number = 800,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale down if width exceeds max
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        elem.width = width;
        elem.height = height;

        const ctx = elem.getContext('2d');
        if (!ctx) {
          // Fallback to original if canvas context fails
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG
        resolve(elem.toDataURL('image/jpeg', quality));
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

/**
 * Validate image file type and size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in megabytes
 * @returns Object with isValid flag and error message if invalid
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Please upload JPEG, PNG, WebP, or GIF images. / 文件类型无效，请上传 JPEG、PNG、WebP 或 GIF 图片。`
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB. / 文件过大，最大支持 ${maxSizeMB}MB。`
    };
  }

  return { isValid: true };
}
