
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

// User files service
export const userFilesService = {
  add: (fileData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const newFile = {
      id: Date.now(),
      ...fileData,
      views: 0,
      downloads: 0,
      approved: fileData.approved || false,
    };
    
    files.push(newFile);
    localStorage.setItem('userFiles', JSON.stringify(files));
    
    return newFile;
  },
  
  getAll: () => {
    if (typeof localStorage === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('userFiles') || '[]');
  },
  
  getApprovedFiles: () => {
    if (typeof localStorage === 'undefined') return [];
    
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    return files.filter(file => file.approved);
  },
  
  getById: (id) => {
    if (typeof localStorage === 'undefined') return null;
    
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    return files.find(file => file.id === id) || null;
  },
  
  update: (id, updateData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const index = files.findIndex(file => file.id === id);
    
    if (index === -1) return null;
    
    files[index] = { ...files[index], ...updateData };
    localStorage.setItem('userFiles', JSON.stringify(files));
    
    return files[index];
  },
  
  delete: (id) => {
    if (typeof localStorage === 'undefined') return false;
    
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const index = files.findIndex(file => file.id === id);
    
    if (index === -1) return false;
    
    files.splice(index, 1);
    localStorage.setItem('userFiles', JSON.stringify(files));
    
    return true;
  },
  
  incrementViews: (id) => {
    if (typeof localStorage === 'undefined') return null;
    
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const index = files.findIndex(file => file.id === id);
    
    if (index === -1) return null;
    
    files[index].views = (files[index].views || 0) + 1;
    localStorage.setItem('userFiles', JSON.stringify(files));
    
    return files[index];
  },
  
  incrementDownloads: (id) => {
    if (typeof localStorage === 'undefined') return null;
    
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const index = files.findIndex(file => file.id === id);
    
    if (index === -1) return null;
    
    files[index].downloads = (files[index].downloads || 0) + 1;
    localStorage.setItem('userFiles', JSON.stringify(files));
    
    return files[index];
  },
};

// Materials service
export const materialsService = {
  add: (materialData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const newMaterial = {
      id: Date.now(),
      ...materialData,
      downloads: 0,
      likes: 0,
      favorites: 0,
    };
    
    materials.push(newMaterial);
    localStorage.setItem('materials', JSON.stringify(materials));
    
    return newMaterial;
  },
  
  getAll: () => {
    if (typeof localStorage === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('materials') || '[]');
  },
  
  getById: (id) => {
    if (typeof localStorage === 'undefined') return null;
    
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    return materials.find(material => material.id === id) || null;
  },
  
  update: (id, updateData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const index = materials.findIndex(material => material.id === id);
    
    if (index === -1) return null;
    
    materials[index] = { ...materials[index], ...updateData };
    localStorage.setItem('materials', JSON.stringify(materials));
    
    return materials[index];
  },
  
  delete: (id) => {
    if (typeof localStorage === 'undefined') return false;
    
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const index = materials.findIndex(material => material.id === id);
    
    if (index === -1) return false;
    
    materials.splice(index, 1);
    localStorage.setItem('materials', JSON.stringify(materials));
    
    return true;
  },
};

// Topics service
export const topicsService = {
  add: (topicData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const topics = JSON.parse(localStorage.getItem('discussionTopics') || '[]');
    const newTopic = {
      id: Date.now(),
      ...topicData,
      views: topicData.views || 0,
      likes: topicData.likes || 0,
    };
    
    topics.push(newTopic);
    localStorage.setItem('discussionTopics', JSON.stringify(topics));
    
    return newTopic;
  },
  
  getAll: () => {
    if (typeof localStorage === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('discussionTopics') || '[]');
  },
  
  getById: (id) => {
    if (typeof localStorage === 'undefined') return null;
    
    const topics = JSON.parse(localStorage.getItem('discussionTopics') || '[]');
    return topics.find(topic => topic.id === id) || null;
  },
  
  update: (id, updateData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const topics = JSON.parse(localStorage.getItem('discussionTopics') || '[]');
    const index = topics.findIndex(topic => topic.id === id);
    
    if (index === -1) return null;
    
    topics[index] = { ...topics[index], ...updateData };
    localStorage.setItem('discussionTopics', JSON.stringify(topics));
    
    return topics[index];
  },
  
  delete: (id) => {
    if (typeof localStorage === 'undefined') return false;
    
    const topics = JSON.parse(localStorage.getItem('discussionTopics') || '[]');
    const index = topics.findIndex(topic => topic.id === id);
    
    if (index === -1) return false;
    
    topics.splice(index, 1);
    localStorage.setItem('discussionTopics', JSON.stringify(topics));
    
    return true;
  },
};

// Comments service
export const commentsService = {
  add: (commentData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const comments = JSON.parse(localStorage.getItem('discussionComments') || '[]');
    const newComment = {
      id: Date.now(),
      ...commentData,
      likes: commentData.likes || 0,
    };
    
    comments.push(newComment);
    localStorage.setItem('discussionComments', JSON.stringify(comments));
    
    return newComment;
  },
  
  getAll: () => {
    if (typeof localStorage === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('discussionComments') || '[]');
  },
  
  getByTopicId: (topicId) => {
    if (typeof localStorage === 'undefined') return [];
    
    const comments = JSON.parse(localStorage.getItem('discussionComments') || '[]');
    return comments.filter(comment => comment.topicId === topicId);
  },
  
  update: (id, updateData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const comments = JSON.parse(localStorage.getItem('discussionComments') || '[]');
    const index = comments.findIndex(comment => comment.id === id);
    
    if (index === -1) return null;
    
    comments[index] = { ...comments[index], ...updateData };
    localStorage.setItem('discussionComments', JSON.stringify(comments));
    
    return comments[index];
  },
  
  delete: (id) => {
    if (typeof localStorage === 'undefined') return false;
    
    const comments = JSON.parse(localStorage.getItem('discussionComments') || '[]');
    const index = comments.findIndex(comment => comment.id === id);
    
    if (index === -1) return false;
    
    comments.splice(index, 1);
    localStorage.setItem('discussionComments', JSON.stringify(comments));
    
    return true;
  },
};

// Mind Maps service
export const mindMapsService = {
  add: (mindMapData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const mindMaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    const newMindMap = {
      id: mindMapData.id || Date.now(),
      ...mindMapData,
    };
    
    mindMaps.push(newMindMap);
    localStorage.setItem('mindmaps', JSON.stringify(mindMaps));
    
    return newMindMap;
  },
  
  getAll: () => {
    if (typeof localStorage === 'undefined') return [];
    
    return JSON.parse(localStorage.getItem('mindmaps') || '[]');
  },
  
  getById: (id) => {
    if (typeof localStorage === 'undefined') return null;
    
    const mindMaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    return mindMaps.find(map => map.id === id) || null;
  },
  
  update: (id, updateData) => {
    if (typeof localStorage === 'undefined') return null;
    
    const mindMaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    const index = mindMaps.findIndex(map => map.id === id);
    
    if (index === -1) return null;
    
    mindMaps[index] = { ...mindMaps[index], ...updateData };
    localStorage.setItem('mindmaps', JSON.stringify(mindMaps));
    
    return mindMaps[index];
  },
  
  delete: (id) => {
    if (typeof localStorage === 'undefined') return false;
    
    const mindMaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    const index = mindMaps.findIndex(map => map.id === id);
    
    if (index === -1) return false;
    
    mindMaps.splice(index, 1);
    localStorage.setItem('mindmaps', JSON.stringify(mindMaps));
    
    return true;
  },
};
