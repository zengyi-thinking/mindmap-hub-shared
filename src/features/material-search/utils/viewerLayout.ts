import { Node, Edge, ConnectionLineType, MarkerType } from '@xyflow/react';
import { TagCategory } from '@/modules/materials/types/materials';

export interface CircularLayoutOptions {
  centerX: number;
  centerY: number;
  radius: number;
  startAngle?: number;
  endAngle?: number;
  childRadiusRatio?: number;
  levelSeparation?: number;
}

/**
 * 生成一个圆形布局的思维导图
 * @param categories 分类数组
 * @param options 布局选项
 */
export function generateCircularLayout(
  categories: TagCategory[],
  options: CircularLayoutOptions
): { nodes: Node[], edges: Edge[] } {
  const {
    centerX,
    centerY,
    radius,
    startAngle = 0,
    endAngle = 2 * Math.PI,
    childRadiusRatio = 0.5,
    levelSeparation = 100
  } = options;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 创建中心节点
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'materialViewerNode',
    position: { x: centerX, y: centerY },
    data: { label: '全部资料', count: categories.reduce((sum, cat) => sum + cat.count, 0) }
  });

  // 计算每个分类之间的角度间隔
  const angleStep = (endAngle - startAngle) / categories.length;

  // 为每个分类创建节点和边
  categories.forEach((category, index) => {
    const angle = startAngle + index * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // 创建主分类节点
    nodes.push({
      id: category.id,
      type: 'materialViewerNode',
      position: { x, y },
      data: { label: category.name, count: category.count }
    });

    // 连接根节点和主分类节点
    edges.push({
      id: `${rootId}-${category.id}`,
      source: rootId,
      target: category.id,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#ff5555', strokeWidth: 2, opacity: 0.8 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#ff5555',
        width: 15,
        height: 15
      }
    });

    // 如果有子分类，为它们创建节点和边
    if (category.children && category.children.length > 0) {
      const childAngleStep = angleStep * 0.8 / category.children.length;
      const childStartAngle = angle - (angleStep * 0.4);
      const childRadius = childRadiusRatio * radius;

      category.children.forEach((child, childIndex) => {
        const childAngle = childStartAngle + childIndex * childAngleStep;
        const childX = x + childRadius * Math.cos(childAngle);
        const childY = y + childRadius * Math.sin(childAngle);

        // 创建子分类节点
        nodes.push({
          id: child.id,
          type: 'materialViewerNode',
          position: { x: childX, y: childY },
          data: { label: child.name, count: child.count }
        });

        // 连接主分类和子分类节点
        edges.push({
          id: `${category.id}-${child.id}`,
          source: category.id,
          target: child.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#ff7777', strokeWidth: 1.5, opacity: 0.6 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#ff7777',
            width: 12,
            height: 12
          }
        });
      });
    }
  });

  return { nodes, edges };
}

/**
 * 根据资料标签为分类添加资料数量
 * @param categories 分类数组
 * @param materials 资料数组
 */
export function enhanceCategoriesWithMaterialCounts(
  categories: TagCategory[],
  materials: Array<{ tags: string[] }>
): TagCategory[] {
  // 创建一个map来跟踪每个标签的资料数量
  const tagCounts: Record<string, number> = {};
  
  // 计算每个标签的资料数量
  materials.forEach(material => {
    material.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // 递归函数来更新分类及其子分类的数量
  const updateCategoryCount = (category: TagCategory): TagCategory => {
    // 更新当前分类的数量
    const updatedCategory = {
      ...category,
      count: tagCounts[category.name] || 0
    };

    // 如果有子分类，更新它们
    if (category.children && category.children.length > 0) {
      updatedCategory.children = category.children.map(updateCategoryCount);
    }

    return updatedCategory;
  };

  // 更新所有分类的数量
  return categories.map(updateCategoryCount);
}

/**
 * 基于资料记录生成节点和边
 * @param materials 资料记录数组
 */
export function generateMaterialNodes(
  materials: Array<{ id: string; title: string; tags?: string[] }>
): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // 创建中心节点
  const rootId = 'center';
  nodes.push({
    id: rootId,
    type: 'materialViewerNode',
    position: { x: 0, y: 0 },
    data: { label: '资料中心', count: materials.length }
  });

  // 定义圆的半径
  const radius = 300;
  
  // 计算每个资料节点的位置（围绕中心节点的圆形布局）
  const angleStep = (2 * Math.PI) / materials.length;
  
  materials.forEach((material, index) => {
    const angle = index * angleStep;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    // 创建资料节点
    nodes.push({
      id: material.id,
      type: 'materialViewerNode',
      position: { x, y },
      data: { 
        label: material.title,
        count: material.tags?.length || 0
      }
    });
    
    // 连接中心节点和资料节点
    edges.push({
      id: `${rootId}-${material.id}`,
      source: rootId,
      target: material.id,
      type: 'smoothstep',
      style: { stroke: '#ff5555', strokeWidth: 1.5, opacity: 0.7 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#ff5555',
        width: 12,
        height: 12
      }
    });
  });
  
  return { nodes, edges };
}

/**
 * 生成Mermaid思维导图语法
 * @param title 思维导图标题
 * @param data 数据对象
 * @param type 图表类型
 * @returns Mermaid语法字符串
 */
export function generateMermaidSyntax(
  title: string,
  data: Record<string, any[]>,
  type: 'category' | 'date' | 'fileType' = 'category'
): string {
  let syntax = 'mindmap\n';
  syntax += `  root((${title}))\n`;
  
  // 根据不同类型生成不同的思维导图结构
  Object.entries(data).forEach(([key, items]) => {
    syntax += `    ${key} (${items.length})\n`;
    
    // 限制每组显示的项目数量
    const limitedItems = items.slice(0, 5);
    limitedItems.forEach(item => {
      let itemName = '';
      
      switch (type) {
        case 'category':
          itemName = item.title || '未命名';
          break;
        case 'date':
          itemName = item.title || item.file?.name || '未命名';
          break;
        case 'fileType':
          itemName = item.title || item.file?.name || '未命名';
          break;
      }
      
      syntax += `      ${itemName}\n`;
    });
    
    if (items.length > 5) {
      syntax += `      还有 ${items.length - 5} 个文件...\n`;
    }
  });
  
  return syntax;
}

/**
 * 生成按日期分组的数据
 * @param materials 材料数组
 * @returns 按日期分组的对象
 */
export function groupByDate(materials: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  
  materials.forEach(material => {
    if (material.uploadDate) {
      const date = new Date(material.uploadDate);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      
      groups[yearMonth].push(material);
    }
  });
  
  return groups;
}

/**
 * 生成按文件类型分组的数据
 * @param materials 材料数组
 * @returns 按文件类型分组的对象
 */
export function groupByFileType(materials: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  
  materials.forEach(material => {
    let fileType = '其他';
    
    if (material.file?.type) {
      if (material.file.type.includes('pdf')) {
        fileType = 'PDF';
      } else if (material.file.type.includes('word') || material.file.type.includes('docx')) {
        fileType = 'Word文档';
      } else if (material.file.type.includes('excel') || material.file.type.includes('xlsx')) {
        fileType = 'Excel表格';
      } else if (material.file.type.includes('image')) {
        fileType = '图片';
      } else if (material.file.type.includes('video')) {
        fileType = '视频';
      } else if (material.file.type.includes('audio')) {
        fileType = '音频';
      } else if (material.file.type.includes('zip') || material.file.type.includes('rar')) {
        fileType = '压缩包';
      } else if (material.file.type.includes('text')) {
        fileType = '文本文件';
      }
    }
    
    if (!groups[fileType]) {
      groups[fileType] = [];
    }
    
    groups[fileType].push(material);
  });
  
  return groups;
}

/**
 * 生成按分类标签分组的数据
 * @param materials 材料数组
 * @param categories 分类数组
 * @returns 按分类分组的对象
 */
export function groupByCategory(
  materials: any[], 
  categories: TagCategory[]
): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  
  // 递归函数用于构建分类层次结构
  function processCategory(category: TagCategory, path: string[] = []) {
    const currentPath = [...path, category.name];
    const key = currentPath.join(' > ');
    
    // 为当前分类创建组
    groups[key] = materials.filter(material => 
      material.tags && material.tags.includes(category.name)
    );
    
    // 处理子分类
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => processCategory(child, currentPath));
    }
  }
  
  // 处理所有顶级分类
  categories.forEach(category => processCategory(category));
  
  return groups;
}

/**
 * 扁平化分类结构为一维数组
 * @param categories 分类标签数组
 * @returns 扁平化的标签数组
 */
export function flattenCategories(categories: TagCategory[]): TagCategory[] {
  let result: TagCategory[] = [];
  
  categories.forEach(category => {
    result.push(category);
    
    if (category.children && category.children.length > 0) {
      result = result.concat(flattenCategories(category.children));
    }
  });
  
  return result;
}

