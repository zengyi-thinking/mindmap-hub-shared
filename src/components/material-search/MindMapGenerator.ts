import { Node, Edge, MarkerType } from '@xyflow/react';
import { findTagPath } from './utils/TagUtils';
import { TagCategory } from '@/types/materials';

interface MindMapGeneratorOptions {
  searchQuery: string;
  selectedTags: string[];
  materialsData: any[];
  tagHierarchy: TagCategory[];
}

// Create the central node of the mind map
const createCentralNode = (searchQuery: string): Node => {
  return {
    id: 'central',
    type: 'input',
    data: { 
      label: searchQuery || '资料搜索',
      isRoot: true,
      type: 'central'
    },
    position: { x: 100, y: 300 },
    style: {
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))',
      color: 'white',
      borderRadius: '12px',
      border: 'none',
      width: 180,
      height: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '12px',
      textAlign: 'center',
      boxShadow: '0 8px 20px rgba(var(--primary), 0.3)',
    },
  };
};

// 横向布局的节点位置计算
const calculateNodePosition = (
  centerX: number,
  centerY: number,
  distance: number,
  index: number,
  totalItems: number
) => {
  // 如果只有一个元素，直接向右放置
  if (totalItems === 1) {
    return {
      x: centerX + distance,
      y: centerY
    };
  }
  
  // 多个元素时，计算垂直分布 - 增加垂直间距避免重叠
  const spacing = 180;  // 大幅增加垂直间距，避免节点重叠
  const totalHeight = spacing * (totalItems - 1);
  const startY = centerY - totalHeight / 2;
  
  return {
    x: centerX + distance,
    y: startY + index * spacing
  };
};

// Create a tag node (for custom tags or tags in hierarchy)
const createTagNode = (
  id: string,
  label: string,
  position: { x: number; y: number },
  isLastLevel: boolean = false,
  fullPath: string[] = [],
  level: number = 1
): Node => {
  // Different styles based on the level
  const getNodeStyle = () => {
    if (isLastLevel) {
      // 最终级别标签 - 使用主题色变体
      return {
        background: 'linear-gradient(135deg, hsl(var(--primary)/0.9), hsl(var(--primary)/0.7))',
        color: 'white',
        borderRadius: '12px',
        border: 'none',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 4px 12px rgba(var(--primary), 0.25)',
        cursor: 'pointer',
        minWidth: '130px',
        textAlign: 'center',
      };
    }
    
    // 不同层级使用不同深浅的主题色
    const styles = {
      1: {
        background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.9))',
        color: 'white',
        boxShadow: '0 4px 12px rgba(var(--primary), 0.3)',
      },
      2: {
        background: 'linear-gradient(135deg, hsl(var(--primary)/0.9), hsl(var(--primary)/0.8))',
        color: 'white',
        boxShadow: '0 4px 12px rgba(var(--primary), 0.25)',
      },
      3: {
        background: 'linear-gradient(135deg, hsl(var(--primary)/0.8), hsl(var(--primary)/0.7))',
        color: 'white',
        boxShadow: '0 4px 12px rgba(var(--primary), 0.2)',
      },
    };
    
    const levelStyle = styles[level as keyof typeof styles] || styles[1];
    
    return {
      ...levelStyle,
      borderRadius: '12px',
      border: 'none',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minWidth: level === 1 ? '150px' : '130px',
      textAlign: 'center',
    };
  };

  return {
    id,
    data: {
      label,
      tagName: label,
      isLastLevel,
      type: 'tag',
      level,
      ...(fullPath.length > 0 ? { fullPath } : {})
    },
    position,
    style: getNodeStyle(),
  };
};

// Create a material node
const createMaterialNode = (
  id: string,
  material: any,
  position: { x: number; y: number }
): Node => {
  return {
    id,
    data: {
      label: material.title || material.file?.name,
      materialId: material.id,
      type: 'material',
      material: material
    },
    position,
    style: {
      background: 'white',
      border: '1px solid hsl(var(--primary)/0.3)',
      borderRadius: '10px',
      padding: '10px',
      fontSize: '13px',
      fontWeight: '500',
      width: 150,
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
    },
  };
};

// Create an edge between nodes
const createEdge = (
  sourceId: string,
  targetId: string,
  animated: boolean = false,
  withArrow: boolean = false,
  level: number = 1
): Edge => {
  // 使用主题色
  const edgeColor = 'hsl(var(--primary))';

  return {
    id: `edge-${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    animated: true, // 使用动画增强可见性
    style: { 
      stroke: edgeColor,
      strokeWidth: 5, // 更大的线宽，确保可见
    },
    ...(withArrow ? {
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20, // 箭头大小
        height: 20,
        color: edgeColor,
      }
    } : {}),
    type: 'smoothstep', // 使用平滑曲线连接线
    zIndex: 1000, // 确保边在节点上方
  };
};

// Main function to generate the mindmap
export const generateMindMap = (options: MindMapGeneratorOptions): { nodes: Node[], edges: Edge[] } => {
  const { searchQuery, selectedTags, materialsData, tagHierarchy } = options;
  
  // 如果有搜索查询或选中的标签，尝试生成基于路径的思维导图
  if (searchQuery || selectedTags.length > 0) {
    // 查找与搜索相关的材料
    let relatedMaterials: any[] = [];
    
    if (searchQuery) {
      // 如果是按文件名或标题搜索
      relatedMaterials = materialsData.filter(material => 
        material.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        material.file?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (material.tags && material.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    } else if (selectedTags.length > 0) {
      // 如果是按标签搜索
      relatedMaterials = materialsData.filter(material => 
        material.tags && selectedTags.every(tag => material.tags.includes(tag))
      );
    }
    
    // 即使没有找到相关材料，也尝试生成基于搜索词的思维导图
    return generateHierarchicalMindMap(relatedMaterials, tagHierarchy, searchQuery);
  }
  
  // 默认使用"比赛"作为主分类
  return generateHierarchicalMindMap(materialsData, tagHierarchy, '');
};

// 生成层级结构清晰的思维导图
export const generateHierarchicalMindMap = (
  materials: any[],
  tagHierarchy: TagCategory[],
  searchQuery: string = ''
): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 从材料中提取所有标签
  const allTags = new Set<string>();
  materials.forEach(material => {
    if (material.tags) {
      material.tags.forEach((tag: string) => allTags.add(tag));
    }
  });
  
  // 寻找根节点（通常是"比赛"）
  let rootCategory: TagCategory | null = null;
  
  // 如果有搜索查询，尝试将其作为中心节点
  if (searchQuery) {
    // 查找是否有与搜索词匹配的标签
    for (const category of tagHierarchy) {
      if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        rootCategory = category;
        break;
      }
      
      // 递归检查子标签
      const findMatchingCategory = (cat: TagCategory): TagCategory | null => {
        if (cat.children) {
          for (const child of cat.children) {
            if (child.name.toLowerCase().includes(searchQuery.toLowerCase())) {
              return child;
            }
            
            const foundInGrandchildren = findMatchingCategory(child);
            if (foundInGrandchildren) {
              return foundInGrandchildren;
            }
          }
        }
        return null;
      };
      
      const matchingCategory = findMatchingCategory(category);
      if (matchingCategory) {
        rootCategory = matchingCategory;
        break;
      }
    }
  }
  
  // 如果没有找到匹配的标签，使用默认的"比赛"标签
  if (!rootCategory) {
    for (const category of tagHierarchy) {
      if (category.name === '比赛') {
        rootCategory = category;
        break;
      }
    }
  }
  
  // 如果仍未找到合适的根节点，使用第一个分类或创建一个虚拟根节点
  if (!rootCategory) {
    if (tagHierarchy.length > 0) {
      rootCategory = tagHierarchy[0];
    } else {
      // 创建一个中心节点
      const centralNode = createCentralNode(searchQuery || '资料');
      nodes.push(centralNode);
      return { nodes, edges };
    }
  }
  
  // 创建根节点 - 居中位置
  const centralNode = {
    ...createCentralNode(rootCategory.name),
    position: { x: 300, y: 300 }, // 居中位置
  };
  nodes.push(centralNode);
  
  // 如果根节点没有子节点，直接返回
  if (!rootCategory.children || rootCategory.children.length === 0) {
    return { nodes, edges };
  }
  
  // 获取与材料相关的标签
  const relevantTags = new Set<string>();
  materials.forEach(material => {
    if (material.tags) {
      material.tags.forEach((tag: string) => relevantTags.add(tag));
    }
  });
  
  // 确定要显示的一级节点
  let firstLevelCategories = rootCategory.children;
  
  // 如果一级节点数量太多，筛选出与材料相关的一级节点
  if (firstLevelCategories.length > 10) {
    firstLevelCategories = firstLevelCategories.filter(category => 
      relevantTags.has(category.name) || 
      (category.children && category.children.some(child => relevantTags.has(child.name)))
    );
  }
  
  // 如果筛选后仍有太多节点，只显示一部分
  if (firstLevelCategories.length > 10) {
    firstLevelCategories = firstLevelCategories.slice(0, 10);
  }
  
  // 放射状布局一级节点
  const firstLevelCount = firstLevelCategories.length;
  firstLevelCategories.forEach((category, index) => {
    // 计算角度 (0 到 2π)
    const angle = (Math.PI * 2 * index) / firstLevelCount;
    const radius = 200; // 到中心的距离
    
    const position = {
      x: centralNode.position.x + Math.cos(angle) * radius,
      y: centralNode.position.y + Math.sin(angle) * radius
    };
    
    const nodeId = `level1-${index}`;
    const node = createTagNode(
      nodeId,
      category.name,
      position,
      false,
      [rootCategory?.name || '', category.name],
      1
    );
    nodes.push(node);
    
    // 连接中心到一级节点
    edges.push(createEdge('central', nodeId, true, true, 1));
    
    // 处理二级节点
    if (category.children && category.children.length > 0) {
      // 筛选相关的二级节点
      let secondLevelNodes = category.children;
      if (secondLevelNodes.length > 5) {
        secondLevelNodes = secondLevelNodes.filter(child => 
          relevantTags.has(child.name)
        );
      }
      
      // 限制二级节点数量
      if (secondLevelNodes.length > 5) {
        secondLevelNodes = secondLevelNodes.slice(0, 5);
      }
      
      // 围绕一级节点放置二级节点
      secondLevelNodes.forEach((secondLevelTag, secondIndex) => {
        // 计算二级节点的角度，基于一级节点的位置
        const secondAngle = angle + (Math.PI * (secondIndex - secondLevelNodes.length / 2) / (secondLevelNodes.length + 1));
        const secondRadius = 100; // 二级节点到一级节点的距离
        
        const secondPosition = {
          x: position.x + Math.cos(secondAngle) * secondRadius,
          y: position.y + Math.sin(secondAngle) * secondRadius
        };
        
        const secondNodeId = `level2-${index}-${secondIndex}`;
        const secondNode = createTagNode(
          secondNodeId,
          secondLevelTag.name,
          secondPosition,
          true,
          [rootCategory?.name || '', category.name, secondLevelTag.name],
          2
        );
        nodes.push(secondNode);
        
        // 连接一级到二级节点
        edges.push(createEdge(nodeId, secondNodeId, false, false, 2));
        
        // 找出与该二级标签相关的材料
        const tagMaterials = materials.filter(m => 
          m.tags && m.tags.includes(secondLevelTag.name)
        );
        
        // 添加最多两个相关材料节点
        const materialsToShow = tagMaterials.slice(0, 2);
        materialsToShow.forEach((material, matIndex) => {
          // 计算材料节点位置
          const materialAngle = secondAngle + (Math.PI * 0.2 * (matIndex - 0.5));
          const materialRadius = 80;
          
          const materialPosition = {
            x: secondPosition.x + Math.cos(materialAngle) * materialRadius,
            y: secondPosition.y + Math.sin(materialAngle) * materialRadius
          };
          
          const materialNodeId = `material-${index}-${secondIndex}-${matIndex}`;
          const materialNode = createMaterialNode(materialNodeId, material, materialPosition);
          nodes.push(materialNode);
          
          // 连接二级标签到材料
          edges.push(createEdge(secondNodeId, materialNodeId, false, false, 3));
        });
      });
    }
  });
  
  return { nodes, edges };
};

// 获取分类中的所有标签
function getAllTagsInCategory(category: TagCategory): string[] {
  const tags: string[] = [category.name];
  
  if (category.children) {
    category.children.forEach(child => {
      tags.push(child.name);
      
      if (child.children) {
        child.children.forEach(grandchild => {
          tags.push(grandchild.name);
        });
      }
    });
  }
  
  return tags;
}
