// src/lib/storage.ts

import { v4 as uuidv4 } from 'uuid';

// Define the type for a file object
export interface File {
  id: string | number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  tags: string[];
  isFavorite: boolean;
  favoriteInfo: {
    timestamp: string;
    path: string[];
    note: string;
  } | null;
}

// Initialize local storage
export const initializeStorage = () => {
  if (!localStorage.getItem('userFiles')) {
    localStorage.setItem('userFiles', JSON.stringify([]));
  }
};

// Add a new file to local storage
export const addFileToStorage = (file: Omit<File, 'id' | 'uploadDate' | 'isFavorite' | 'favoriteInfo'>) => {
  const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
  const newFile = {
    id: uuidv4(),
    uploadDate: new Date().toISOString(),
    isFavorite: false,
    favoriteInfo: null,
    ...file,
  };
  files.push(newFile);
  localStorage.setItem('userFiles', JSON.stringify(files));
  return newFile;
};

// Get all files from local storage
export const getFilesFromStorage = () => {
  return JSON.parse(localStorage.getItem('userFiles') || '[]');
};

// Update a file in local storage
export const updateFileInStorage = (id: string | number, updatedFile: Partial<File>) => {
  const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
  const updatedFiles = files.map(file => {
    if (file.id === id) {
      return { ...file, ...updatedFile };
    }
    return file;
  });
  localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
  return true;
};

// Delete a file from local storage
export const deleteFileFromStorage = (id: string | number) => {
  const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
  const updatedFiles = files.filter(file => file.id !== id);
  localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
  return true;
};

// Add the following methods to the userFilesService
export const userFilesService = {
  // Existing methods
  addFile: addFileToStorage,
  getFiles: getFilesFromStorage,
  updateFile: updateFileInStorage,
  deleteFile: deleteFileFromStorage,
  
  // Methods needed for various components
  getAll: getFilesFromStorage,
  getById: (id: string | number) => {
    const files = getFilesFromStorage();
    return files.find(file => file.id === id);
  },
  add: (fileData: any) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const newFile = {
      id: uuidv4(),
      uploadDate: new Date().toISOString(),
      isFavorite: false,
      favoriteInfo: null,
      ...fileData,
    };
    files.push(newFile);
    localStorage.setItem('userFiles', JSON.stringify(files));
    return newFile;
  },
  update: (id: string | number, updateData: any) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    let updatedFile = null;
    const updatedFiles = files.map(file => {
      if (file.id === id) {
        updatedFile = { ...file, ...updateData };
        return updatedFile;
      }
      return file;
    });
    localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
    return updatedFile;
  },
  delete: (id: string | number) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const updatedFiles = files.filter(file => file.id !== id);
    localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
    return true;
  },
  
  // Add getRecentFiles method
  getRecentFiles: (limit = 10) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    // Sort by upload date descending
    return files
      .sort((a, b) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime())
      .slice(0, limit);
  },

  // Add getFavoriteFiles method
  getFavoriteFiles: () => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    return files.filter(file => file.isFavorite);
  },

  // Add removeFavoriteFile method
  removeFavoriteFile: (id) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const updatedFiles = files.map(file => {
      if (file.id === id) {
        return { ...file, isFavorite: false, favoriteInfo: null };
      }
      return file;
    });
    localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
    return true;
  },

  // Add toggleFavorite method
  toggleFavorite: (id, favoriteInfo = {}) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const updatedFiles = files.map(file => {
      if (file.id === id) {
        const isFavorite = !file.isFavorite;
        return { 
          ...file, 
          isFavorite,
          favoriteInfo: isFavorite ? {
            timestamp: new Date().toISOString(),
            ...favoriteInfo
          } : null
        };
      }
      return file;
    });
    localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
    return true;
  },
  
  // Add methods for tracking views and downloads
  incrementViews: (id) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    let updatedFile = null;
    const updatedFiles = files.map(file => {
      if (file.id === id) {
        const viewCount = (file.viewCount || 0) + 1;
        updatedFile = { ...file, viewCount };
        return updatedFile;
      }
      return file;
    });
    localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
    return updatedFile;
  },
  
  incrementDownloads: (id) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    let updatedFile = null;
    const updatedFiles = files.map(file => {
      if (file.id === id) {
        const downloadCount = (file.downloadCount || 0) + 1;
        updatedFile = { ...file, downloadCount };
        return updatedFile;
      }
      return file;
    });
    localStorage.setItem('userFiles', JSON.stringify(updatedFiles));
    return updatedFile;
  },
  
  // Methods for approved files and folder management
  getApprovedFiles: () => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    return files.filter(file => file.approved);
  },
  
  getSubFolders: (folderPath) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    const subFolders = new Set();
    
    files.forEach(file => {
      if (file.folderPath && Array.isArray(file.folderPath)) {
        // Check if this file is in a subfolder of the current path
        if (folderPath.length === 0 && file.folderPath.length > 0) {
          // If at root, get first-level folders
          subFolders.add(file.folderPath[0]);
        } else if (
          file.folderPath.length > folderPath.length &&
          folderPath.every((folder, i) => folder === file.folderPath[i])
        ) {
          // This file is in a subfolder of the current path
          subFolders.add(file.folderPath[folderPath.length]);
        }
      }
    });
    
    return Array.from(subFolders);
  },
  
  getByDirectFolder: (folderPath) => {
    const files = JSON.parse(localStorage.getItem('userFiles') || '[]');
    return files.filter(file => {
      if (!file.folderPath || !Array.isArray(file.folderPath)) return false;
      return (
        file.folderPath.length === folderPath.length &&
        file.folderPath.every((folder, i) => folder === folderPath[i])
      );
    });
  }
};

// MindMap Storage
export const initializeMindMapStorage = () => {
  if (!localStorage.getItem('mindMaps')) {
    localStorage.setItem('mindMaps', JSON.stringify([]));
  }
};

// Add a new mind map to local storage
export const addMindMapToStorage = (mindMap) => {
  const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
  const newMindMap = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...mindMap,
  };
  mindMaps.push(newMindMap);
  localStorage.setItem('mindMaps', JSON.stringify(mindMaps));
  return newMindMap;
};

// Get all mind maps from local storage
export const getMindMapsFromStorage = () => {
  return JSON.parse(localStorage.getItem('mindMaps') || '[]');
};

// Get a mind map by ID from local storage
export const getMindMapByIdFromStorage = (id) => {
  const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
  return mindMaps.find(mindMap => mindMap.id === id);
};

// Update a mind map in local storage
export const updateMindMapInStorage = (id, updatedMindMap) => {
  const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
  const updatedMindMaps = mindMaps.map(mindMap => {
    if (mindMap.id === id) {
      return { ...mindMap, ...updatedMindMap };
    }
    return mindMap;
  });
  localStorage.setItem('mindMaps', JSON.stringify(updatedMindMaps));
  return true;
};

// Delete a mind map from local storage
export const deleteMindMapFromStorage = (id) => {
  const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
  const updatedMindMaps = mindMaps.filter(mindMap => mindMap.id !== id);
  localStorage.setItem('mindMaps', JSON.stringify(updatedMindMaps));
  return true;
};

export const mindMapStorage = {
  saveMindMap: (mindMap) => {
    const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
    
    // Check if the mind map already exists
    const existingIndex = mindMaps.findIndex(map => map.id === mindMap.id);
    
    if (existingIndex !== -1) {
      // Update existing mind map
      mindMaps[existingIndex] = mindMap;
    } else {
      // Add new mind map
      mindMaps.push(mindMap);
    }
    
    localStorage.setItem('mindMaps', JSON.stringify(mindMaps));
  },
  getMindMapById: (id) => {
    const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
    return mindMaps.find(map => map.id === id);
  },
  deleteMindMap: (id) => {
    const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
    const updatedMindMaps = mindMaps.filter(mindMap => mindMap.id !== id);
    localStorage.setItem('mindMaps', JSON.stringify(updatedMindMaps));
    return true;
  },
};

// Add the missing mindMapsService
export const mindMapsService = {
  add: (mindMapData) => {
    const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
    const newMindMap = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...mindMapData,
    };
    mindMaps.push(newMindMap);
    localStorage.setItem('mindMaps', JSON.stringify(mindMaps));
    return newMindMap;
  },
  getAll: () => {
    return JSON.parse(localStorage.getItem('mindMaps') || '[]');
  },
  getById: (id) => {
    const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
    return mindMaps.find(mindMap => mindMap.id === id);
  },
  update: (id, updateData) => {
    const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
    let updatedMindMap = null;
    const updatedMindMaps = mindMaps.map(mindMap => {
      if (mindMap.id === id) {
        updatedMindMap = { ...mindMap, ...updateData };
        return updatedMindMap;
      }
      return mindMap;
    });
    localStorage.setItem('mindMaps', JSON.stringify(updatedMindMaps));
    return updatedMindMap;
  },
  delete: (id) => {
    const mindMaps = JSON.parse(localStorage.getItem('mindMaps') || '[]');
    const updatedMindMaps = mindMaps.filter(mindMap => mindMap.id !== id);
    localStorage.setItem('mindMaps', JSON.stringify(updatedMindMaps));
    return true;
  }
};

// Add the missing commentsService
export const commentsService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem('comments') || '[]');
  },
  getForMaterial: (materialId) => {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    return comments.filter(comment => comment.materialId === materialId);
  },
  add: (commentData) => {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const newComment = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      likes: 0,
      ...commentData,
    };
    comments.push(newComment);
    localStorage.setItem('comments', JSON.stringify(comments));
    return newComment;
  },
  update: (id, updateData) => {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    let updatedComment = null;
    const updatedComments = comments.map(comment => {
      if (comment.id === id) {
        updatedComment = { ...comment, ...updateData };
        return updatedComment;
      }
      return comment;
    });
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    return updatedComment;
  },
  delete: (id) => {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const updatedComments = comments.filter(comment => comment.id !== id);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    return true;
  }
};

// Add the missing materialsService
export const materialsService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem('materials') || '[]');
  },
  getById: (id) => {
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    return materials.find(material => material.id === id);
  },
  add: (materialData) => {
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const newMaterial = {
      id: uuidv4(),
      uploadTime: new Date().toISOString(),
      downloads: 0,
      likes: 0,
      favorites: 0,
      ...materialData,
    };
    materials.push(newMaterial);
    localStorage.setItem('materials', JSON.stringify(materials));
    return newMaterial;
  },
  update: (id, updateData) => {
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    let updatedMaterial = null;
    const updatedMaterials = materials.map(material => {
      if (material.id === id) {
        updatedMaterial = { ...material, ...updateData };
        return updatedMaterial;
      }
      return material;
    });
    localStorage.setItem('materials', JSON.stringify(updatedMaterials));
    return updatedMaterial;
  },
  delete: (id) => {
    const materials = JSON.parse(localStorage.getItem('materials') || '[]');
    const updatedMaterials = materials.filter(material => material.id !== id);
    localStorage.setItem('materials', JSON.stringify(updatedMaterials));
    return true;
  }
};

// Add the missing topicsService
export const topicsService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem('topics') || '[]');
  },
  getById: (id) => {
    const topics = JSON.parse(localStorage.getItem('topics') || '[]');
    return topics.find(topic => topic.id === id);
  },
  add: (topicData) => {
    const topics = JSON.parse(localStorage.getItem('topics') || '[]');
    const newTopic = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      views: 0,
      replies: 0,
      ...topicData,
    };
    topics.push(newTopic);
    localStorage.setItem('topics', JSON.stringify(topics));
    return newTopic;
  },
  update: (id, updateData) => {
    const topics = JSON.parse(localStorage.getItem('topics') || '[]');
    let updatedTopic = null;
    const updatedTopics = topics.map(topic => {
      if (topic.id === id) {
        updatedTopic = { ...topic, ...updateData };
        return updatedTopic;
      }
      return topic;
    });
    localStorage.setItem('topics', JSON.stringify(updatedTopics));
    return updatedTopic;
  },
  delete: (id) => {
    const topics = JSON.parse(localStorage.getItem('topics') || '[]');
    const updatedTopics = topics.filter(topic => topic.id !== id);
    localStorage.setItem('topics', JSON.stringify(updatedTopics));
    return true;
  }
};
