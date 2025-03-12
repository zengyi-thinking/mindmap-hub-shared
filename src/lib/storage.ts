import { SharedMindMap, MindMapComment } from "@/types/mindmap";
// Don't import DiscussionTopic and DiscussionComment to avoid conflicts
// import { DiscussionTopic, DiscussionComment } from "@/types/discussion";

// Define User type
export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: "user" | "admin";
  avatar?: string; // Added avatar field
  name?: string;    // Added name field
  createdAt: string;
}

// Material interface
export interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  tags: string[];
  uploadedBy: number;
  uploaderName: string;
  uploadDate: string;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  starred: boolean;
}

// Define the discussion types locally to avoid import conflicts
export interface DiscussionTopic {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: number;
  tags: string[];
}

export interface DiscussionComment {
  id: number;
  topicId: number;
  content: string;
  author: string;
  authorId: number;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  parentId?: number;
}

// 初始化本地存储
export const initializeStorage = () => {
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage is not available in this environment');
    return;
  }

  if (!localStorage.getItem('mindmaps')) {
    localStorage.setItem('mindmaps', JSON.stringify([]));
  }

  if (!localStorage.getItem('sharedMindMaps')) {
    localStorage.setItem('sharedMindMaps', JSON.stringify([]));
  }

  if (!localStorage.getItem('mindmapComments')) {
    localStorage.setItem('mindmapComments', JSON.stringify([]));
  }

  if (!localStorage.getItem('users')) {
    const initialAdminUser = {
      id: 1,
      username: 'admin',
      password: 'password', // 实际应用中需要加密
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('users', JSON.stringify([initialAdminUser]));
  }

  if (!localStorage.getItem('materials')) {
    localStorage.setItem('materials', JSON.stringify([]));
  }

  if (!localStorage.getItem('discussionTopics')) {
    localStorage.setItem('discussionTopics', JSON.stringify([]));
  }

  if (!localStorage.getItem('discussionComments')) {
    localStorage.setItem('discussionComments', JSON.stringify([]));
  }
};
