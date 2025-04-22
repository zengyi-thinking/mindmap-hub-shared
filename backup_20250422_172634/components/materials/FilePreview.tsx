import React from 'react';
import { FileX } from 'lucide-react';

interface FilePreviewProps {
  file: {
    name: string;
    type: string;
    dataUrl: string;
  };
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  if (!file || !file.dataUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-muted/30 rounded-lg">
        <FileX className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">文件内容不可用</p>
      </div>
    );
  }

  // 根据文件类型选择不同的预览组件
  const getPreviewComponent = () => {
    const fileType = file.type.toLowerCase();
    
    // 图片预览 (jpg, jpeg, png, gif, webp, svg)
    if (/^image\/(jpeg|jpg|png|gif|webp|svg)/.test(fileType)) {
      return (
        <div className="flex items-center justify-center">
          <img 
            src={file.dataUrl} 
            alt={file.name} 
            className="max-w-full max-h-[600px] object-contain rounded-lg" 
          />
        </div>
      );
    }
    
    // PDF预览
    if (fileType === 'application/pdf') {
      return (
        <div className="w-full h-[700px]">
          <object
            data={file.dataUrl}
            type="application/pdf"
            width="100%"
            height="100%"
            className="rounded-lg border"
          >
            <p>您的浏览器不支持直接预览PDF文件。请 <a href={file.dataUrl} download={file.name}>下载</a> 后查看。</p>
          </object>
        </div>
      );
    }
    
    // 文本文件预览
    if (/^text\//.test(fileType) || fileType === 'application/json') {
      return (
        <div className="w-full h-[500px] overflow-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <pre className="whitespace-pre-wrap break-all text-sm">
            {/* 对于文本文件，我们需要获取文本内容 */}
            {extractTextFromDataUrl(file.dataUrl, fileType)}
          </pre>
        </div>
      );
    }
    
    // 音频预览
    if (/^audio\//.test(fileType)) {
      return (
        <div className="flex justify-center my-8">
          <audio controls src={file.dataUrl} className="w-full max-w-md">
            您的浏览器不支持音频播放。请 <a href={file.dataUrl} download={file.name}>下载</a> 后播放。
          </audio>
        </div>
      );
    }
    
    // 视频预览
    if (/^video\//.test(fileType)) {
      return (
        <div className="flex justify-center my-4">
          <video 
            controls 
            src={file.dataUrl} 
            className="max-w-full max-h-[500px] rounded-lg"
          >
            您的浏览器不支持视频播放。请 <a href={file.dataUrl} download={file.name}>下载</a> 后播放。
          </video>
        </div>
      );
    }
    
    // 默认情况：无法预览
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-muted/20 rounded-lg">
        <div className="p-6 bg-muted/30 rounded-full mb-4">
          <FileX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">无法预览此文件</h3>
        <p className="text-muted-foreground text-center mb-4">
          该文件类型（{file.type || '未知类型'}）暂不支持在线预览。
        </p>
        <p className="text-sm">
          请 <a href={file.dataUrl} download={file.name} className="text-primary hover:underline">下载文件</a> 后使用合适的应用程序打开
        </p>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {getPreviewComponent()}
    </div>
  );
};

// 辅助函数：从Data URL中提取文本内容
const extractTextFromDataUrl = (dataUrl: string, fileType: string) => {
  try {
    // 如果是base64编码的文本
    if (dataUrl.includes('base64')) {
      const base64Content = dataUrl.split(',')[1];
      const decodedContent = atob(base64Content);
      return decodedContent;
    }
    
    // 如果是直接的文本数据
    const textContent = dataUrl.split(',')[1];
    return decodeURIComponent(textContent);
  } catch (error) {
    console.error('提取文本内容失败:', error);
    return '无法解析文件内容';
  }
};

export default FilePreview; 