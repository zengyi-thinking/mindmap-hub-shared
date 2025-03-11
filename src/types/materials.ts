
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
  comments?: Comment[];
  viewCount?: number;
}

export interface Comment {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
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
