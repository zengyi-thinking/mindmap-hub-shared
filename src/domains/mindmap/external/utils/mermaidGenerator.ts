/**
 * Mermaid图表生成工具
 * 提供各种类型的Mermaid图表生成功能
 */

/**
 * 处理Mermaid特殊字符
 * @param text 原始文本
 * @returns 转义后的文本
 */
export const escapeMermaidText = (text: string): string => {
  if (!text) return '';
  
  // 转义Mermaid语法中的特殊字符
  return text
    .replace(/:/g, '&#58;')
    .replace(/\(/g, '&#40;')
    .replace(/\)/g, '&#41;')
    .replace(/\[/g, '&#91;')
    .replace(/\]/g, '&#93;')
    .replace(/"/g, '&quot;');
};

/**
 * 生成简单思维导图
 * @param root 根节点文本
 * @param items 一级子节点数组
 * @returns Mermaid思维导图定义
 */
export const generateSimpleMindMap = (
  root: string,
  items: string[]
): string => {
  let definition = `mindmap\n  root((${escapeMermaidText(root)}))\n`;
  
  items.forEach(item => {
    definition += `    ${escapeMermaidText(item)}\n`;
  });
  
  return definition;
};

/**
 * 生成分层思维导图
 * @param root 根节点文本
 * @param hierarchy 分层结构对象，键为父节点，值为子节点数组
 * @returns Mermaid思维导图定义
 */
export const generateHierarchicalMindMap = (
  root: string,
  hierarchy: Record<string, string[]>
): string => {
  let definition = `mindmap\n  root((${escapeMermaidText(root)}))\n`;
  
  // 递归生成层级
  const generateLevels = (parent: string, level: number) => {
    const indent = '  '.repeat(level + 1);
    const children = hierarchy[parent] || [];
    
    children.forEach(child => {
      definition += `${indent}${escapeMermaidText(child)}\n`;
      
      // 如果这个子节点还有自己的子节点，继续递归
      if (hierarchy[child]) {
        generateLevels(child, level + 1);
      }
    });
  };
  
  // 从根节点开始生成
  const rootChildren = hierarchy[root] || [];
  rootChildren.forEach(child => {
    definition += `    ${escapeMermaidText(child)}\n`;
    generateLevels(child, 2);
  });
  
  return definition;
};

/**
 * 从对象数组生成思维导图
 * @param root 根节点文本
 * @param items 对象数组
 * @param groupByField 分组字段
 * @param labelField 显示标签字段
 * @returns Mermaid思维导图定义
 */
export const generateGroupedMindMap = <T extends Record<string, any>>(
  root: string,
  items: T[],
  groupByField: keyof T,
  labelField: keyof T
): string => {
  // 按字段分组
  const groups: Record<string, T[]> = {};
  
  items.forEach(item => {
    const groupValue = String(item[groupByField] || '其他');
    if (!groups[groupValue]) {
      groups[groupValue] = [];
    }
    groups[groupValue].push(item);
  });
  
  // 生成思维导图
  let definition = `mindmap\n  root((${escapeMermaidText(root)}))\n`;
  
  Object.keys(groups).forEach(group => {
    const groupItems = groups[group];
    definition += `    ${escapeMermaidText(group)} (${groupItems.length})\n`;
    
    groupItems.forEach(item => {
      const label = String(item[labelField] || '未命名');
      definition += `      ${escapeMermaidText(label)}\n`;
    });
  });
  
  return definition;
};

/**
 * 根据分类生成思维导图
 * @param categories 分类数据结构
 * @returns Mermaid思维导图定义
 */
export const generateCategoryMindmap = (categories: any[]): string => {
  if (!categories || categories.length === 0) {
    return 'mindmap\n  root((资料分类))\n    暂无分类数据';
  }
  
  let definition = 'mindmap\n  root((资料分类))\n';
  
  // 递归生成分类树
  const generateCategoryTree = (cats: any[], level: number) => {
    const indent = '  '.repeat(level + 1);
    
    cats.forEach(category => {
      definition += `${indent}${escapeMermaidText(category.name)}\n`;
      
      if (category.children && category.children.length > 0) {
        generateCategoryTree(category.children, level + 1);
      }
    });
  };
  
  generateCategoryTree(categories, 1);
  return definition;
};

/**
 * 根据上传日期生成思维导图
 * @param materials 资料数组
 * @returns Mermaid思维导图定义
 */
export const generateDateMindmap = (materials: any[]): string => {
  if (!materials || materials.length === 0) {
    return 'mindmap\n  root((上传时间))\n    暂无时间数据';
  }
  
  // 按日期分组
  const dateGroups: Record<string, any[]> = {};
  
  materials.forEach(material => {
    // 提取日期部分
    const uploadDate = material.uploadTime 
      ? new Date(material.uploadTime).toISOString().split('T')[0] 
      : '未知日期';
    
    if (!dateGroups[uploadDate]) {
      dateGroups[uploadDate] = [];
    }
    
    dateGroups[uploadDate].push(material);
  });
  
  // 按日期排序
  const sortedDates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a));
  
  // 生成思维导图
  let definition = 'mindmap\n  root((上传时间))\n';
  
  sortedDates.forEach(date => {
    const count = dateGroups[date].length;
    definition += `    ${escapeMermaidText(date)} (${count})\n`;
    
    dateGroups[date].forEach(material => {
      definition += `      ${escapeMermaidText(material.title)}\n`;
    });
  });
  
  return definition;
};

/**
 * 根据文件类型生成思维导图
 * @param materials 资料数组
 * @returns Mermaid思维导图定义
 */
export const generateFileTypeMindmap = (materials: any[]): string => {
  if (!materials || materials.length === 0) {
    return 'mindmap\n  root((文件类型))\n    暂无类型数据';
  }
  
  // 按文件类型分组
  const typeGroups: Record<string, any[]> = {};
  
  materials.forEach(material => {
    // 获取文件类型
    let fileType = '未知类型';
    
    if (material.file && material.file.type) {
      // 从MIME类型中提取主类型
      const mimeType = material.file.type.split('/')[0];
      
      switch (mimeType) {
        case 'application':
          // 从文件名提取扩展名
          if (material.file.name) {
            const ext = material.file.name.split('.').pop()?.toLowerCase();
            if (ext === 'pdf') fileType = 'PDF文档';
            else if (['doc', 'docx'].includes(ext)) fileType = 'Word文档';
            else if (['xls', 'xlsx'].includes(ext)) fileType = 'Excel表格';
            else if (['ppt', 'pptx'].includes(ext)) fileType = 'PPT演示文稿';
            else fileType = '文档';
          } else {
            fileType = '文档';
          }
          break;
        case 'image': fileType = '图片'; break;
        case 'video': fileType = '视频'; break;
        case 'audio': fileType = '音频'; break;
        case 'text': fileType = '文本'; break;
        default: fileType = '其他';
      }
    }
    
    if (!typeGroups[fileType]) {
      typeGroups[fileType] = [];
    }
    
    typeGroups[fileType].push(material);
  });
  
  // 生成思维导图
  let definition = 'mindmap\n  root((文件类型))\n';
  
  Object.keys(typeGroups).forEach(type => {
    const count = typeGroups[type].length;
    definition += `    ${escapeMermaidText(type)} (${count})\n`;
    
    typeGroups[type].forEach(material => {
      definition += `      ${escapeMermaidText(material.title)}\n`;
    });
  });
  
  return definition;
}; 