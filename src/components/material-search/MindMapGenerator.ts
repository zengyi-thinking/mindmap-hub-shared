import { Node, Edge, MarkerType } from '@xyflow/react';
import { findTagPath } from './utils/TagUtils';
import { TagCategory } from '@/types/materials';

interface MindMapGeneratorOptions {
  searchQuery: string;
  selectedTags: string[];
  materialsData: any[];
  tagHierarchy: TagCategory[];
}

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
      borderRadius: '12px',
      border: 'none',
        padding: '16px 20px',
      fontSize: '16px',
        fontWeight: '700',
        boxShadow: '0 8px 16px rgba(var(--primary), 0.3)',
        minWidth: '180px',
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
  // 根据层级和类型设置不同的边样式
  const getEdgeStyle = () => {
    const baseStyle = {
      stroke: '#FF3366', 
      strokeWidth: 5,
      opacity: 0.8,
    };
    
    if (isCentral) {
      return {
        ...baseStyle,
        strokeWidth: 5,
        opacity: 1
      };
    }
    
    // 层级越深，线条越细
    return {
      ...baseStyle,
      strokeWidth: 4 - (level - 1),
      opacity: 0.8 - (level - 1) * 0.2
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
      width: 20,
      height: 20,
    }
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
        background: 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)/0.9))',
        color: 'hsl(var(--accent-foreground))',
        borderRadius: '12px',
        border: 'none',
        padding: '10px 14px',
        fontSize: '13px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        minWidth: '120px',
        maxWidth: '200px',
      textAlign: 'center',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }
    }
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
    return generateTagBasedMindMap(relatedMaterials, tagHierarchy, searchQuery, selectedTags);
  }
  
  // 默认使用"比赛"作为主分类
  return generateHierarchicalMindMap(materialsData, tagHierarchy, '');
};

// 生成以标签为中心的思维导图
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
  
  // 如果有选中的标签，优先使用第一个选中的标签作为中心
  if (selectedTags.length > 0) {
    centralNodeLabel = selectedTags[0];
  } 
  // 如果有搜索词但没有匹配到标签，尝试在标签层次结构中查找匹配项
  else if (searchQuery) {
    let foundInHierarchy = false;
    
    const findMatchingTag = (categories: TagCategory[]): string | null => {
      for (const category of categories) {
        if (category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return category.name;
        }
        
        if (category.children) {
          const foundInChildren = findMatchingTag(category.children);
          if (foundInChildren) return foundInChildren;
        }
      }
      return null;
    };
    
    const matchingTag = findMatchingTag(tagHierarchy);
    if (matchingTag) {
      centralNodeLabel = matchingTag;
      foundInHierarchy = true;
    }
    
    // 如果没有在层次结构中找到匹配项，但有材料标签匹配，使用出现频率最高的标签
    if (!foundInHierarchy) {
      const matchingTags = Array.from(allTagsMap.entries())
        .filter(([tag]) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b[1] - a[1]);
        
      if (matchingTags.length > 0) {
        centralNodeLabel = matchingTags[0][0];
      }
    }
  }
  
  // 创建中心节点
  const centralNode = createCentralNode(centralNodeLabel);
  nodes.push(centralNode);
  
  // 排序标签按频率
  const sortedTags = Array.from(allTagsMap.entries())
    .sort((a, b) => b[1] - a[1]) // 按频率降序
    .slice(0, 12); // 限制最多显示12个标签
  
  // 放射状布局标签节点
  const tagCount = sortedTags.length;
  sortedTags.forEach(([tag, count], index) => {
    // 如果标签是中心节点，跳过
    if (tag === centralNodeLabel) return;
    
    // 计算角度 (0 到 2π)
    const angle = (Math.PI * 2 * index) / tagCount;
    const radius = 250; // 到中心的距离
    
    const position = {
      x: centralNode.position.x + Math.cos(angle) * radius,
      y: centralNode.position.y + Math.sin(angle) * radius
    };
    
    const nodeId = `tag-${index}`;
    const tagMaterials = materials.filter(m => m.tags && m.tags.includes(tag));
    
    const node = createTagNode(
      nodeId,
      `${tag} (${count})`,
      position,
      true,
      [centralNodeLabel, tag],
      1
    );
    
    // 存储相关的材料列表
    node.data.materials = tagMaterials;
    
    nodes.push(node);
    
    // 连接中心到标签节点
    edges.push(createEdge('central', nodeId, false, true, 1));
    
    // 如果该标签关联的材料较少，直接显示材料节点
    if (tagMaterials.length > 0 && tagMaterials.length <= 3) {
      tagMaterials.forEach((material, matIndex) => {
        // 计算材料节点位置
        const matAngle = angle + (Math.PI * (matIndex - 1) / 6); // 微调角度，使材料分散
        const matRadius = 150; // 材料节点到标签节点的距离
        
        const matPosition = {
          x: position.x + Math.cos(matAngle) * matRadius,
          y: position.y + Math.sin(matAngle) * matRadius
        };
        
        const matNodeId = `material-${tag}-${matIndex}`;
        const matNode = createMaterialNode(matNodeId, material, matPosition);
        nodes.push(matNode);
        
        // 连接标签到材料节点
        edges.push(createEdge(nodeId, matNodeId, false, false, 2));
      });
    }
  });
  
  return { nodes, edges };
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
          const matAngle = secondAngle + (Math.PI * (matIndex - 0.5) / 6); // 微调角度，使材料分散
          const matRadius = 80; // 材料节点到二级标签节点的距离
          
          const matPosition = {
            x: secondPosition.x + Math.cos(matAngle) * matRadius,
            y: secondPosition.y + Math.sin(matAngle) * matRadius
          };
          
          const matNodeId = `material-${secondIndex}-${matIndex}`;
          const matNode = createMaterialNode(matNodeId, material, matPosition);
          nodes.push(matNode);
          
          // 连接二级标签到材料节点
          edges.push(createEdge(secondNodeId, matNodeId, false, false, 3));
        });
        
        // 存储相关的材料列表，用于点击节点时显示
        secondNode.data.materials = tagMaterials;
      });
    }
    
    // 存储一级节点相关的材料
    const firstLevelMaterials = materials.filter(m => 
      m.tags && m.tags.includes(category.name)
    );
    node.data.materials = firstLevelMaterials;
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
