export interface Material {
  id: number | string;
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
  fileName?: string;
  fileUrl?: string;
  previewUrl?: string;
  comments?: Comment[];
  viewCount?: number;
  userId?: number | string;
  status?: string;
  folderPath?: string[];
  file?: {
    name: string;
    type: string;
    size: number;
    dataUrl?: string;
  };
  favoriteTime?: string;
  favoriteNote?: string;
  favoriteByUsers?: FavoriteRecord[];
}

export interface Comment {
  id: number | string;
  materialId?: number | string;
  parentId?: number | string;
  userId: number | string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
  createdAt?: string;
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

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  bio?: string;
  uploadCount: number;
  downloadCount: number;
  favoriteCount: number;
}

export interface FolderPath {
  path: string[];
  name: string;
  fullPath: string;
}

export interface FavoriteRecord {
  userId: number | string;
  username: string;
  favoriteTime: string;
  favoriteNote?: string;
}
