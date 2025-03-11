
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
}

export interface TagCategory {
  id: string;
  name: string;
  children?: TagCategory[];
}
