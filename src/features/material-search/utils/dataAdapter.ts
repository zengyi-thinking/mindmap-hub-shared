import { CategoryItem } from './mermaidGenerator';

/**
 * 将原有标签层次结构转换为适合Mermaid使用的格式
 * @param tagHierarchy 原始标签层次结构
 * @returns 转换后的分类数据
 */
export function convertTagsToMermaidFormat(tagHierarchy: any[]): CategoryItem[] {
  let counter = 0;
  
  const processTag = (tag: any): CategoryItem => {
    counter++;
    
    return {
      id: `tag-${counter}`,
      name: tag.name,
      count: tag.files?.length || 0,
      children: tag.children ? tag.children.map(processTag) : undefined
    };
  };
  
  return tagHierarchy.map(processTag);
}

/**
 * 按主题组织资料数据
 * @param materials 资料数组
 * @returns 主题分组数据
 */
export function organizeByThemes(materials: any[]): Record<string, string[]> {
  const themeGroups: Record<string, string[]> = {};
  
  // 提取所有的标签作为主题
  const allTags = new Set<string>();
  materials.forEach(material => {
    if (material.tags && Array.isArray(material.tags)) {
      material.tags.forEach((tag: string) => allTags.add(tag));
    }
  });
  
  // 初始化主题组
  Array.from(allTags).forEach(theme => {
    themeGroups[theme] = [];
  });
  
  // 按主题分组资料
  materials.forEach(material => {
    if (material.tags && Array.isArray(material.tags)) {
      material.tags.forEach((tag: string) => {
        if (themeGroups[tag]) {
          themeGroups[tag].push(material.title);
        }
      });
    }
  });
  
  // 过滤掉空的主题组或过大的主题组
  const filteredGroups: Record<string, string[]> = {};
  Object.entries(themeGroups).forEach(([theme, materials]) => {
    if (materials.length > 0 && materials.length <= 10) {
      filteredGroups[theme] = materials;
    }
  });
  
  return filteredGroups;
}

/**
 * 按上传者分组资料
 * @param materials 资料数组
 * @returns Mermaid思维导图定义
 */
export function generateUploaderMindMap(materials: any[]): string {
  // 按上传者分组
  const uploaderGroups: Record<string, string[]> = {};
  
  materials.forEach(material => {
    const uploader = material.uploadedByName || '未知用户';
    
    if (!uploaderGroups[uploader]) {
      uploaderGroups[uploader] = [];
    }
    
    uploaderGroups[uploader].push(material.title);
  });
  
  // 生成Mermaid定义
  let result = 'mindmap\n';
  result += '  root((资料上传者))\n';
  
  Object.entries(uploaderGroups).forEach(([uploader, titles]) => {
    result += `    ${uploader}\n`;
    
    // 最多显示每个上传者的前5个资料
    titles.slice(0, 5).forEach(title => {
      result += `      ${title}\n`;
    });
    
    // 如果有更多资料，显示一个摘要节点
    if (titles.length > 5) {
      result += `      ... 另外${titles.length - 5}个资料\n`;
    }
  });
  
  return result;
}

/**
 * 筛选相关资料并生成思维导图
 * @param materials 所有资料
 * @param searchQuery 搜索关键词
 * @returns Mermaid思维导图定义
 */
export function generateSearchResultsMindMap(materials: any[], searchQuery: string): string {
  if (!searchQuery) return '';
  
  // 搜索相关资料
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (material.tags && material.tags.some((tag: string) => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );
  
  if (filteredMaterials.length === 0) {
    return 'mindmap\n  root((搜索结果))\n    没有找到相关资料\n';
  }
  
  // 生成Mermaid定义
  let result = 'mindmap\n';
  result += `  root((搜索: ${searchQuery}))\n`;
  
  // 按标签分组结果
  const tagGroups: Record<string, string[]> = {};
  
  filteredMaterials.forEach(material => {
    if (material.tags && Array.isArray(material.tags)) {
      material.tags.forEach((tag: string) => {
        if (!tagGroups[tag]) {
          tagGroups[tag] = [];
        }
        tagGroups[tag].push(material.title);
      });
    } else {
      // 无标签的资料
      if (!tagGroups['未分类']) {
        tagGroups['未分类'] = [];
      }
      tagGroups['未分类'].push(material.title);
    }
  });
  
  // 生成标签分组
  Object.entries(tagGroups).forEach(([tag, titles]) => {
    result += `    ${tag}\n`;
    
    // 最多显示每个标签下的前3个资料
    titles.slice(0, 3).forEach(title => {
      result += `      ${title}\n`;
    });
    
    // 如果有更多资料，显示一个摘要节点
    if (titles.length > 3) {
      result += `      ... 另外${titles.length - 3}个资料\n`;
    }
  });
  
  return result;
}

export default {
  convertTagsToMermaidFormat,
  organizeByThemes,
  generateUploaderMindMap,
  generateSearchResultsMindMap
}; 