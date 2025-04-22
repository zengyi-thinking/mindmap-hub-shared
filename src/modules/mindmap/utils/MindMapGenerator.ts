import { Node, Edge, MarkerType } from '@xyflow/react';
import { TagCategory } from '@/modules/materials/types/materials';

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
        (material.tags && material.tags.some((tag: string) => 
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
  
  // 默认生成层次结构思维导图
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
  
  // 对标签进行排序 - 按出现频率
  const sortedTags = Array.from(allTagsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // 创建中心节点 - 使用搜索查询或选中的标签
  let centralLabel = '';
  if (searchQuery) {
    centralLabel = `"${searchQuery}"的相关内容`;
  } else if (selectedTags.length > 0) {
    centralLabel = selectedTags.join(' + ');
  } else {
    centralLabel = '知识地图';
  }
  
  const centralNode = createCentralNode(centralLabel);
  nodes.push(centralNode);
  
  // 查找标签分类匹配
  const findMatchingTag = (categories: TagCategory[]): string | null => {
    for (const category of categories) {
      if (category.name.toLowerCase() === searchQuery.toLowerCase()) {
        return category.name;
      }
      
      if (category.subcategories) {
        const found = findMatchingTag(category.subcategories);
        if (found) return found;
      }
    }
    return null;
  };
  
  // 确定要显示多少个标签节点
  const maxTagsToShow = Math.min(sortedTags.length, 10);
  
  // 计算标签节点的位置 - 围绕中心节点
  const radius = 300;
  const angleStep = (2 * Math.PI) / maxTagsToShow;
  
  // 添加标签节点
  for (let i = 0; i < maxTagsToShow; i++) {
    const tag = sortedTags[i];
    const angle = i * angleStep;
    
    const position = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
    
    const tagNode = createTagNode(
      `tag-${i}`, 
      tag, 
      position, 
      true, 
      [tag], 
      1
    );
    nodes.push(tagNode);
    
    // 连接中心节点和标签节点
    edges.push(createEdge('central', `tag-${i}`, false, true));
    
    // 为每个标签添加相关的材料节点
    const tagMaterials = materials.filter(material => 
      material.tags && material.tags.includes(tag)
    );
    
    // 限制每个标签下显示的材料数量
    const maxMaterialsPerTag = 3;
    const materialsToShow = tagMaterials.slice(0, maxMaterialsPerTag);
    
    // 计算材料节点的位置 - 围绕标签节点
    const materialRadius = 150;
    const materialAngleStep = (Math.PI / 2) / (maxMaterialsPerTag + 1);
    const baseAngle = angle - Math.PI / 4;
    
    for (let j = 0; j < materialsToShow.length; j++) {
      const material = materialsToShow[j];
      const materialAngle = baseAngle + ((j + 1) * materialAngleStep);
      
      const materialPosition = {
        x: position.x + materialRadius * Math.cos(materialAngle),
        y: position.y + materialRadius * Math.sin(materialAngle)
      };
      
      const materialNode = createMaterialNode(
        `material-${tag}-${j}`, 
        material, 
        materialPosition
      );
      nodes.push(materialNode);
      
      // 连接标签节点和材料节点
      edges.push(createEdge(`tag-${i}`, `material-${tag}-${j}`, false, false, 2));
    }
  }
  
  return { nodes, edges };
};

// 生成基于层次结构的思维导图
export const generateHierarchicalMindMap = (
  materials: any[],
  tagHierarchy: TagCategory[],
  searchQuery: string = ''
): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 创建中心节点
  const centralNode = createCentralNode(searchQuery || '知识地图');
  nodes.push(centralNode);
  
  // 如果标签层次结构不存在，返回只有中心节点的思维导图
  if (!tagHierarchy || tagHierarchy.length === 0) {
    return { nodes, edges };
  }
  
  // 查找匹配的分类
  const findMatchingCategory = (cat: TagCategory): TagCategory | null => {
    if (cat.name.toLowerCase() === searchQuery.toLowerCase()) {
      return cat;
    }
    
    if (cat.subcategories) {
      for (const subCat of cat.subcategories) {
        const found = findMatchingCategory(subCat);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  // 从标签层次结构中生成节点
  const radius = 300;
  const angleBetweenCategories = (2 * Math.PI) / tagHierarchy.length;
  
  tagHierarchy.forEach((category, index) => {
    const angle = index * angleBetweenCategories;
    const position = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    };
    
    // 创建主分类节点
    const categoryId = `category-${index}`;
    const categoryNode = createTagNode(
      categoryId, 
      category.name, 
      position, 
      false, 
      [category.name], 
      1
    );
    nodes.push(categoryNode);
    
    // 连接中心节点和分类节点
    edges.push(createEdge('central', categoryId, false, true));
    
    // 如果有子分类，递归添加
    if (category.subcategories && category.subcategories.length > 0) {
      // 计算子分类的位置 - 围绕主分类节点
      const subRadius = 200;
      const subAngleBetween = Math.PI / (category.subcategories.length + 1);
      const baseAngle = angle - Math.PI / 2;
      
      category.subcategories.forEach((subCategory, subIndex) => {
        const subAngle = baseAngle + ((subIndex + 1) * subAngleBetween);
        const subPosition = {
          x: position.x + subRadius * Math.cos(subAngle),
          y: position.y + subRadius * Math.sin(subAngle)
        };
        
        const subCategoryId = `subcategory-${index}-${subIndex}`;
        const subCategoryNode = createTagNode(
          subCategoryId, 
          subCategory.name, 
          subPosition, 
          !subCategory.subcategories || subCategory.subcategories.length === 0, 
          [category.name, subCategory.name], 
          2
        );
        nodes.push(subCategoryNode);
        
        // 连接主分类和子分类
        edges.push(createEdge(categoryId, subCategoryId, false, false, 2));
        
        // 查找与此子分类相关的材料
        const relatedMaterials = materials.filter(material => 
          material.tags && material.tags.includes(subCategory.name)
        );
        
        // 限制每个子分类下显示的材料数量
        const maxMaterialsPerSubcat = 2;
        const materialsToShow = relatedMaterials.slice(0, maxMaterialsPerSubcat);
        
        if (materialsToShow.length > 0) {
          // 计算材料节点的位置 - 围绕子分类节点
          const materialRadius = 150;
          const materialAngleBetween = Math.PI / 4 / (maxMaterialsPerSubcat + 1);
          const materialBaseAngle = subAngle - Math.PI / 8;
          
          materialsToShow.forEach((material, matIndex) => {
            const materialAngle = materialBaseAngle + ((matIndex + 1) * materialAngleBetween);
            const materialPosition = {
              x: subPosition.x + materialRadius * Math.cos(materialAngle),
              y: subPosition.y + materialRadius * Math.sin(materialAngle)
            };
            
            const materialId = `material-${index}-${subIndex}-${matIndex}`;
            const materialNode = createMaterialNode(materialId, material, materialPosition);
            nodes.push(materialNode);
            
            // 连接子分类和材料节点
            edges.push(createEdge(subCategoryId, materialId, false, false, 3));
          });
        }
        
        // 如果有更深层的子分类，也可以递归添加，但这里限制到两层
      });
    }
    
    // 如果没有子分类，直接添加与此分类相关的材料
    else {
      const relatedMaterials = materials.filter(material => 
        material.tags && material.tags.includes(category.name)
      );
      
      // 限制显示的材料数量
      const maxMaterialsPerCat = 3;
      const materialsToShow = relatedMaterials.slice(0, maxMaterialsPerCat);
      
      if (materialsToShow.length > 0) {
        // 计算材料节点的位置 - 围绕分类节点
        const materialRadius = 180;
        const materialAngleBetween = Math.PI / 2 / (maxMaterialsPerCat + 1);
        const materialBaseAngle = angle - Math.PI / 4;
        
        materialsToShow.forEach((material, matIndex) => {
          const materialAngle = materialBaseAngle + ((matIndex + 1) * materialAngleBetween);
          const materialPosition = {
            x: position.x + materialRadius * Math.cos(materialAngle),
            y: position.y + materialRadius * Math.sin(materialAngle)
          };
          
          const materialId = `material-${index}-direct-${matIndex}`;
          const materialNode = createMaterialNode(materialId, material, materialPosition);
          nodes.push(materialNode);
          
          // 连接分类和材料节点
          edges.push(createEdge(categoryId, materialId, false, false, 2));
        });
      }
    }
  });
  
  return { nodes, edges };
};

// 获取一个分类及其所有子分类中的所有标签
function getAllTagsInCategory(category: TagCategory): string[] {
  let tags = [category.name];
  
  if (category.subcategories && category.subcategories.length > 0) {
    category.subcategories.forEach(subcat => {
      tags = [...tags, ...getAllTagsInCategory(subcat)];
    });
  }
  
  return tags;
} 
