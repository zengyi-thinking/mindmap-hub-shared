import { Edge, Node } from '@xyflow/react';
import { TagCategory } from '@/types/materials';
import { MindMapData, MindMapGeneratorOptions, TagsHierarchy, NodeLevel } from './types';
import { createCentralNode, createTagNode, createMaterialNode } from './nodeCreators';
import { createEdgeByLevel } from './edgeCreators';
import { Material } from '@/types/materials';

// 节点间距常量 - 增加间距以避免重叠
const LEVEL_HEIGHT_GAP = 250; // 不同层级之间的垂直间距
const SIBLING_WIDTH_GAP = 300; // 同级节点之间的水平间距
const MIN_NODE_WIDTH = 120; // 最小节点宽度
const NODE_PADDING = 30; // 节点间的额外空间

/**
 * 估计节点宽度 - 根据文本长度动态计算
 */
function estimateNodeWidth(label: string, baseWidth: number): number {
  // 根据文本长度动态调整宽度，中文字符计为2倍宽度
  let textLength = 0;
  for (let i = 0; i < label.length; i++) {
    // 检查是否是中文字符（Unicode范围）
    const code = label.charCodeAt(i);
    if (code >= 0x4E00 && code <= 0x9FFF) {
      textLength += 2; // 中文字符
    } else {
      textLength += 1; // 英文或其他字符
    }
  }
  
  // 计算估计宽度，确保最小宽度
  return Math.max(baseWidth, MIN_NODE_WIDTH + (textLength * 8));
}

/**
 * 根据搜索关键词和标签生成分层树状思维导图
 */
export function generateHierarchicalMindMap(options: MindMapGeneratorOptions): MindMapData {
  const { searchQuery, selectedTags, materialsData, tagHierarchy } = options;
  const nodes = [];
  const edges = [];

  // 查找与搜索条件匹配的材料
  let directMatchMaterials: any[] = [];
  if (searchQuery) {
    directMatchMaterials = materialsData.filter(material => 
      (material.title && material.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (material.file && material.file.name && material.file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // 获取唯一的标签集合
  const uniqueTags = new Set<string>();
  
  // 1. 首先添加直接匹配材料的标签
  directMatchMaterials.forEach(material => {
    if (material.tags) {
      material.tags.forEach(tag => uniqueTags.add(tag));
    }
  });
  
  // 2. 如果选择了标签，添加这些标签
  if (selectedTags && selectedTags.length > 0) {
    selectedTags.forEach(tag => uniqueTags.add(tag));
  }
  
  // 3. 如果没有直接匹配和选择的标签，则从所有材料中收集标签
  if (uniqueTags.size === 0) {
    materialsData.forEach(material => {
      if (material.tags) {
        material.tags.forEach(tag => uniqueTags.add(tag));
      }
    });
  }

  // 如果有搜索关键词，将其作为中心节点
  const centralNodeId = 'central';
  const centralLabel = searchQuery || '全部资料';
  
  // 估计中心节点的宽度
  const centralWidth = estimateNodeWidth(centralLabel, 180);
  
  // 创建中心节点
  const centralNode = createCentralNode(
    centralNodeId,
    centralLabel,
    { x: 0, y: 0 },
    centralWidth,  // 动态宽度
    70    // 高度
  );
  nodes.push(centralNode);

  // 确定一级标签节点数量
  const filteredTags = Array.from(uniqueTags)
    .filter(tag => selectedTags.length === 0 || selectedTags.includes(tag));
  
  // 限制标签数量，避免图表过于复杂
  const maxFirstLevelTags = Math.min(filteredTags.length, 8);
  const displayedTags = filteredTags.slice(0, maxFirstLevelTags);
  
  // 如果搜索到的是特定文件，且没有相关标签，创建一个直接的材料节点
  if (searchQuery && directMatchMaterials.length > 0 && displayedTags.length === 0) {
    // 对于每个直接匹配的材料，创建一个一级节点
    directMatchMaterials.slice(0, 5).forEach((material, index) => {
      const materialNodeId = `direct-material-${material.id}`;
      const angle = ((Math.PI * 2) / Math.min(directMatchMaterials.length, 5)) * index;
      const radius = 250; // 直接连接到中心节点的半径
      
      const xPosition = Math.cos(angle) * radius;
      const yPosition = Math.sin(angle) * radius;
      
      const nodeWidth = estimateNodeWidth(material.title, 150);
      
      const materialNode = createMaterialNode(
        materialNodeId,
        material.title,
        material.id,
        { x: xPosition, y: yPosition },
        1, // 一级节点
        nodeWidth,
        60
      );
      nodes.push(materialNode);
      
      // 连接中心节点和材料节点
      edges.push(createEdgeByLevel(centralNodeId, materialNodeId, 0));
      
      // 如果材料有标签，为每个标签创建二级节点
      if (material.tags && material.tags.length > 0) {
        const materialTags = material.tags.slice(0, 3); // 限制每个材料最多显示3个标签
        materialTags.forEach((tag, tagIndex) => {
          const tagNodeId = `tag-from-material-${material.id}-${tag}`;
          
          // 计算标签节点的角度和位置
          const tagAngleSpread = Math.PI / 3; // 标签在材料节点周围分布的角度范围
          const tagAngleOffset = ((tagIndex - (materialTags.length - 1) / 2) / 
                                  Math.max(1, materialTags.length - 1)) * tagAngleSpread;
          const tagAngle = angle + tagAngleOffset;
          
          // 从材料节点扇出标签节点
          const tagRadius = 150;
          const tagXPosition = xPosition + Math.cos(tagAngle) * tagRadius;
          const tagYPosition = yPosition + Math.sin(tagAngle) * tagRadius;
          
          const tagWidth = estimateNodeWidth(tag, 120);
          
          const tagNode = createTagNode(
            tagNodeId,
            tag,
            { x: tagXPosition, y: tagYPosition },
            2, // 二级节点
            tagWidth,
            50
          );
          nodes.push(tagNode);
          
          // 连接材料节点和标签节点
          edges.push(createEdgeByLevel(materialNodeId, tagNodeId, 1));
          
          // 查找与该标签相关的其他材料
          const relatedMaterials = materialsData.filter(m => 
            m.id !== material.id && m.tags && m.tags.includes(tag)
          ).slice(0, 2); // 每个标签最多显示2个相关材料
          
          if (relatedMaterials.length > 0) {
            relatedMaterials.forEach((relatedMaterial, relMatIndex) => {
              const relatedMatNodeId = `related-material-${relatedMaterial.id}-from-${tag}`;
              
              // 计算相关材料节点的位置，在标签节点周围扇出
              const relMatAngle = tagAngle + (relMatIndex === 0 ? -0.3 : 0.3); // 左右分布
              const relMatRadius = 120;
              const relMatXPosition = tagXPosition + Math.cos(relMatAngle) * relMatRadius;
              const relMatYPosition = tagYPosition + Math.sin(relMatAngle) * relMatRadius;
              
              const relMatWidth = estimateNodeWidth(relatedMaterial.title, 100);
              
              const relatedMatNode = createMaterialNode(
                relatedMatNodeId,
                relatedMaterial.title,
                relatedMaterial.id,
                { x: relMatXPosition, y: relMatYPosition },
                3, // 三级节点
                relMatWidth,
                40
              );
              nodes.push(relatedMatNode);
              
              // 连接标签节点和相关材料节点
              edges.push(createEdgeByLevel(tagNodeId, relatedMatNodeId, 2));
            });
          }
        });
      }
    });
    
    return { nodes, edges };
  }
  
  // 计算一级节点的位置布局 - 放射状布局
  const totalTags = displayedTags.length;
  
  // 圆周布局
  if (totalTags >= 6) {
    // 计算圆的半径，考虑到节点的大小
    const radius = 350; // 较大的半径，给节点足够空间
    
    displayedTags.forEach((tag, index) => {
      const tagNodeId = `tag-${tag}`;
      
      // 计算角度，均匀分布在圆周上，偏移以避免在正上方和正下方
      const angle = ((2 * Math.PI) / totalTags) * index - Math.PI / 2;
      
      // 计算位置
      const xPosition = Math.cos(angle) * radius;
      const yPosition = Math.sin(angle) * radius;
      
      // 估计节点宽度
      const nodeWidth = estimateNodeWidth(tag, 150);
      
      // 创建标签节点
      const tagNode = createTagNode(
        tagNodeId,
        tag,
        { x: xPosition, y: yPosition },
        1, // NodeLevel.FIRST
        nodeWidth,  // 动态宽度
        60    // 高度
      );
      nodes.push(tagNode);
      
      // 创建连接线
      edges.push(createEdgeByLevel(centralNodeId, tagNodeId, 0));
      
      // 查找与该标签相关的所有材料
      const relatedMaterials = materialsData.filter(material => 
        material.tags && material.tags.includes(tag)
      );
      
      // 如果在搜索特定材料，优先显示匹配的材料
      let displayMaterials = relatedMaterials;
      if (searchQuery) {
        // 按匹配度排序
        displayMaterials = displayMaterials.sort((a, b) => {
          const aMatchesTitle = a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase());
          const bMatchesTitle = b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase());
          const aMatchesFileName = a.file && a.file.name && a.file.name.toLowerCase().includes(searchQuery.toLowerCase());
          const bMatchesFileName = b.file && b.file.name && b.file.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          if ((aMatchesTitle || aMatchesFileName) && !(bMatchesTitle || bMatchesFileName)) {
            return -1;
          } else if (!(aMatchesTitle || aMatchesFileName) && (bMatchesTitle || bMatchesFileName)) {
            return 1;
          }
          return 0;
        });
      }
      
      // 限制每个标签的材料数量
      const maxMaterialsPerTag = 4;
      displayMaterials = displayMaterials.slice(0, maxMaterialsPerTag);
      
      // 如果有相关材料，创建二级节点
      if (displayMaterials.length > 0) {
        // 创建扇形布局的二级节点
        const materialRadius = 180; // 从标签节点到材料节点的距离
        const materialAngleSpread = Math.PI / 4; // 材料节点在标签节点周围分布的角度范围
        
        displayMaterials.forEach((material, matIndex) => {
          const materialNodeId = `material-${material.id}`;
          
          // 计算材料节点的角度偏移
          const materialAngleOffset = ((matIndex - (displayMaterials.length - 1) / 2) / 
                                       Math.max(1, displayMaterials.length - 1)) * materialAngleSpread;
          const materialAngle = angle + materialAngleOffset;
          
          // 计算材料节点的位置
          const matXPosition = xPosition + Math.cos(materialAngle) * materialRadius;
          const matYPosition = yPosition + Math.sin(materialAngle) * materialRadius;
          
          // 估计节点宽度
          const matNodeWidth = estimateNodeWidth(material.title, 130);
          
          // 创建材料节点
          const materialNode = createMaterialNode(
            materialNodeId,
            material.title,
            material.id,
            { x: matXPosition, y: matYPosition },
            2, // NodeLevel.SECOND
            matNodeWidth,  // 动态宽度
            50    // 高度
          );
          nodes.push(materialNode);
          
          // 连接标签节点和材料节点
          edges.push(createEdgeByLevel(tagNodeId, materialNodeId, 1));
        });
      }
    });
  } else if (totalTags > 0) {
    // 对于少量标签，使用线性垂直布局
    // 计算一级节点的总高度
    const firstLevelTotalHeight = totalTags * LEVEL_HEIGHT_GAP;
    const firstLevelStartY = -firstLevelTotalHeight / 2 + LEVEL_HEIGHT_GAP / 2;
    
    displayedTags.forEach((tag, index) => {
      const tagNodeId = `tag-${tag}`;
      const xPosition = SIBLING_WIDTH_GAP; // 固定水平距离
      const yPosition = firstLevelStartY + index * LEVEL_HEIGHT_GAP;
      
      // 估计节点宽度
      const nodeWidth = estimateNodeWidth(tag, 150);
      
      // 创建标签节点
      const tagNode = createTagNode(
        tagNodeId,
        tag,
        { x: xPosition, y: yPosition },
        1, // NodeLevel.FIRST
        nodeWidth,  // 动态宽度
        60    // 高度
      );
      nodes.push(tagNode);
      
      // 创建连接线
      edges.push(createEdgeByLevel(centralNodeId, tagNodeId, 0));
      
      // 查找与该标签相关的所有材料
      const relatedMaterials = materialsData.filter(material => 
        material.tags && material.tags.includes(tag)
      );
      
      // 如果在搜索特定材料，优先显示匹配的材料
      let displayMaterials = relatedMaterials;
      if (searchQuery) {
        // 按匹配度排序
        displayMaterials = displayMaterials.sort((a, b) => {
          const aMatchesTitle = a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase());
          const bMatchesTitle = b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase());
          const aMatchesFileName = a.file && a.file.name && a.file.name.toLowerCase().includes(searchQuery.toLowerCase());
          const bMatchesFileName = b.file && b.file.name && b.file.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          if ((aMatchesTitle || aMatchesFileName) && !(bMatchesTitle || bMatchesFileName)) {
            return -1;
          } else if (!(aMatchesTitle || aMatchesFileName) && (bMatchesTitle || bMatchesFileName)) {
            return 1;
          }
          return 0;
        });
      }
      
      // 限制每个标签的材料数量
      const maxMaterialsPerTag = 4;
      displayMaterials = displayMaterials.slice(0, maxMaterialsPerTag);
      
      // 如果有相关材料，创建二级节点
      if (displayMaterials.length > 0) {
        // 计算二级节点的总高度
        const secondLevelTotalHeight = displayMaterials.length * (LEVEL_HEIGHT_GAP / 1.5);
        const secondLevelStartY = yPosition - secondLevelTotalHeight / 2 + LEVEL_HEIGHT_GAP / 3;
        
        displayMaterials.forEach((material, matIndex) => {
          const materialNodeId = `material-${material.id}`;
          const matXPosition = xPosition + SIBLING_WIDTH_GAP;
          const matYPosition = secondLevelStartY + matIndex * (LEVEL_HEIGHT_GAP / 1.5);
          
          // 估计节点宽度
          const matNodeWidth = estimateNodeWidth(material.title, 130);
          
          // 创建材料节点
          const materialNode = createMaterialNode(
            materialNodeId,
            material.title,
            material.id,
            { x: matXPosition, y: matYPosition },
            2, // NodeLevel.SECOND
            matNodeWidth,  // 动态宽度
            50    // 高度
          );
          nodes.push(materialNode);
          
          // 连接标签节点和材料节点
          edges.push(createEdgeByLevel(tagNodeId, materialNodeId, 1));
        });
      }
    });
  } else if (searchQuery && directMatchMaterials.length === 0) {
    // 如果搜索没有找到直接匹配的材料，但有搜索词，创建一个信息节点
    const infoNodeId = 'info-no-materials';
    const infoNode = createTagNode(
      infoNodeId,
      `没有找到与"${searchQuery}"匹配的资料`,
      { x: 300, y: 0 },
      1,
      200,
      60
    );
    nodes.push(infoNode);
    edges.push(createEdgeByLevel(centralNodeId, infoNodeId, 0));
  }

  return { nodes, edges };
} 