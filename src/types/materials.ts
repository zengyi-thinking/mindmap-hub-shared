
export interface Material {
  id: number;
  title: string;
  description: string;
  uploadTime: string;
  uploader: string;
  tags: string[];
  downloads: number;
  likes: number;
  favorites: number;
  fileType?: string;
  fileSize?: number;
  previewUrl?: string;
}

export interface TagCategory {
  id: string;
  name: string;
  children?: TagCategory[];
}

export interface FileUploadResponse {
  success: boolean;
  fileId?: string;
  message?: string;
}
