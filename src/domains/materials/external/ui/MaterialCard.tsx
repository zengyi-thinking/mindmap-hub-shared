import React from 'react';
import { Material } from '../../entities/Material';

interface MaterialCardProps {
  material: Material;
  onClick?: () => void;
}

/**
 * 材料卡片组件
 * 展示单个材料的信息卡片
 */
export const MaterialCard: React.FC<MaterialCardProps> = ({ material, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {material.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
        {material.description}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {material.tags.map((tag) => (
          <span 
            key={tag}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-100"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>
          {new Date(material.updatedAt).toLocaleDateString()}
        </span>
        {material.isPublic ? (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            公开
          </span>
        ) : (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
            </svg>
            私密
          </span>
        )}
      </div>
    </div>
  );
}; 