
import { supabase } from '@/integrations/supabase/client';
import { ToastFunction, uploadFileToStorage, deleteFileFromStorage as genericDeleteFileFromStorage } from './fileStorageService';

const MANUALS_BUCKET = 'manuals_images';

export const uploadManualFile = async (file: File, toast: ToastFunction): Promise<string | null> => {
  // The generic uploadFileToStorage already creates a unique filename with Date.now() and returns the public URL.
  return uploadFileToStorage(file, MANUALS_BUCKET, toast);
};

export const deleteManualFile = async (fileUrl: string | null | undefined, toast: ToastFunction): Promise<void> => {
  // The generic deleteFileFromStorage handles parsing the URL and deleting from the specified bucket.
  return genericDeleteFileFromStorage(fileUrl, MANUALS_BUCKET, toast);
};
