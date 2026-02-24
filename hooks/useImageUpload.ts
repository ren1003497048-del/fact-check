/**
 * useImageUpload Hook
 * Manages image upload state, validation, and processing
 */

import { useState, useRef } from 'react';
import { resizeImage, validateImageFile } from '../utils/imageUtils';
import { CONFIG } from '../config/constants';

export interface ImageUploadState {
  selectedImage: File | null;
  imagePreview: string | null;
  error: string | null;
}

export interface ImageUploadActions {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: () => void;
  clearError: () => void;
}

/**
 * Hook for managing image upload with validation and processing
 */
export function useImageUpload() {
  const [state, setState] = useState<ImageUploadState>({
    selectedImage: null,
    imagePreview: null,
    error: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setState(prev => ({ ...prev, error: null }));

    // Validate file
    const validation = validateImageFile(file, CONFIG.IMAGE.MAX_SIZE_MB);
    if (!validation.isValid) {
      setState(prev => ({ ...prev, error: validation.error || 'Validation failed' }));
      return;
    }

    try {
      // Resize and optimize image
      const resizedDataUrl = await resizeImage(
        file,
        CONFIG.IMAGE.MAX_WIDTH,
        CONFIG.IMAGE.JPEG_QUALITY
      );

      setState({
        selectedImage: file,
        imagePreview: resizedDataUrl
      });
    } catch (err) {
      console.error('[useImageUpload] Image resize failed:', err);
      // Fallback to basic read
      const reader = new FileReader();
      reader.onloadend = () => {
        setState({
          selectedImage: file,
          imagePreview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setState({
      selectedImage: null,
      imagePreview: null,
      error: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
    clearError
  };
}
