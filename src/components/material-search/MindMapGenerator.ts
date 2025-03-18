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
      isRoot: true
    },
    position: { x: 100, y: 300 },
    style: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      borderRadius: '12px',
      border: 'none',
      width: 130,
      height: 80,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      padding: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
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
  
  // 多个元素时，计算垂直分布
  const totalHeight = 150 * (totalItems - 1);
  const startY = centerY - totalHeight / 2;
  
  return {
    x: centerX + distance,
    y: startY + index * 150
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
      return {
        background: 'hsl(180, 70%, 85%)',
        border: '1px solid hsl(180, 70%, 60%)',
        borderRadius: '16px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      };
    }
    
    // Different colors for different levels
    const colors = {
      1: {
        bg: 'hsl(210, 90%, 95%)',
        border: 'hsl(210, 90%, 80%)',
      },
      2: {
        bg: 'hsl(260, 90%, 95%)',
        border: 'hsl(260, 90%, 80%)',
      },
      3: {
        bg: 'hsl(330, 90%, 95%)',
        border: 'hsl(330, 90%, 80%)',
      },
    };
    
    const levelColors = colors[level as keyof typeof colors] || colors[1];
    
    return {
      background: levelColors.bg,
      border: `1px solid ${levelColors.border}`,
      borderRadius: '16px',
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: 'normal',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    };
  };

  return {
    id,
    data: {
      label,
      tagName: label,
      isLastLevel,
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
      materialId: material.id
    },
    position,
    style: {
      background: 'white',
      border: '1px solid hsl(var(--primary) / 0.2)',
      borderRadius: '8px',
      padding: '8px',
      fontSize: '12px',
      width: 130,
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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
  // Different colors for different levels
  const colors = {
    1: 'hsl(210, 90%, 60%)',
    2: 'hsl(260, 90%, 60%)',
    3: 'hsl(330, 90%, 60%)',
  };
  
  const edgeColor = colors[level as keyof typeof colors] || colors[1];

  return {
    id: `edge-${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    animated,
    style: { 
      stroke: animated ? 'hsl(var(--primary) / 0.8)' : edgeColor,
      strokeWidth: animated ? 2 : 1.5
    },
    ...(withArrow ? {
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color: 'hsl(var(--primary))',
      }
    } : {}),
    type: 'smoothstep',
  };
};

// Process custom tags with no hierarchy
const processCustomTag = (
  tag: string,
  tagIndex: number,
  materialsData: any[],
  totalTags: number,
  centerX: number = 400,
  centerY: number = 300
): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Create tag node
  const tagNodePosition = calculateNodePosition(centerX, centerY, 250, tagIndex, totalTags);
  const tagNodeId = `custom-${tagIndex}`;
  const tagNode = createTagNode(tagNodeId, tag, tagNodePosition, true);
  nodes.push(tagNode);
  
  // Create edge from central to tag
  edges.push(createEdge('central', tagNodeId, true, true));
  
  // Find related materials
  const relatedMaterials = materialsData.filter(m => 
    m.tags && m.tags.includes(tag)
  );
  
  // Create nodes and edges for related materials
  relatedMaterials.forEach((material, materialIndex) => {
    const materialPosition = {
      x: tagNodePosition.x + 150 * Math.cos((materialIndex + 0.5) * Math.PI / 2),
      y: tagNodePosition.y + 150 * Math.sin((materialIndex + 0.5) * Math.PI / 2)
    };
    
    const materialNodeId = `material-custom-${tagIndex}-${materialIndex}`;
    const materialNode = createMaterialNode(materialNodeId, material, materialPosition);
    nodes.push(materialNode);
    
    edges.push(createEdge(tagNodeId, materialNodeId));
  });
  
  return { nodes, edges };
};

// Process tags with hierarchy
const processHierarchicalTag = (
  tag: string,
  tagIndex: number,
  tagHierarchy: TagCategory[],
  materialsData: any[],
  totalTags: number,
  centerX: number = 400,
  centerY: number = 300
): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const tagPath = findTagPath(tagHierarchy, tag);
  let lastLevelNodeIds: string[] = ['central'];
  
  tagPath.forEach((pathTag, pathIndex) => {
    const isLastLevel = pathIndex === tagPath.length - 1;
    const levelNodeId = `level-${tagIndex}-${pathIndex}`;
    
    const levelNodePosition = calculateNodePosition(
      centerX, 
      centerY, 
      (pathIndex + 1) * 180, 
      tagIndex, 
      totalTags
    );
    
    const levelNode = createTagNode(
      levelNodeId, 
      pathTag, 
      levelNodePosition, 
      isLastLevel,
      tagPath.slice(0, pathIndex + 1),
      pathIndex + 1
    );
    
    nodes.push(levelNode);
    
    lastLevelNodeIds.forEach(sourceId => {
      edges.push(createEdge(sourceId, levelNodeId, pathIndex === 0, pathIndex === 0, pathIndex + 1));
    });
    
    if (isLastLevel) {
      const relatedMaterials = materialsData.filter(m => {
        if (!m.tags || m.tags.length === 0) return false;
        return m.tags.includes(pathTag);
      });
      
      relatedMaterials.forEach((material, materialIndex) => {
        const materialPosition = {
          x: levelNodePosition.x + 150 * Math.cos((materialIndex + 0.5) * Math.PI / 2), 
          y: levelNodePosition.y + 150 * Math.sin((materialIndex + 0.5) * Math.PI / 2) 
        };
        
        const materialNodeId = `material-${tagIndex}-${pathIndex}-${materialIndex}`;
        const materialNode = createMaterialNode(materialNodeId, material, materialPosition);
        
        nodes.push(materialNode);
        edges.push(createEdge(levelNodeId, materialNodeId, false, false, pathIndex + 1));
      });
    }
    
    lastLevelNodeIds = [levelNodeId];
  });
  
  return { nodes, edges };
};

// Main function to generate the mindmap
export const generateMindMap = (options: MindMapGeneratorOptions): { nodes: Node[], edges: Edge[] } => {
  const { searchQuery, selectedTags, materialsData, tagHierarchy } = options;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Add central node
  const centralNode = createCentralNode(searchQuery);
  nodes.push(centralNode);
  
  // Determine which tags to process
  const tagsToProcess = selectedTags.length > 0 
    ? selectedTags 
    : materialsData.length > 0 && materialsData[0]?.tags 
      ? materialsData[0].tags.slice(0, 3) 
      : ['比赛', '数学建模', '比赛规则'];
  
  // Process each tag
  tagsToProcess.forEach((tag, tagIndex) => {
    const tagPath = findTagPath(tagHierarchy, tag);
    
    if (tagPath.length === 0) {
      // Process custom tag (no hierarchy)
      const { nodes: customNodes, edges: customEdges } = processCustomTag(
        tag, 
        tagIndex, 
        materialsData, 
        tagsToProcess.length
      );
      
      nodes.push(...customNodes);
      edges.push(...customEdges);
    } else {
      // Process hierarchical tag
      const { nodes: hierarchyNodes, edges: hierarchyEdges } = processHierarchicalTag(
        tag, 
        tagIndex, 
        tagHierarchy, 
        materialsData, 
        tagsToProcess.length
      );
      
      nodes.push(...hierarchyNodes);
      edges.push(...hierarchyEdges);
    }
  });
  
  return { nodes, edges };
};
