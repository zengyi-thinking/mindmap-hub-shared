import { Node, Edge, MarkerType } from '@xyflow/react';
import { findTagPath } from './utils/TagUtils';
import { TagCategory } from '@/types/materials';
import { MaterialWithTags } from '@/types/materials';

interface MindMapGeneratorOptions {
  searchQuery: string;
  selectedTags: string[];
  materialsData: any[];
  tagHierarchy: TagCategory[];
}

// 定义边的样式
const defaultEdgeStyle = {
  stroke: '#FF3366',
  strokeWidth: 5, // 增加线宽，提高可见性
  type: 'smoothstep', // 使用平滑曲线连接
  animated: true,
  style: {
    strokeDasharray: '5,5'
  }
};

// 根据层级计算节点位置和样式
const calculateNodePosition = (
  index: number, 
  totalNodes: number, 
  level: number, 
  parentPosition?: { x: number, y: number }
) => {
  const SPACING = 250; // 节点之间的基础间距
  const LEVEL_VERTICAL_OFFSET = 180; // 每层的垂直偏移
  
  if (level === 0) { // 中心节点
    return { x: 0, y: 0 };
  }
  
  if (level === 1) { // 第一级节点，均匀分布在圆周上
    const angleStep = (2 * Math.PI) / totalNodes;
    const angle = angleStep * index;
    
    // 使用不同的半径，根据总节点数动态调整
    const radius = Math.max(300, totalNodes * 60);
    
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }
  
  // 如果有父节点位置，则相对于父节点定位
  if (parentPosition) {
    // 子节点在扇形区域内分布
    const nodesPerSection = 3; // 每个扇区最多节点数
    const sectionIndex = Math.floor(index / nodesPerSection);
    const indexInSection = index % nodesPerSection;
    
    // 计算扇区角度和偏移
    const sectionAngle = Math.PI / 4; // 扇区角度
    const startAngle = -Math.PI / 2 + sectionIndex * sectionAngle;
    const angleStep = sectionAngle / (nodesPerSection + 1);
    const angle = startAngle + (indexInSection + 1) * angleStep;
    
    // 第二级节点的半径
    const radius = 180;
    
    // 在父节点周围分布
    const x = parentPosition.x + Math.cos(angle) * radius;
    const y = parentPosition.y + Math.sin(angle) * radius + LEVEL_VERTICAL_OFFSET;
    
    return { x, y };
  }
  
  // 默认回退位置
  return {
    x: SPACING * (index - totalNodes / 2),
    y: level * LEVEL_VERTICAL_OFFSET
  };
};

// 生成标签映射，按级别组织
const generateTagsMapping = (materials: MaterialWithTags[]) => {
  const tags: Record<string, string[]> = {};
  
  materials.forEach(material => {
    material.tags.forEach(tag => {
      if (!tags[tag]) {
        tags[tag] = [];
      }
      if (!tags[tag].includes(material.title)) {
        tags[tag].push(material.title);
      }
    });
  });
  
  return tags;
};

// 生成层次结构的标签关系
const generateTagHierarchy = (tagsMapping: Record<string, string[]>, materials: MaterialWithTags[]) => {
  // 尝试构建标签之间的关系
  const tagRelations: Record<string, string[]> = {};
  const allTags = Object.keys(tagsMapping);
  
  // 初始化关系图
  allTags.forEach(tag => {
    tagRelations[tag] = [];
  });
  
  // 基于材料的共现标签构建关系
  materials.forEach(material => {
    if (material.tags.length > 1) {
      // 对于每个标签，将同一材料的其他标签作为相关标签
      material.tags.forEach(mainTag => {
        material.tags.forEach(relatedTag => {
          if (mainTag !== relatedTag && !tagRelations[mainTag].includes(relatedTag)) {
            tagRelations[mainTag].push(relatedTag);
          }
        });
      });
    }
  });
  
  // 找出最流行的标签作为中心节点
  const centralTag = findCentralTag(tagsMapping);
  
  // 分配其他标签到不同的层级
  const { firstLevel, secondLevel } = assignTagLevels(centralTag, tagRelations, tagsMapping);
  
  return {
    centralTag,
    firstLevel,
    secondLevel,
    tagRelations,
    tagsMapping
  };
};

// 寻找中心标签
const findCentralTag = (tagsMapping: Record<string, string[]>) => {
  // 通过关联的材料数量来确定中心标签
  let maxMaterials = 0;
  let centralTag = '';
  
  Object.entries(tagsMapping).forEach(([tag, materials]) => {
    if (materials.length > maxMaterials) {
      maxMaterials = materials.length;
      centralTag = tag;
    }
  });
  
  return centralTag;
};

// 分配标签层级
const assignTagLevels = (
  centralTag: string, 
  tagRelations: Record<string, string[]>, 
  tagsMapping: Record<string, string[]>
) => {
  // 第一级标签: 直接与中心标签相关的标签
  const firstLevel = tagRelations[centralTag] || [];
  
  // 第二级标签: 与第一级标签相关的标签
  const secondLevel: Record<string, string[]> = {};
  
  firstLevel.forEach(firstLevelTag => {
    secondLevel[firstLevelTag] = tagRelations[firstLevelTag]
      .filter(tag => 
        tag !== centralTag && 
        !firstLevel.includes(tag) &&
        // 确保每个二级标签只出现一次
        !Object.values(secondLevel).flat().includes(tag)
      );
  });
  
  return { firstLevel, secondLevel };
};

// 生成带有层次结构的思维导图
export const generateHierarchicalMindMap = (
  materials: MaterialWithTags[], 
  searchQuery?: string
): { nodes: Node[], edges: Edge[] } => {
  if (!materials.length) {
    return { nodes: [], edges: [] };
  }
  
  // 生成标签映射和层次结构
  const tagsMapping = generateTagsMapping(materials);
  const { centralTag, firstLevel, secondLevel, tagsMapping: updatedTagsMapping } = 
    generateTagHierarchy(tagsMapping, materials);
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 中心节点 (搜索查询或默认中心标签)
  const centerNode: Node = {
    id: 'center',
    type: 'mindmap',
    data: {
      label: searchQuery || centralTag,
      type: 'central',
      level: 0,
      materials: updatedTagsMapping[centralTag] || []
    },
    position: calculateNodePosition(0, 1, 0)
  };
  nodes.push(centerNode);
  
  // 添加第一级节点
  const firstLevelNodes: Node[] = [];
  firstLevel.forEach((tag, index) => {
    const nodeId = `level1-${index}`;
    const position = calculateNodePosition(index, firstLevel.length, 1);
    
    const node: Node = {
      id: nodeId,
      type: 'mindmap',
      data: {
        label: tag,
        type: 'tag',
        level: 1,
        fullPath: [centralTag, tag],
        materials: updatedTagsMapping[tag] || []
      },
      position
    };
    
    firstLevelNodes.push(node);
    nodes.push(node);
    
    // 连接中心节点和第一级节点
    edges.push({
      id: `edge-center-to-${nodeId}`,
      source: 'center',
      target: nodeId,
      ...defaultEdgeStyle,
      style: {
        ...defaultEdgeStyle.style,
        stroke: '#FF3366',
        strokeWidth: 3
      }
    });
  });
  
  // 添加第二级节点
  let secondLevelNodeIndex = 0;
  Object.entries(secondLevel).forEach(([firstLevelTag, secondLevelTags]) => {
    // 找到对应的第一级节点
    const parentNodeIndex = firstLevel.indexOf(firstLevelTag);
    if (parentNodeIndex === -1) return;
    
    const parentNodeId = `level1-${parentNodeIndex}`;
    const parentNode = firstLevelNodes[parentNodeIndex];
    
    // 为每个第二级标签创建节点
    secondLevelTags.forEach((tag, localIndex) => {
      const nodeId = `level2-${secondLevelNodeIndex}`;
      const position = calculateNodePosition(
        localIndex, 
        secondLevelTags.length, 
        2, 
        parentNode.position
      );
      
      const node: Node = {
        id: nodeId,
        type: 'mindmap',
        data: {
          label: tag,
          type: 'tag',
          level: 2,
          fullPath: [centralTag, firstLevelTag, tag],
          materials: updatedTagsMapping[tag] || []
        },
        position
      };
      
      nodes.push(node);
      
      // 连接第一级节点和第二级节点
      edges.push({
        id: `edge-${parentNodeId}-to-${nodeId}`,
        source: parentNodeId,
        target: nodeId,
        ...defaultEdgeStyle,
        style: {
          ...defaultEdgeStyle.style,
          stroke: '#8B5CF6',
          strokeWidth: 2
        }
      });
      
      secondLevelNodeIndex++;
    });
  });
  
  // 添加材料节点 (如果有明确的搜索查询，添加与该查询匹配的材料)
  if (searchQuery) {
    const relevantMaterials = materials.filter(material => 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    relevantMaterials.slice(0, 5).forEach((material, index) => {
      const nodeId = `material-${index}`;
      
      // 材料节点显示在中心节点下方
      const node: Node = {
        id: nodeId,
        type: 'mindmap',
        data: {
          label: material.title,
          type: 'material',
          level: 1,
          material: material,
          isLastLevel: true
        },
        position: {
          x: (index - Math.floor(relevantMaterials.length / 2)) * 220,
          y: 300
        }
      };
      
      nodes.push(node);
      
      // 连接中心节点和材料节点
      edges.push({
        id: `edge-center-to-${nodeId}`,
        source: 'center',
        target: nodeId,
        ...defaultEdgeStyle,
        style: {
          ...defaultEdgeStyle.style,
          stroke: '#10B981',
          strokeWidth: 2,
          strokeDasharray: '0' // 实线
        }
      });
    });
  }
  
  return { nodes, edges };
};

// 生成基础思维导图 (保留原有功能，但改进样式)
export const generateBasicMindMap = (
  materials: MaterialWithTags[],
  searchQuery?: string
): { nodes: Node[], edges: Edge[] } => {
  // 如果没有材料，返回空结果
  if (!materials.length) {
    return { nodes: [], edges: [] };
  }
  
  // 收集所有标签
  const tags: Record<string, string[]> = {};
  
  materials.forEach(material => {
    material.tags.forEach(tag => {
      if (!tags[tag]) {
        tags[tag] = [];
      }
      tags[tag].push(material.title);
    });
  });
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 中心节点
  const centerNode: Node = {
    id: 'center',
    type: 'mindmap',
    data: {
      label: searchQuery || '标签地图',
      type: 'central',
      level: 0
    },
    position: { x: 0, y: 0 }
  };
  
  nodes.push(centerNode);
  
  // 计算每个标签节点的位置
  const tagsArray = Object.keys(tags);
  const angleStep = (2 * Math.PI) / tagsArray.length;
  const radius = 250; // 增大半径，使节点更加分散
  
  tagsArray.forEach((tag, index) => {
    const angle = angleStep * index;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    const nodeId = `tag-${index}`;
    
    nodes.push({
      id: nodeId,
      type: 'mindmap',
      data: {
        label: tag,
        type: 'tag',
        level: 1,
        materials: tags[tag]
      },
      position: { x, y }
    });
    
    // 连接中心节点和标签节点
    edges.push({
      id: `edge-center-to-${nodeId}`,
      source: 'center',
      target: nodeId,
      ...defaultEdgeStyle
    });
    
    // 为每个标签添加相关的材料节点
    const relatedMaterials = tags[tag].slice(0, 3); // 限制每个标签显示的材料数量
    
    if (relatedMaterials.length > 0) {
      const materialAngleStep = (Math.PI / 2) / (relatedMaterials.length + 1);
      const materialStartAngle = angle - Math.PI / 4;
      const materialRadius = 150;
      
      relatedMaterials.forEach((materialTitle, materialIndex) => {
        const materialAngle = materialStartAngle + materialAngleStep * (materialIndex + 1);
        const materialX = x + Math.cos(materialAngle) * materialRadius;
        const materialY = y + Math.sin(materialAngle) * materialRadius;
        
        const materialNodeId = `material-${index}-${materialIndex}`;
        
        nodes.push({
          id: materialNodeId,
          type: 'mindmap',
          data: {
            label: materialTitle,
            type: 'material',
            level: 2,
            material: materials.find(m => m.title === materialTitle)
          },
          position: { x: materialX, y: materialY }
        });
        
        // 连接标签节点和材料节点
        edges.push({
          id: `edge-${nodeId}-to-${materialNodeId}`,
          source: nodeId,
          target: materialNodeId,
          ...defaultEdgeStyle,
          style: {
            ...defaultEdgeStyle.style,
            stroke: '#10B981', // 材料连接线使用不同颜色
            strokeWidth: 2
          }
        });
      });
    }
  });
  
  return { nodes, edges };
};

// 创建中心节点
const createCentralNode = (label: string): Node => {
  return {
    id: 'central',
    type: 'mindmapNode',
    position: { x: 0, y: 0 },
    data: { 
      label,
      type: 'central',
      level: 0,
      style: {
        background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))',
        color: 'white',
        borderRadius: '16px',
        border: 'none',
        padding: '20px 24px',
        fontSize: '18px',
        fontWeight: '700',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        minWidth: '200px',
        textAlign: 'center'
      }
    }
  };
};

// 创建连接边
const createEdge = (
  source: string, 
  target: string, 
  isAnimated: boolean = false,
  isCentral: boolean = false,
  level: number = 1
): Edge => {
  // 定义更吸引人的边样式
  const getEdgeStyle = () => {
    // 基础样式
    const baseStyle = {
      stroke: '#FF3366', 
      strokeWidth: 5, // 增加线宽，提高可见性
      opacity: 0.9,
    };
    
    if (isCentral) {
      return {
        ...baseStyle,
        strokeWidth: 6, // 中心连接线更粗
        opacity: 1,
        // 中央连接线使用虚线
        strokeDasharray: '5, 5',
      };
    }
    
    // 根据层级设置不同样式
    const levelStyles = {
      1: { strokeWidth: 5.5, opacity: 0.95 },
      2: { strokeWidth: 5, opacity: 0.9 },
      3: { strokeWidth: 4.5, opacity: 0.85 },
      4: { strokeWidth: 4, opacity: 0.8 },
    };
    
    const levelStyle = levelStyles[level as keyof typeof levelStyles] || levelStyles[1];
    
    return {
      ...baseStyle,
      ...levelStyle,
    };
  };
  
  return {
    id: `edge-${source}-${target}`,
    source,
    target,
    animated: isAnimated,
    type: 'smoothstep',
    style: getEdgeStyle(),
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#FF3366',
      width: 20, // 增大箭头尺寸
      height: 20,
    }
  };
};

// 创建标签节点
const createTagNode = (
  id: string,
  label: string,
  position: { x: number; y: number },
  isLastLevel: boolean = false,
  fullPath: string[] = [],
  level: number = 1
): Node => {
  // 不同级别节点的样式
  const getNodeStyle = () => {
    // 颜色系列
    const colors = {
      level1: {
        background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.85))',
        color: 'white',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
      },
      level2: {
        background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
        color: 'white',
        boxShadow: '0 6px 12px rgba(79, 70, 229, 0.2)',
      },
      level3: {
        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        color: 'white',
        boxShadow: '0 6px 12px rgba(124, 58, 237, 0.2)',
      },
      level4: {
        background: 'linear-gradient(135deg, #EC4899, #DB2777)',
        color: 'white',
        boxShadow: '0 6px 12px rgba(219, 39, 119, 0.2)',
      },
      lastLevel: {
        background: 'linear-gradient(135deg, #10B981, #059669)',
        color: 'white',
        boxShadow: '0 6px 12px rgba(5, 150, 105, 0.2)',
      }
    };
    
    let styleToUse;
    
    if (isLastLevel) {
      styleToUse = colors.lastLevel;
    } else {
      const levelKey = `level${level}` as keyof typeof colors;
      styleToUse = colors[levelKey] || colors.level1;
    }
    
    return {
      ...styleToUse,
      borderRadius: '12px',
      border: 'none',
      padding: level === 1 ? '14px 18px' : '12px 16px',
      fontSize: level === 1 ? '15px' : '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minWidth: level === 1 ? '160px' : '140px',
      textAlign: 'center',
    };
  };
  
  return {
    id,
    type: 'mindmapNode',
    position,
    data: { 
      label,
      type: 'tag',
      level,
      fullPath, // 完整路径用于点击时过滤材料
      isLastLevel, // 是否为最终节点
      materials: [], // 点击时可加载相关材料
      style: getNodeStyle()
    }
  };
};

// 创建材料节点
const createMaterialNode = (
  id: string,
  material: any,
  position: { x: number; y: number }
): Node => {
  return {
    id,
    type: 'mindmapNode',
    position,
    data: { 
      label: material.title,
      type: 'material',
      material, // 存储完整的材料数据
      level: 3,
      style: {
        background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
        color: '#065F46',
        borderRadius: '10px',
        border: '1px solid #10B981',
        padding: '10px 14px',
        fontSize: '13px',
        fontWeight: '500',
        boxShadow: '0 4px 8px rgba(16, 185, 129, 0.15)',
        cursor: 'pointer',
        minWidth: '130px',
        maxWidth: '200px',
        textAlign: 'center',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }
    }
  };
};

// 主函数 - 生成思维导图
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
    
    return generateTagBasedMindMap(relatedMaterials, tagHierarchy, searchQuery, selectedTags);
  }
  
  // 默认使用第一个根分类作为中心
  return generateHierarchicalMindMap(materialsData, tagHierarchy, '');
};

// 生成以标签为中心的思维导图 - 优化版
export const generateTagBasedMindMap = (
  materials: any[],
  tagHierarchy: TagCategory[],
  searchQuery: string = '',
  selectedTags: string[] = []
): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 从材料中提取所有标签
  const allTagsMap = new Map<string, number>();
  materials.forEach(material => {
    if (material.tags) {
      material.tags.forEach((tag: string) => {
        const count = allTagsMap.get(tag) || 0;
        allTagsMap.set(tag, count + 1);
      });
    }
  });
  
  // 确定中心节点标签
  let centralNodeLabel = searchQuery || '标签导图';
  let centralCategory: TagCategory | null = null;
  
  // 如果有选中的标签，优先使用第一个选中的标签作为中心
  if (selectedTags.length > 0) {
    centralNodeLabel = selectedTags[0];
    
    // 尝试在层次结构中找到这个标签
    const findCategory = (categories: TagCategory[], targetName: string): TagCategory | null => {
      for (const category of categories) {
        if (category.name === targetName) {
          return category;
        }
        
        if (category.children) {
          const found = findCategory(category.children, targetName);
          if (found) return found;
        }
      }
      return null;
    };
    
    centralCategory = findCategory(tagHierarchy, centralNodeLabel);
  } 
  // 如果有搜索词，尝试在标签层次结构中查找匹配项
  else if (searchQuery) {
    const findMatchingCategory = (categories: TagCategory[]): TagCategory | null => {
      for (const category of categories) {
        if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return category;
        }
        
        if (category.children) {
          const found = findMatchingCategory(category.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    centralCategory = findMatchingCategory(tagHierarchy);
    if (centralCategory) {
      centralNodeLabel = centralCategory.name;
    }
  }
  
  // 创建中心节点
  const centralNode = createCentralNode(centralNodeLabel);
  nodes.push(centralNode);
  centralNode.position = { x: 0, y: 0 };
  
  // 如果在层次结构中找到了中心标签对应的分类，使用层次布局
  if (centralCategory && centralCategory.children && centralCategory.children.length > 0) {
    // 使用层次布局，从中心标签开始展开
    const firstLevelRadius = 350; // 增加一级节点到中心的距离，避免重叠
    const firstLevelCount = centralCategory.children.length;
    
    centralCategory.children.forEach((firstLevelTag, firstLevelIndex) => {
      // 计算一级节点位置 - 环形布局
      const firstLevelAngle = (Math.PI * 2 * firstLevelIndex) / firstLevelCount;
      const firstLevelPosition = {
        x: centralNode.position.x + Math.cos(firstLevelAngle) * firstLevelRadius,
        y: centralNode.position.y + Math.sin(firstLevelAngle) * firstLevelRadius
      };
      
      const firstLevelId = `level1-${firstLevelIndex}`;
      const firstLevelNode = createTagNode(
        firstLevelId,
        firstLevelTag.name,
        firstLevelPosition,
        false,
        [centralNodeLabel, firstLevelTag.name],
        1
      );
      
      nodes.push(firstLevelNode);
      edges.push(createEdge('central', firstLevelId, true, true, 1));
      
      // 收集相关材料
      const firstLevelMaterials = materials.filter(m => 
        m.tags && m.tags.includes(firstLevelTag.name)
      );
      firstLevelNode.data.materials = firstLevelMaterials;
      
      // 处理二级节点
      if (firstLevelTag.children && firstLevelTag.children.length > 0) {
        const secondLevelCount = firstLevelTag.children.length;
        const secondLevelRadius = 220; // 增加二级节点到一级节点的距离
        const arcLength = Math.PI / 1.5; // 增大二级节点的分布角度范围，减少重叠
        
        firstLevelTag.children.forEach((secondLevelTag, secondLevelIndex) => {
          // 计算二级节点的角度，在一级节点角度的基础上偏移
          // 将子节点分布在一个扇形区域内
          const offset = arcLength * (secondLevelIndex / (secondLevelCount - 1 || 1) - 0.5);
          const secondLevelAngle = firstLevelAngle + offset;
          
          const secondLevelPosition = {
            x: firstLevelPosition.x + Math.cos(secondLevelAngle) * secondLevelRadius,
            y: firstLevelPosition.y + Math.sin(secondLevelAngle) * secondLevelRadius
          };
          
          const secondLevelId = `level2-${firstLevelIndex}-${secondLevelIndex}`;
          const secondLevelNode = createTagNode(
            secondLevelId,
            secondLevelTag.name,
            secondLevelPosition,
            !secondLevelTag.children || secondLevelTag.children.length === 0,
            [centralNodeLabel, firstLevelTag.name, secondLevelTag.name],
            2
          );
          
          nodes.push(secondLevelNode);
          edges.push(createEdge(firstLevelId, secondLevelId, false, false, 2));
          
          // 收集相关材料
          const secondLevelMaterials = materials.filter(m => 
            m.tags && m.tags.includes(secondLevelTag.name)
          );
          secondLevelNode.data.materials = secondLevelMaterials;
          
          // 处理第三级节点
          if (secondLevelTag.children && secondLevelTag.children.length > 0) {
            const thirdLevelCount = secondLevelTag.children.length;
            const thirdLevelRadius = 180; // 增加三级节点到二级节点的距离
            
            secondLevelTag.children.forEach((thirdLevelTag, thirdLevelIndex) => {
              // 计算三级节点的角度
              const thirdLevelOffset = arcLength/1.5 * (thirdLevelIndex / (thirdLevelCount - 1 || 1) - 0.5);
              const thirdLevelAngle = secondLevelAngle + thirdLevelOffset;
              
              const thirdLevelPosition = {
                x: secondLevelPosition.x + Math.cos(thirdLevelAngle) * thirdLevelRadius,
                y: secondLevelPosition.y + Math.sin(thirdLevelAngle) * thirdLevelRadius
              };
              
              const thirdLevelId = `level3-${firstLevelIndex}-${secondLevelIndex}-${thirdLevelIndex}`;
              const thirdLevelNode = createTagNode(
                thirdLevelId,
                thirdLevelTag.name,
                thirdLevelPosition,
                true,
                [centralNodeLabel, firstLevelTag.name, secondLevelTag.name, thirdLevelTag.name],
                3
              );
              
              nodes.push(thirdLevelNode);
              edges.push(createEdge(secondLevelId, thirdLevelId, false, false, 3));
              
              // 收集相关材料
              const thirdLevelMaterials = materials.filter(m => 
                m.tags && m.tags.includes(thirdLevelTag.name)
              );
              thirdLevelNode.data.materials = thirdLevelMaterials;
            });
          }
        });
      }
    });
    
    return { nodes, edges };
  }
  
  // 如果没有找到中心标签的层次结构，则使用一般的标签关系布局
  // 排序标签按频率
  const sortedTags = Array.from(allTagsMap.entries())
    .sort((a, b) => b[1] - a[1]) // 按频率降序
    .slice(0, 10); // 限制最多显示10个一级标签
  
  // 放射状布局标签节点
  const tagCount = sortedTags.length;
  const firstLevelRadius = 350; // 增加一级节点到中心的距离，避免重叠
  
  sortedTags.forEach(([tag, count], index) => {
    // 如果标签是中心节点，跳过
    if (tag === centralNodeLabel) return;
    
    // 计算角度 (0 到 2π)
    const angle = (Math.PI * 2 * index) / tagCount;
    
    const position = {
      x: centralNode.position.x + Math.cos(angle) * firstLevelRadius,
      y: centralNode.position.y + Math.sin(angle) * firstLevelRadius
    };
    
    const nodeId = `tag-${index}`;
    const tagMaterials = materials.filter(m => m.tags && m.tags.includes(tag));
    
    const node = createTagNode(
      nodeId,
      tag,
      position,
      false,
      [centralNodeLabel, tag],
      1
    );
    
    // 存储相关的材料列表
    node.data.materials = tagMaterials;
    
    nodes.push(node);
    
    // 连接中心到标签节点
    edges.push(createEdge('central', nodeId, true, true, 1));
    
    // 找出与该标签相关的其他标签
    const relatedTags = new Map<string, number>();
    
    tagMaterials.forEach(material => {
      if (material.tags) {
        material.tags.forEach((relatedTag: string) => {
          if (relatedTag !== tag && relatedTag !== centralNodeLabel) {
            const relCount = relatedTags.get(relatedTag) || 0;
            relatedTags.set(relatedTag, relCount + 1);
          }
        });
      }
    });
    
    // 选择最相关的标签作为二级节点
    const relatedTagsArray = Array.from(relatedTags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // 每个一级标签最多显示5个相关二级标签
    
    if (relatedTagsArray.length > 0) {
      const secondLevelRadius = 200; // 增加二级节点到一级节点的距离
      const arcLength = Math.PI; // 增大二级节点的分布角度范围，减少重叠
      
      relatedTagsArray.forEach(([relatedTag, relCount], relIndex) => {
        const offset = arcLength * (relIndex / (relatedTagsArray.length - 1 || 1) - 0.5);
        const secondLevelAngle = angle + offset;
        
        const secondLevelPosition = {
          x: position.x + Math.cos(secondLevelAngle) * secondLevelRadius,
          y: position.y + Math.sin(secondLevelAngle) * secondLevelRadius
        };
        
        const secondLevelId = `subtag-${index}-${relIndex}`;
        const secondLevelMaterials = materials.filter(m => 
          m.tags && m.tags.includes(relatedTag)
        );
        
        const secondLevelNode = createTagNode(
          secondLevelId,
          relatedTag,
          secondLevelPosition,
          true,
          [centralNodeLabel, tag, relatedTag],
          2
        );
        
        secondLevelNode.data.materials = secondLevelMaterials;
        
        nodes.push(secondLevelNode);
        edges.push(createEdge(nodeId, secondLevelId, false, false, 2));
        
        // 对于特别相关的二级标签，显示一个关联材料作为三级节点
        if (secondLevelMaterials.length > 0) {
          const materialToShow = secondLevelMaterials[0]; // 取第一个相关材料
          const materialPosition = {
            x: secondLevelPosition.x + Math.cos(secondLevelAngle) * 150, // 增加距离
            y: secondLevelPosition.y + Math.sin(secondLevelAngle) * 150
          };
          
          const materialNodeId = `material-${index}-${relIndex}`;
          const materialNode = createMaterialNode(materialNodeId, materialToShow, materialPosition);
          
          nodes.push(materialNode);
          edges.push(createEdge(secondLevelId, materialNodeId, false, false, 3));
        }
      });
    } else {
      // 如果没有相关标签，但有相关材料，直接显示材料节点
      const materialsToShow = tagMaterials.slice(0, 3); // 最多显示3个材料
      
      if (materialsToShow.length > 0) {
        const materialRadius = 180; // 增加距离
        const materialArcLength = Math.PI; // 增大分布角度范围
        
        materialsToShow.forEach((material, matIndex) => {
          const offset = materialArcLength * (matIndex / (materialsToShow.length - 1 || 1) - 0.5);
          const materialAngle = angle + offset;
          
          const materialPosition = {
            x: position.x + Math.cos(materialAngle) * materialRadius,
            y: position.y + Math.sin(materialAngle) * materialRadius
          };
          
          const materialNodeId = `direct-material-${index}-${matIndex}`;
          const materialNode = createMaterialNode(materialNodeId, material, materialPosition);
          
          nodes.push(materialNode);
          edges.push(createEdge(nodeId, materialNodeId, false, false, 2));
        });
      }
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

export default {
  generateHierarchicalMindMap,
  generateBasicMindMap
};
