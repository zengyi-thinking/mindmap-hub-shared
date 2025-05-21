import { Node, Edge, MarkerType } from '@xyflow/react';

export interface CategoryData {
  id: string;
  name: string;
  count: number;
  children?: CategoryData[];
}

interface LayoutOptions {
  centerX?: number;
  centerY?: number;
  nodeSpacing?: number;
  hierarchySpacing?: number;
}

/**
 * 生成放射状布局的思维导图
 */
export function generateRadialLayout(
  categories: CategoryData[],
  options: LayoutOptions = {}
): { nodes: Node[], edges: Edge[] } {
  const {
    centerX = 0,
    centerY = 0,
    nodeSpacing = 80,
    hierarchySpacing = 150
  } = options;
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 创建中心节点
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'materialNode',
    position: { x: centerX, y: centerY },
    data: { 
      label: '资料中心',
      count: categories.reduce((sum, cat) => sum + cat.count, 0),
      color: '#ff5555',
      level: 0
    }
  });
  
  // 计算每个主分类的角度和位置
  const angleStep = (2 * Math.PI) / categories.length;
  const radius = hierarchySpacing;
  
  // 为每个主分类创建节点和边
  categories.forEach((category, index) => {
    const angle = index * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // 创建主分类节点
    nodes.push({
      id: category.id,
      type: 'materialNode',
      position: { x, y },
      data: { 
        label: category.name,
        count: category.count,
        color: '#ff5555',
        level: 1
      }
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
    
    // 如果有子分类，递归添加
    if (category.children && category.children.length > 0) {
      const childRadius = radius * 0.7;
      const childSpacing = angleStep * 0.8 / category.children.length;
      const startAngle = angle - (angleStep * 0.4);
      
      category.children.forEach((child, childIndex) => {
        const childAngle = startAngle + childIndex * childSpacing;
        const childX = x + childRadius * Math.cos(childAngle);
        const childY = y + childRadius * Math.sin(childAngle);
        
        // 创建子分类节点
        nodes.push({
          id: child.id,
          type: 'materialNode',
          position: { x: childX, y: childY },
          data: { 
            label: child.name,
            count: child.count,
            color: '#ff7777',
            level: 2
          }
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
 * 生成力导向图布局的思维导图
 */
export function generateForceDirectedLayout(
  categories: CategoryData[],
  options: LayoutOptions = {}
): { nodes: Node[], edges: Edge[] } {
  const {
    centerX = 0,
    centerY = 0,
    nodeSpacing = 100,
    hierarchySpacing = 180
  } = options;
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 创建中心节点
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'materialNode',
    position: { x: centerX, y: centerY },
    data: { 
      label: '资料中心',
      count: categories.reduce((sum, cat) => sum + cat.count, 0),
      color: '#3366ff',
      level: 0
    }
  });
  
  // 使用简化的力导向布局 - 分类围绕中心均匀分布
  const mainCategoriesCount = categories.length;
  const angleIncrement = (2 * Math.PI) / mainCategoriesCount;
  
  categories.forEach((category, index) => {
    // 为主分类创建节点和边 - 在第一圈
    const angle = index * angleIncrement;
    const distance = hierarchySpacing;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    
    nodes.push({
      id: category.id,
      type: 'materialNode',
      position: { x, y },
      data: { 
        label: category.name, 
        count: category.count,
        color: '#3366ff',
        level: 1
      }
    });
    
    edges.push({
      id: `${rootId}-${category.id}`,
      source: rootId,
      target: category.id,
      type: 'default',
      animated: false,
      style: { stroke: '#3366ff', strokeWidth: 2 }
    });
    
    // 处理子分类 - 使它们围绕主分类
    if (category.children && category.children.length > 0) {
      const childrenCount = category.children.length;
      const childAngleIncrement = Math.PI / (childrenCount + 1);
      const baseChildAngle = angle - Math.PI / 2; // 从垂直于主分类的方向开始
      
      category.children.forEach((child, childIndex) => {
        const childAngle = baseChildAngle + (childIndex + 1) * childAngleIncrement;
        const childDistance = nodeSpacing;
        const childX = x + childDistance * Math.cos(childAngle);
        const childY = y + childDistance * Math.sin(childAngle);
        
        nodes.push({
          id: child.id,
          type: 'materialNode',
          position: { x: childX, y: childY },
          data: { 
            label: child.name, 
            count: child.count,
            color: '#5588ff',
            level: 2
          }
        });
        
        edges.push({
          id: `${category.id}-${child.id}`,
          source: category.id,
          target: child.id,
          type: 'default',
          animated: false,
          style: { stroke: '#5588ff', strokeWidth: 1.5 }
        });
      });
    }
  });
  
  return { nodes, edges };
}

/**
 * 生成树状布局的思维导图
 */
export function generateTreeLayout(
  categories: CategoryData[],
  options: LayoutOptions = {}
): { nodes: Node[], edges: Edge[] } {
  const {
    centerX = 0,
    centerY = 0,
    nodeSpacing = 60,
    hierarchySpacing = 120
  } = options;
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 创建根节点
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'materialNode',
    position: { x: centerX, y: centerY },
    data: { 
      label: '资料中心',
      count: categories.reduce((sum, cat) => sum + cat.count, 0),
      color: '#00aa77',
      level: 0
    }
  });
  
  // 计算主分类的排列
  const totalCategories = categories.length;
  const totalWidth = totalCategories * nodeSpacing;
  let startX = centerX - totalWidth / 2;
  
  // 一级分类按行排列
  categories.forEach((category, index) => {
    const x = startX + index * nodeSpacing;
    const y = centerY + hierarchySpacing;
    
    nodes.push({
      id: category.id,
      type: 'materialNode',
      position: { x, y },
      data: { 
        label: category.name,
        count: category.count,
        color: '#00aa77',
        level: 1
      }
    });
    
    // 连接根节点与该分类
    edges.push({
      id: `${rootId}-${category.id}`,
      source: rootId,
      target: category.id,
      type: 'step',
      style: { stroke: '#00aa77', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#00aa77',
      }
    });
    
    // 为子分类创建节点和边
    if (category.children && category.children.length > 0) {
      const childrenCount = category.children.length;
      const childTotalWidth = childrenCount * (nodeSpacing * 0.8);
      let childStartX = x - childTotalWidth / 2;
      
      category.children.forEach((child, childIndex) => {
        const childX = childStartX + childIndex * (nodeSpacing * 0.8);
        const childY = y + hierarchySpacing * 0.8;
        
        nodes.push({
          id: child.id,
          type: 'materialNode',
          position: { x: childX, y: childY },
          data: { 
            label: child.name,
            count: child.count,
            color: '#44cc99',
            level: 2
          }
        });
        
        edges.push({
          id: `${category.id}-${child.id}`,
          source: category.id,
          target: child.id,
          type: 'step',
          style: { stroke: '#44cc99', strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#44cc99',
          }
        });
      });
    }
  });
  
  return { nodes, edges };
}

/**
 * 将标签分层结构转换为CategoryData结构
 */
export function convertTagsToCategories(tagHierarchy: any[]): CategoryData[] {
  let idCounter = 0;
  
  const processCategory = (tag: any): CategoryData => {
    idCounter++;
    
    return {
      id: `category-${idCounter}`,
      name: tag.name,
      count: tag.files?.length || 0,
      children: tag.children ? tag.children.map(processCategory) : undefined
    };
  };
  
  return tagHierarchy.map(processCategory);
}

/**
 * 基于材料数据生成分类树
 */
export function generateCategoriesFromMaterials(materials: any[]): CategoryData[] {
  // 提取所有标签并计算频率
  const tagFrequency: Record<string, number> = {};
  const tagMaterials: Record<string, any[]> = {};
  
  materials.forEach(material => {
    if (material.tags && Array.isArray(material.tags)) {
      material.tags.forEach((tag: string) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        
        if (!tagMaterials[tag]) {
          tagMaterials[tag] = [];
        }
        tagMaterials[tag].push(material);
      });
    }
  });
  
  // 基于频率排序
  const sortedTags = Object.keys(tagFrequency).sort(
    (a, b) => tagFrequency[b] - tagFrequency[a]
  );
  
  // 选取前10个最常见的标签作为主分类
  const mainCategories = sortedTags.slice(0, 10);
  
  // 生成分类数据
  return mainCategories.map((tag, index) => ({
    id: `category-${index}`,
    name: tag,
    count: tagFrequency[tag],
    // 子分类可以是与该主分类共现的其他标签
    children: findRelatedTags(tag, tagMaterials, sortedTags, 5).map((relatedTag, childIndex) => ({
      id: `category-${index}-${childIndex}`,
      name: relatedTag,
      count: tagMaterials[relatedTag].length
    }))
  }));
}

/**
 * 查找与指定标签相关的其他标签
 */
function findRelatedTags(
  mainTag: string, 
  tagMaterials: Record<string, any[]>, 
  allTags: string[], 
  limit: number = 5
): string[] {
  const materialsWithMainTag = tagMaterials[mainTag] || [];
  const cooccurrenceCounts: Record<string, number> = {};
  
  // 计算共现次数
  materialsWithMainTag.forEach(material => {
    if (material.tags && Array.isArray(material.tags)) {
      material.tags.forEach((tag: string) => {
        if (tag !== mainTag) {
          cooccurrenceCounts[tag] = (cooccurrenceCounts[tag] || 0) + 1;
        }
      });
    }
  });
  
  // 按共现次数排序
  const relatedTags = Object.keys(cooccurrenceCounts).sort(
    (a, b) => cooccurrenceCounts[b] - cooccurrenceCounts[a]
  );
  
  return relatedTags.slice(0, limit);
} 