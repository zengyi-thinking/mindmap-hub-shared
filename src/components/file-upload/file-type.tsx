
import React from 'react';
import { FileText, Image, Film, Music, Archive, FileCode, File } from 'lucide-react';

interface FileTypeProps {
  fileType: string;
  className?: string;
}

export const FileType: React.FC<FileTypeProps> = ({ fileType, className = "h-4 w-4" }) => {
  const getIcon = () => {
    if (!fileType) return <FileText className={className} />;
    
    if (fileType.includes('image/')) {
      return <Image className={className} />;
    } else if (fileType.includes('application/pdf')) {
      return <File className={className} />; // Changed from FilePdf to File
    } else if (fileType.includes('application/msword') || 
              fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml')) {
      return <FileText className={className} />;
    } else if (fileType.includes('application/vnd.ms-excel') || 
              fileType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml')) {
      return <FileText className={className} />; // Changed from FileSpreadsheet to FileText
    } else if (fileType.includes('text/html') || fileType.includes('application/javascript')) {
      return <FileCode className={className} />;
    } else if (fileType.includes('audio/')) {
      return <Music className={className} />;
    } else if (fileType.includes('video/')) {
      return <Film className={className} />;
    } else if (fileType.includes('application/zip') || fileType.includes('application/x-rar')) {
      return <Archive className={className} />;
    } else {
      return <FileText className={className} />;
    }
  };

  return getIcon();
};

export default FileType;
