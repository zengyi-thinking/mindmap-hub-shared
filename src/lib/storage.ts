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
  addFile: addFileToStorage,
  getFiles: getFilesFromStorage,
  updateFile: updateFileInStorage,
  deleteFile: deleteFileFromStorage,

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
