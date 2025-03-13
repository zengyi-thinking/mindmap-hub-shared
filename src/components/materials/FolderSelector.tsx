import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { userFilesService } from '@/lib/storage';
import { tagHierarchy } from '@/data/tagHierarchy';
import { FolderPath } from '@/types/materials';

interface FolderSelectorProps {
  selectedFolderPath: string[];
  onFolderPathChange: (folderPath: string[]) => void;
  disabled?: boolean;
}

const FolderSelector: React.FC<FolderSelectorProps> = ({
  selectedFolderPath,
  onFolderPathChange,
  disabled = false
}) => {
  const [availableFolders, setAvailableFolders] = useState<FolderPath[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [subFolders, setSubFolders] = useState<string[]>([]);

  // 从标签层次结构初始化可用文件夹
  useEffect(() => {
    // 将标签层次结构转换为文件夹路径
    const convertTagsToFolders = (tags: typeof tagHierarchy): FolderPath[] => {
      const folders: FolderPath[] = [];

      // 添加主类别
      tags.forEach(category => {
        folders.push({
          path: [category.name],
          name: category.name,
          fullPath: category.name
        });

        // 添加二级类别
        if (category.children) {
          category.children.forEach(subCategory => {
            const path = [category.name, subCategory.name];
            folders.push({
              path,
              name: subCategory.name,
              fullPath: path.join(' → ')
            });

            // 添加三级类别
            if (subCategory.children) {
              subCategory.children.forEach(leafCategory => {
                const path = [category.name, subCategory.name, leafCategory.name];
                folders.push({
                  path,
                  name: leafCategory.name,
                  fullPath: path.join(' → ')
                });
              });
            }
          });
        }
      });

      return folders;
    };

    setAvailableFolders(convertTagsToFolders(tagHierarchy));
  }, []);

  // 当当前路径改变时，获取子文件夹
  useEffect(() => {
    // 使用标签层次结构获取子文件夹
    const getSubFoldersFromTags = (path: string[]): string[] => {
      if (path.length === 0) {
        // 顶级文件夹
        return tagHierarchy.map(category => category.name);
      } else if (path.length === 1) {
        // 二级文件夹
        const category = tagHierarchy.find(c => c.name === path[0]);
        return category?.children?.map(sub => sub.name) || [];
      } else if (path.length === 2) {
        // 三级文件夹
        const category = tagHierarchy.find(c => c.name === path[0]);
        const subCategory = category?.children?.find(sub => sub.name === path[1]);
        return subCategory?.children?.map(leaf => leaf.name) || [];
      }
      return [];
    };

    setSubFolders(getSubFoldersFromTags(currentPath));
  }, [currentPath]);

  // 选择或导航到文件夹
  const selectFolder = (folder: string) => {
    const newPath = [...currentPath, folder];
    setCurrentPath(newPath);
    
    // 如果是叶子节点(三级文件夹)或者没有子文件夹，则选择该文件夹
    const potentialChildren = getChildrenFolders(newPath);
    if (newPath.length === 3 || potentialChildren.length === 0) {
      onFolderPathChange(newPath);
    }
  };

  // 导航到指定层级
  const navigateTo = (index: number) => {
    if (index < 0) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  // 获取指定路径的子文件夹
  const getChildrenFolders = (path: string[]): string[] => {
    if (path.length === 0) {
      // 顶级文件夹
      return tagHierarchy.map(category => category.name);
    } else if (path.length === 1) {
      // 二级文件夹
      const category = tagHierarchy.find(c => c.name === path[0]);
      return category?.children?.map(sub => sub.name) || [];
    } else if (path.length === 2) {
      // 三级文件夹
      const category = tagHierarchy.find(c => c.name === path[0]);
      const subCategory = category?.children?.find(sub => sub.name === path[1]);
      return subCategory?.children?.map(leaf => leaf.name) || [];
    }
    return [];
  };

  return (
    <div className="grid w-full gap-3">
      <Label className="mb-1">选择上传文件夹</Label>

      <div className={`border rounded-md p-4 space-y-4 ${disabled ? 'opacity-70' : ''}`}>
        {/* 面包屑导航 */}
        <div className="flex items-center flex-wrap gap-1 text-sm">
          <Badge 
            variant={currentPath.length === 0 ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => navigateTo(-1)}
          >
            <Folder className="h-3.5 w-3.5 mr-1" /> 
            根目录
          </Badge>
          
          {currentPath.map((folder, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <Badge
                variant={index === currentPath.length - 1 ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => navigateTo(index)}
              >
                {folder}
              </Badge>
            </React.Fragment>
          ))}
        </div>

        {/* 文件夹列表 */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            {currentPath.length === 0 
              ? "主分类" 
              : currentPath.length === 1 
                ? "子分类" 
                : "具体项目"}
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {subFolders.map(folder => (
              <div
                key={folder}
                className={`flex items-center gap-2 p-2 rounded-md border hover:bg-primary/5 cursor-pointer 
                  ${selectedFolderPath.join('') === [...currentPath, folder].join('') ? 'bg-primary/10 border-primary' : ''}
                  ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => !disabled && selectFolder(folder)}
              >
                <FolderOpen className="h-4 w-4 text-primary" />
                <span className="truncate text-sm">{folder}</span>
              </div>
            ))}
            
            {subFolders.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-4">
                没有更多子文件夹
              </div>
            )}
          </div>
        </div>

        {/* 当前选中的文件夹 */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">已选择上传位置</Label>
          <div className="flex items-center p-2 rounded-md bg-primary/5 border">
            {selectedFolderPath.length > 0 ? (
              <div className="flex items-center gap-1 text-sm">
                <FolderOpen className="h-4 w-4 text-primary" />
                <span>{selectedFolderPath.join(' → ')}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">尚未选择上传文件夹</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderSelector; 