import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MaterialFolderNavigationProps {
  folderPaths: string[];
  title?: string;
  onFolderSelect?: (path: string) => void;
  className?: string;
}

interface FolderItem {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderItem[];
  isExpanded?: boolean;
}

const MaterialFolderNavigation: React.FC<MaterialFolderNavigationProps> = ({
  folderPaths,
  title = "相关文件夹",
  onFolderSelect,
  className
}) => {
  const [folderStructure, setFolderStructure] = useState<FolderItem[]>([]);
  const [activePath, setActivePath] = useState<string | null>(null);

  // 模拟文件夹结构数据（实际应用中这将从API获取）
  useEffect(() => {
    if (folderPaths && folderPaths.length > 0) {
      // 处理文件路径，构建文件夹结构
      const structure: FolderItem[] = [];

      // 示例：将路径转换为嵌套结构
      folderPaths.forEach(path => {
        const segments = path.split('/').filter(Boolean);
        
        // 跳过空路径
        if (segments.length === 0) return;

        let currentLevel = structure;
        let currentPath = '';

        segments.forEach((segment, index) => {
          currentPath += '/' + segment;
          const isLastSegment = index === segments.length - 1;
          const type = isLastSegment ? 'file' : 'folder';
          
          // 检查当前级别是否已存在此文件夹/文件
          const existing = currentLevel.find(item => item.name === segment);
          
          if (existing) {
            // 已存在，继续使用
            if (existing.children && !isLastSegment) {
              currentLevel = existing.children;
            }
          } else {
            // 创建新的文件夹/文件项
            const newItem: FolderItem = {
              name: segment,
              path: currentPath,
              type,
              isExpanded: false
            };
            
            if (!isLastSegment) {
              newItem.children = [];
              newItem.isExpanded = true; // 展开路径中的文件夹
            }
            
            currentLevel.push(newItem);
            
            if (!isLastSegment && newItem.children) {
              currentLevel = newItem.children;
            }
          }
        });
      });
      
      // 更新文件夹结构状态
      setFolderStructure(structure);
      
      // 如果有路径，设置第一个为活跃路径
      if (folderPaths.length > 0) {
        setActivePath(folderPaths[0]);
      }
    }
  }, [folderPaths]);

  // 切换文件夹展开/折叠状态
  const toggleFolder = (folder: FolderItem) => {
    const updateStructure = (items: FolderItem[]): FolderItem[] => {
      return items.map(item => {
        if (item.path === folder.path) {
          return { ...item, isExpanded: !item.isExpanded };
        } else if (item.children) {
          return { ...item, children: updateStructure(item.children) };
        }
        return item;
      });
    };
    
    setFolderStructure(updateStructure(folderStructure));
  };

  // 选择文件夹或文件
  const handleSelect = (item: FolderItem) => {
    setActivePath(item.path);
    
    if (onFolderSelect) {
      onFolderSelect(item.path);
    }
    
    if (item.type === 'folder' && item.children) {
      toggleFolder(item);
    }
  };

  // 递归渲染文件夹结构
  const renderFolderItems = (items: FolderItem[], depth = 0) => {
    return items.map((item) => (
      <div key={item.path} className="select-none">
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer",
            "hover:bg-muted/60 transition-colors duration-200",
            activePath === item.path && "bg-muted text-primary font-medium",
          )}
          style={{ paddingLeft: `${(depth + 1) * 12}px` }}
          onClick={() => handleSelect(item)}
        >
          {item.type === 'folder' && item.children && (
            <button className="mr-1 p-0.5">
              {item.isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          )}
          
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 mr-1.5 text-blue-500" />
          ) : (
            <File className="h-4 w-4 mr-1.5 text-gray-500" />
          )}
          
          <span className="truncate">{item.name}</span>
        </div>
        
        {item.type === 'folder' && item.children && item.isExpanded && (
          <div className="pl-2 border-l border-gray-200 dark:border-gray-700 ml-4">
            {renderFolderItems(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (!folderPaths || folderPaths.length === 0) {
    return (
      <div className={cn("border rounded-lg p-4 bg-card", className)}>
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">未找到相关文件夹</p>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg p-4 bg-card", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{title}</h3>
        {activePath && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <a href={`/materials?path=${encodeURIComponent(activePath)}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              打开
            </a>
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-0.5">
          {renderFolderItems(folderStructure)}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MaterialFolderNavigation; 