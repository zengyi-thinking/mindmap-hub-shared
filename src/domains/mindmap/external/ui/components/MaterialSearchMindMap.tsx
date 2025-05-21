// MaterialMermaidMindMap 组件

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Grid3X3, Calendar, FileType, ZoomIn, ZoomOut, RefreshCw, GitBranch } from 'lucide-react';
import MermaidMindMap from './MermaidMindMap';
import { TagCategory, Material } from '@/modules/materials/types/materials';
import { escapeMermaidText } from '../../utils/mermaidGenerator';
import { 
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  MarkerType
} from '@/components/ui/react-flow-mock';

// 视图模式类型
type ViewMode = 'category' | 'date' | 'fileType';
// 显示类型
type DisplayType = 'mermaid' | 'reactflow';

interface MaterialMermaidMindMapProps {
  /**
   * 资料数据数组
   */
  materials: Material[];
  /**
   * 分类数据
   */
  categories: TagCategory[];
  /**
   * 点击节点时的回调
   */
  onNodeClick?: (nodeData: string[]) => void;
  /**
   * 自定义CSS类名
   */
  className?: string;
  /**
   * 直接传入的定义
   */
  definition?: string;
}

// 从资料获取名称
const getMaterialName = (material: Material): string => {
  return material.title || 
    material.fileName || 
    material.file?.name || 
    '未命名资料';
};

/**
 * 生成按分类的Mermaid思维导图语法
 * @param categories 分类数据
 * @returns Mermaid语法字符串
 */
const generateCategoryMindmap = (categories: TagCategory[]): string => {
  if (!categories || categories.length === 0) {
    return 'mindmap\n  root((按分类))\n    ((暂无分类数据))';
  }

  let definition = 'mindmap\n  root((按分类))';

  // 递归生成分类树
  const generateCategoryTree = (categories: TagCategory[], level: number = 1) => {
    const indent = '  '.repeat(level + 1);

    categories.forEach(category => {
      definition += `\n${indent}${escapeMermaidText(category.name)}`;
      
      if (category.children && category.children.length > 0) {
        generateCategoryTree(category.children, level + 1);
      }
    });
  };

  generateCategoryTree(categories);

  return definition;
};

/**
 * 生成按日期的Mermaid思维导图语法
 * @param materials 资料数据
 * @returns Mermaid语法字符串
 */
const generateDateMindmap = (materials: Material[]): string => {
  if (!materials || materials.length === 0) {
    return 'mindmap\n  root((按日期))\n    ((暂无日期数据))';
  }

  // 按年月分组
  const dateGroups: Record<string, Record<string, Material[]>> = {};
  
  materials.forEach(material => {
    const uploadDate = material.uploadTime || material.createdAt || new Date().toISOString();
    const date = new Date(uploadDate);
    
    // 格式化年月
      const year = date.getFullYear().toString();
    const month = format(date, 'MMMM', { locale: zhCN });
      
      if (!dateGroups[year]) {
        dateGroups[year] = {};
      }
      
      if (!dateGroups[year][month]) {
        dateGroups[year][month] = [];
      }
      
      dateGroups[year][month].push(material);
  });
  
  // 生成思维导图
  let definition = 'mindmap\n  root((按日期))';
  
  // 按年份分组
  Object.keys(dateGroups).sort((a, b) => parseInt(b) - parseInt(a)).forEach(year => {
    definition += `\n    ${year}年`;
    
    // 按月份分组
    Object.keys(dateGroups[year]).forEach(month => {
      const materials = dateGroups[year][month];
      definition += `\n      ${month} (${materials.length})`;
      
      // 添加每个月的资料
      materials.forEach(material => {
        const materialName = getMaterialName(material);
        definition += `\n        ${escapeMermaidText(materialName)}`;
      });
    });
  });
  
  return definition;
};

/**
 * 生成按文件类型的Mermaid思维导图语法
 * @param materials 资料数据
 * @returns Mermaid语法字符串
 */
const generateFileTypeMindmap = (materials: Material[]): string => {
  if (!materials || materials.length === 0) {
    return 'mindmap\n  root((按文件类型))\n    ((暂无资料数据))';
  }

  // 文件类型映射
  const fileTypeMap: Record<string, string> = {
    'pdf': '文档类',
    'doc': '文档类',
    'docx': '文档类',
    'txt': '文档类', 
    'ppt': '演示类',
    'pptx': '演示类',
    'xls': '表格类',
    'xlsx': '表格类',
    'jpg': '图像类',
    'jpeg': '图像类',
    'png': '图像类',
    'gif': '图像类',
    'mp4': '视频类',
    'mp3': '音频类',
    'zip': '压缩文件',
    'rar': '压缩文件'
  };

  // 按文件类型分组
  const typeGroups: Record<string, Record<string, Material[]>> = {};
  
  materials.forEach(material => {
    if (!material.fileName && !material.file?.name) return;
    
    // 获取文件扩展名
    const filename = material.fileName || material.file?.name || '';
    const ext = filename.split('.').pop()?.toLowerCase() || '其他';
    const mainType = fileTypeMap[ext] || '其他类型';
    const subType = ext.toUpperCase();
    
    if (!typeGroups[mainType]) {
      typeGroups[mainType] = {};
    }
    
    if (!typeGroups[mainType][subType]) {
      typeGroups[mainType][subType] = [];
    }
    
    typeGroups[mainType][subType].push(material);
  });

  // 生成思维导图语法
  let definition = 'mindmap\n  root((按文件类型))';
  
  // 按主类型分组
  Object.keys(typeGroups).forEach(mainType => {
    definition += `\n    ${mainType}`;
    
    // 按子类型分组
    Object.keys(typeGroups[mainType]).forEach(subType => {
      definition += `\n      ${subType}格式`;
      
      // 添加每个类型的资料
      typeGroups[mainType][subType].forEach(material => {
        const materialName = getMaterialName(material);
        definition += `\n        ${escapeMermaidText(materialName)}`;
      });
    });
  });
  
  return definition;
};

/**
 * 生成ReactFlow树形结构数据
 * 将分类数据转换为ReactFlow所需的节点和边
 * @param categories 分类数据
 * @param viewMode 视图模式: category(分类)、date(日期)、fileType(文件类型)
 * @param materials 资料数据，当viewMode不是category时需要提供
 */
export const generateReactFlowTree = (
  categories: TagCategory[], 
  viewMode: ViewMode = 'category', 
  materials: Material[] = []
) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // 创建根节点
  const rootId = 'root';
  let rootLabel = '资料分类';
  
  // 根据视图模式设置根节点标签
  if (viewMode === 'date') {
    rootLabel = '上传时间';
  } else if (viewMode === 'fileType') {
    rootLabel = '文件类型';
  }
  
  nodes.push({
    id: rootId,
    position: { x: 0, y: 0 },
    data: { 
      label: rootLabel,
      level: 0
    },
    style: { 
      background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
      color: 'white',
      border: 'none',
      borderRadius: '15px',
      padding: '12px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      minWidth: '150px',
      textAlign: 'center',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)'
    }
  });
  
  let nodeId = 1; // 初始节点ID计数器
  
  // 基于分类视图生成树
  if (viewMode === 'category') {
    // 第一层分类的数量
    const categoryCount = categories.length;
    // 计算每个节点之间的角度
    const angleStep = (2 * Math.PI) / Math.max(categoryCount, 1);
    const firstLevelRadius = 250; // 增大第一层半径
    
    categories.forEach((category, index) => {
      // 计算节点位置，使用角度均匀分布
      const angle = index * angleStep;
      const x = Math.cos(angle) * firstLevelRadius;
      const y = Math.sin(angle) * firstLevelRadius;
      
      const levelOneId = `node-${nodeId++}`;
      
      // 第一层节点样式
      nodes.push({
        id: levelOneId,
        position: { x, y },
        data: { 
          label: category.name,
          level: 1
        },
        style: { 
          background: 'linear-gradient(135deg, #4D96FF, #6CAAFF)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 16px',
          fontSize: '15px',
          fontWeight: 'bold',
          minWidth: '120px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
        }
      });
      
      // 连接根节点和一级节点
      edges.push({
        id: `edge-${rootId}-${levelOneId}`,
        source: rootId,
        target: levelOneId,
        type: 'smoothstep',
        animated: false,
        style: { 
          stroke: '#4D96FF', 
          strokeWidth: 2,
          opacity: 0.8
        }
      });
      
      // 第二层子分类（若存在）
      if (category.children && category.children.length > 0) {
        const secondLevelCount = category.children.length;
        // 计算第二层节点的扇形角度范围
        const startAngle = angle - angleStep / 2;
        const endAngle = angle + angleStep / 2;
        const secondLevelStep = (endAngle - startAngle) / Math.max(secondLevelCount, 1);
        const secondLevelRadius = firstLevelRadius + 200; // 第二层半径
        
        category.children.forEach((subCategory, subIndex) => {
          // 计算二级节点位置
          const subAngle = startAngle + secondLevelStep * subIndex + secondLevelStep / 2;
          const subX = Math.cos(subAngle) * secondLevelRadius;
          const subY = Math.sin(subAngle) * secondLevelRadius;
          
          const levelTwoId = `node-${nodeId++}`;
          
          // 第二层节点样式
          nodes.push({
            id: levelTwoId,
            position: { x: subX, y: subY },
            data: { 
              label: subCategory.name,
              level: 2
            },
            style: { 
              background: 'linear-gradient(135deg, #9EADF0, #B6BFF7)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: 'bold',
              minWidth: '100px',
              textAlign: 'center',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
            }
          });
          
          // 连接一级和二级节点
          edges.push({
            id: `edge-${levelOneId}-${levelTwoId}`,
            source: levelOneId,
            target: levelTwoId,
            type: 'smoothstep',
            animated: false,
            style: { 
              stroke: '#9EADF0', 
              strokeWidth: 1.5,
              opacity: 0.7
            }
          });
          
          // 第三层子分类（若存在）
          if (subCategory.children && subCategory.children.length > 0) {
            const thirdLevelCount = subCategory.children.length;
            const subStartAngle = subAngle - secondLevelStep / 2;
            const subEndAngle = subAngle + secondLevelStep / 2;
            const thirdLevelStep = (subEndAngle - subStartAngle) / Math.max(thirdLevelCount, 1);
            const thirdLevelRadius = secondLevelRadius + 150; // 第三层半径
            
            subCategory.children.forEach((thirdCategory, thirdIndex) => {
              // 计算三级节点位置
              const thirdAngle = subStartAngle + thirdLevelStep * thirdIndex + thirdLevelStep / 2;
              const thirdX = Math.cos(thirdAngle) * thirdLevelRadius;
              const thirdY = Math.sin(thirdAngle) * thirdLevelRadius;
              
              const levelThreeId = `node-${nodeId++}`;
              
              // 第三层节点样式
              nodes.push({
                id: levelThreeId,
                position: { x: thirdX, y: thirdY },
                data: { 
                  label: thirdCategory.name,
                  level: 3
                },
                style: { 
                  background: 'linear-gradient(135deg, #C3D0F0, #D8E1F8)',
                  color: '#444',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 'medium',
                  minWidth: '90px',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.07)'
                }
              });
              
              // 连接二级和三级节点
              edges.push({
                id: `edge-${levelTwoId}-${levelThreeId}`,
                source: levelTwoId,
                target: levelThreeId,
                type: 'smoothstep',
                animated: false,
                style: { 
                  stroke: '#C3D0F0', 
                  strokeWidth: 1.2,
                  opacity: 0.6
                }
              });
            });
          }
        });
      }
    });
  } 
  // 基于日期视图生成树
  else if (viewMode === 'date') {
    // 按日期分组资料
    const dateGroups: Record<string, Material[]> = {};
    
    materials.forEach(material => {
      const date = material.createdAt ? new Date(material.createdAt) : new Date();
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!dateGroups[yearMonth]) {
        dateGroups[yearMonth] = [];
      }
      
      dateGroups[yearMonth].push(material);
    });
    
    // 第一层：年月节点
    const sortedDates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a)); // 降序排序
    const dateCount = sortedDates.length;
    const angleStep = (2 * Math.PI) / Math.max(dateCount, 1);
    const firstLevelRadius = 250;
    
    sortedDates.forEach((date, index) => {
      const angle = index * angleStep;
      const x = Math.cos(angle) * firstLevelRadius;
      const y = Math.sin(angle) * firstLevelRadius;
      
      const materials = dateGroups[date];
      const levelOneId = `node-${nodeId++}`;
      
      // 年月节点
      nodes.push({
        id: levelOneId,
        position: { x, y },
        data: { 
          label: `${date} (${materials.length})`,
          level: 1
        },
        style: { 
          background: 'linear-gradient(135deg, #4D96FF, #6CAAFF)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 16px',
          fontSize: '15px',
          fontWeight: 'bold',
          minWidth: '140px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
        }
      });
      
      // 连接根节点和年月节点
      edges.push({
        id: `edge-${rootId}-${levelOneId}`,
        source: rootId,
        target: levelOneId,
        type: 'smoothstep',
        animated: false,
        style: { 
          stroke: '#4D96FF', 
          strokeWidth: 2,
          opacity: 0.8
        }
      });
      
      // 第二层：文件节点
      if (materials.length > 0) {
        const materialCount = materials.length;
        // 计算文件节点的扇形角度范围
        const startAngle = angle - angleStep / 2;
        const endAngle = angle + angleStep / 2;
        const materialStep = (endAngle - startAngle) / Math.max(materialCount, 1);
        const secondLevelRadius = firstLevelRadius + 200;
        
        materials.forEach((material, matIndex) => {
          const matAngle = startAngle + materialStep * matIndex + materialStep / 2;
          const matX = Math.cos(matAngle) * secondLevelRadius;
          const matY = Math.sin(matAngle) * secondLevelRadius;
          
          const levelTwoId = `node-${nodeId++}`;
          
          // 文件节点
          nodes.push({
            id: levelTwoId,
            position: { x: matX, y: matY },
            data: { 
              label: material.name || '未命名文件',
              level: 2
            },
            style: { 
              background: 'linear-gradient(135deg, #9EADF0, #B6BFF7)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: 'medium',
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              maxWidth: '150px'
            }
          });
          
          // 连接年月节点和文件节点
          edges.push({
            id: `edge-${levelOneId}-${levelTwoId}`,
            source: levelOneId,
            target: levelTwoId,
            type: 'smoothstep',
            animated: false,
            style: { 
              stroke: '#9EADF0', 
              strokeWidth: 1.5,
              opacity: 0.7
            }
          });
        });
      }
    });
  } 
  // 基于文件类型视图生成树
  else if (viewMode === 'fileType') {
    // 按文件类型分组资料
    const typeGroups: Record<string, Material[]> = {};
    
    materials.forEach(material => {
      let type = '其他';
      
      if (material.file && material.file.name) {
        const extension = material.file.name.split('.').pop()?.toLowerCase();
        
        if (extension) {
          switch (extension) {
            case 'pdf':
              type = 'PDF文档';
              break;
            case 'doc':
            case 'docx':
              type = 'Word文档';
              break;
            case 'xls':
            case 'xlsx':
              type = 'Excel表格';
              break;
            case 'ppt':
            case 'pptx':
              type = 'PPT演示';
              break;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
              type = '图片';
              break;
            default:
              type = `${extension.toUpperCase()}文件`;
          }
        }
      }
      
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      
      typeGroups[type].push(material);
    });
    
    // 第一层：文件类型节点
    const fileTypes = Object.keys(typeGroups);
    const typeCount = fileTypes.length;
    const angleStep = (2 * Math.PI) / Math.max(typeCount, 1);
    const firstLevelRadius = 250;
    
    fileTypes.forEach((type, index) => {
      const angle = index * angleStep;
      const x = Math.cos(angle) * firstLevelRadius;
      const y = Math.sin(angle) * firstLevelRadius;
      
      const materials = typeGroups[type];
      const levelOneId = `node-${nodeId++}`;
      
      // 文件类型节点
      nodes.push({
        id: levelOneId,
        position: { x, y },
        data: { 
          label: `${type} (${materials.length})`,
          level: 1
        },
        style: { 
          background: 'linear-gradient(135deg, #4D96FF, #6CAAFF)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 16px',
          fontSize: '15px',
          fontWeight: 'bold',
          minWidth: '140px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
        }
      });
      
      // 连接根节点和文件类型节点
      edges.push({
        id: `edge-${rootId}-${levelOneId}`,
        source: rootId,
        target: levelOneId,
        type: 'smoothstep',
        animated: false,
        style: { 
          stroke: '#4D96FF', 
          strokeWidth: 2,
          opacity: 0.8
        }
      });
      
      // 第二层：文件节点
      if (materials.length > 0) {
        const materialCount = materials.length;
        // 计算文件节点的扇形角度范围
        const startAngle = angle - angleStep / 2;
        const endAngle = angle + angleStep / 2;
        const materialStep = (endAngle - startAngle) / Math.max(materialCount, 1);
        const secondLevelRadius = firstLevelRadius + 200;
        
        materials.forEach((material, matIndex) => {
          const matAngle = startAngle + materialStep * matIndex + materialStep / 2;
          const matX = Math.cos(matAngle) * secondLevelRadius;
          const matY = Math.sin(matAngle) * secondLevelRadius;
          
          const levelTwoId = `node-${nodeId++}`;
          
          // 文件节点
          nodes.push({
            id: levelTwoId,
            position: { x: matX, y: matY },
            data: { 
              label: material.name || '未命名文件',
              level: 2
            },
            style: { 
              background: 'linear-gradient(135deg, #9EADF0, #B6BFF7)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: 'medium',
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              maxWidth: '150px'
            }
          });
          
          // 连接文件类型节点和文件节点
          edges.push({
            id: `edge-${levelOneId}-${levelTwoId}`,
            source: levelOneId,
            target: levelTwoId,
            type: 'smoothstep',
            animated: false,
            style: { 
              stroke: '#9EADF0', 
              strokeWidth: 1.5,
              opacity: 0.7
            }
          });
        });
      }
    });
  }
  
  return { nodes, edges };
};

/**
 * 基于Mermaid的资料思维导图组件
 * 支持按分类、日期、文件类型三种模式查看资料
 * 支持Mermaid和ReactFlow两种视图模式
 */
export const MaterialMermaidMindMap: React.FC<MaterialMermaidMindMapProps> = ({
  materials,
  categories,
  onNodeClick,
  className,
  definition
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [displayType, setDisplayType] = useState<DisplayType>('mermaid');
  const [loading, setLoading] = useState(false);
  const [mermaidDefinition, setMermaidDefinition] = useState<string>(definition || '');
  const [reactFlowElements, setReactFlowElements] = useState<{nodes: any[], edges: any[]}>({ nodes: [], edges: [] });
  const [zoom, setZoom] = useState(100);

  // 使用传入的定义或根据视图模式生成思维导图定义
  useEffect(() => {
    setLoading(true);
    
    try {
      // 如果有直接传入的definition，优先使用
      if (definition) {
        setMermaidDefinition(definition);
      } else {
        // 根据视图模式生成Mermaid图定义
        let generatedDefinition = '';
      switch (viewMode) {
        case 'category':
            generatedDefinition = generateCategoryMindmap(categories);
          break;
        case 'date':
            generatedDefinition = generateDateMindmap(materials);
          break;
        case 'fileType':
            generatedDefinition = generateFileTypeMindmap(materials);
          break;
        }
        setMermaidDefinition(generatedDefinition);
      }
      
      // 生成ReactFlow图数据
      setReactFlowElements(generateReactFlowTree(categories, viewMode, materials));
      
    } catch (error) {
      console.error('生成思维导图时出错:', error);
      setMermaidDefinition('mindmap\n  root((数据处理出错))\n    出错原因\n      请检查数据格式');
    }
    
    setLoading(false);
  }, [viewMode, categories, materials, displayType, definition]);
  
  // 处理视图模式切换
  const handleViewModeChange = (value: string) => {
    setViewMode(value as ViewMode);
  };
  
  // 处理显示类型切换
  const toggleDisplayType = () => {
    setDisplayType(prev => prev === 'mermaid' ? 'reactflow' : 'mermaid');
  };

  // 处理节点点击
  const handleNodeClick = (nodeId: string, nodeText: string) => {
    if (!onNodeClick || nodeId === 'mermaid-diagram' || nodeText.includes('暂无数据') || nodeText.includes('出错')) {
      return;
    }
    
    // 提取节点路径
    const parts = nodeText.split(' > ').map(part => part.trim().replace(/\s*\(\d+\)$/, ''));
    onNodeClick(parts);
  };
  
  // 处理ReactFlow节点点击
  const handleReactFlowNodeClick = (event: React.MouseEvent, node: any) => {
    if (!onNodeClick) return;
    onNodeClick([node.data.label]);
  };
  
  // 放大
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  // 缩小
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  // 重置缩放
  const resetZoom = () => {
    setZoom(100);
  };

  return (
    <div className={`material-mermaid-mindmap ${className || ''}`}>
      <style>
        {`
          /* 确保连接线可见 */
          .react-flow__edge {
            transition: all 0.3s ease;
          }
          
          .react-flow__edge:hover {
            stroke-width: 3px !important;
            opacity: 1 !important;
          }
          
          .react-flow__node {
            transition: all 0.3s ease;
          }
          
          .react-flow__node:hover {
            transform: scale(1.05);
            z-index: 10;
          }
          
          .react-flow__controls {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .react-flow__controls button {
            background: white;
            border: none;
            color: #4D96FF;
            transition: background-color 0.2s ease;
          }
          
          .react-flow__controls button:hover {
            background-color: rgba(77, 150, 255, 0.1);
          }
          
          /* Mermaid相关增强样式 */
          .mindmap-container .edge path,
          .mindmap-container .edgeLabel path,
          .mindmap-container .marker path {
            stroke: #666 !important;
            stroke-width: 1.5px !important;
            fill: none;
          }
          
          .mindmap-container .node circle,
          .mindmap-container .node rect,
          .mindmap-container .node ellipse,
          .mindmap-container .node polygon {
            stroke: #666 !important;
            stroke-width: 1.5px !important;
          }
          
          .mindmap-container .node:hover {
            cursor: pointer;
            opacity: 0.85;
          }
          
          /* 连接线动画效果 */
          @keyframes dash {
            from { stroke-dashoffset: 24; }
            to { stroke-dashoffset: 0; }
          }
          
          .react-flow__edge-animated path {
            stroke-dasharray: 5, 5 !important;
            animation: dash 1s linear infinite !important;
          }
        `}
      </style>
      
      <div className="mb-4 flex justify-between items-center">
        {!definition && (
          <Tabs 
            value={viewMode} 
            onValueChange={handleViewModeChange} 
            className="w-auto"
          >
          <TabsList>
              <TabsTrigger value="category" className="flex items-center gap-1">
                <Grid3X3 className="h-4 w-4" />
              <span>按分类</span>
            </TabsTrigger>
              <TabsTrigger value="date" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>按时间</span>
            </TabsTrigger>
              <TabsTrigger value="fileType" className="flex items-center gap-1">
                <FileType className="h-4 w-4" />
              <span>按类型</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDisplayType}
            className="flex items-center gap-1"
          >
            <GitBranch className="h-4 w-4" />
            {displayType === 'mermaid' ? '切换到树状视图' : '切换到思维导图'}
          </Button>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={zoomOut}
              className="h-8 w-8 p-0" 
              title="缩小"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{zoom}%</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={zoomIn}
              className="h-8 w-8 p-0" 
              title="放大"
            >
              <ZoomIn className="h-4 w-4" />
          </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetZoom}
              className="h-8 w-8 p-0" 
              title="重置"
            >
              <RefreshCw className="h-4 w-4" />
          </Button>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px] border rounded-md overflow-hidden bg-white">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : displayType === 'mermaid' ? (
            <MermaidMindMap 
              definition={mermaidDefinition}
              onNodeClick={handleNodeClick}
              zoom={zoom}
              height="400px"
            />
        ) : (
          <div style={{ height: '400px', width: '100%', position: 'relative' }}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
              <div className="absolute bottom-[15%] right-[10%] w-40 h-40 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>
            </div>
            
            <ReactFlow
              nodes={reactFlowElements.nodes}
              edges={reactFlowElements.edges}
              onNodeClick={handleReactFlowNodeClick}
              fitView
              minZoom={0.2}
              maxZoom={2}
              defaultZoom={0.6}
            >
              <Background
                variant={"dots" as BackgroundVariant}
                gap={20}
                size={1}
                color="#f0f0f0"
              />
              <Controls />
            </ReactFlow>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialMermaidMindMap;
