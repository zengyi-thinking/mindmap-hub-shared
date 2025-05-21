/**
 * 桥接文件 - 从新的Clean Architecture导出MaterialNode组件
 * 这个文件作为桥接，将导入重定向到新的位置
 */

import React from 'react';

// 简单的MaterialNode组件，根据需要可以在Clean Architecture中实现更完整的版本
const MaterialNode = ({ data, onClick }: any) => {
  return (
    <div 
      className="p-3 bg-card border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick && onClick(data)}
    >
      <h3 className="font-medium text-sm">{data.title}</h3>
      {data.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{data.description}</p>
      )}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {data.tags.map((tag: string, index: number) => (
            <span 
              key={index}
              className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialNode; 