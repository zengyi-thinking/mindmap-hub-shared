import { message } from 'antd';

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

// 在实际项目中，这个函数应该调用后端API来处理文件上传
// 这里我们使用本地文件URL模拟
export const uploadFile = async (file: File): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建本地文件URL
      const fileUrl = URL.createObjectURL(file);
      
      // 生成唯一ID
      const fileId = `file-${Date.now()}`;
      
      resolve({
        id: fileId,
        name: file.name,
        type: file.type,
        url: fileUrl,
        size: file.size,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// 释放文件URL
export const releaseFileUrl = (url: string) => {
  URL.revokeObjectURL(url);
}; 