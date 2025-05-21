import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, Upload, Maximize, RefreshCw, ZoomIn, ZoomOut, GitBranch } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaterialFolderNavigation from '@/modules/materials/components/MaterialFolderNavigation';
import MaterialPreviewDialog from '@/modules/materials/components/MaterialPreviewDialog';
import MaterialUploadDialog from '@/modules/materials/components/MaterialUploadDialog';
import { useMaterialUpload } from '@/modules/materials/hooks/useMaterialUpload';
import { useMaterialPreview } from '@/modules/materials/hooks/useMaterialPreview';
import { userFilesService } from '@/lib/storage';
import { tagHierarchy } from '@/data/tagHierarchy';
import { MaterialMermaidMindMap } from '@/domains/mindmap';
import { TagCategory } from '@/modules/materials/types/materials';
// 创建临时Material接口以匹配当前使用
interface Material {
  id: string | number;
  name?: string;
  title?: string;
  fileName?: string;
  tags?: string[];
  createdAt?: string;
  uploadTime?: string;
  file?: {
    name?: string;
  };
}
import { 
  generateCategoryMindmap,
  generateDateMindmap,
  generateFileTypeMindmap
} from '@/domains/mindmap/external/utils/mermaidGenerator';
import { ReactFlow, Background, Controls, BackgroundVariant } from '@/components/ui/react-flow-mock';

// 视图模式类型
type ViewMode = 'category' | 'date' | 'fileType';

const GlobalMaterialMap: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allMaterials, setAllMaterials] = useState<any[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('category');
  const [mermaidDefinition, setMermaidDefinition] = useState<string>('');
  const [folderMaterials, setFolderMaterials] = useState<any[]>([]);
  const [zoom, setZoom] = useState(100);
  const [displayType, setDisplayType] = useState<'mermaid' | 'reactflow'>('mermaid');
  const [reactFlowElements, setReactFlowElements] = useState<{nodes: any[], edges: any[]}>({ nodes: [], edges: [] });
  
  // 加载所有材料数据
  useEffect(() => {
    const materials = userFilesService.getApprovedFiles();
    setAllMaterials(materials);
    
    // 生成分类数据
    const convertToTagCategories = (tags: any[]): TagCategory[] => {
      return tags.map((tag: any, index: number) => ({
        id: `tag-${index}`,
        name: tag.name,
        children: tag.children ? convertToTagCategories(tag.children) : undefined
      }));
    };
    
    const categoryData = convertToTagCategories(tagHierarchy);
    setCategories(categoryData);
  }, []);
  
  // 使用资料预览hooks
  const {
    selectedMaterial,
    previewOpen,
    openPreview,
    closePreview,
    downloadMaterial
  } = useMaterialPreview();
  
  // 从材料数据生成思维导图
  useEffect(() => {
    // 根据视图模式生成思维导图定义
    try {
      // 生成Mermaid图定义
      let definition = '';
      switch (viewMode) {
        case 'category':
          // 使用MaterialMermaidMindMap中的逻辑生成分类思维导图
          definition = `mindmap
  root((资料分类))
${generateCategoryTree(categories)}`;
          break;
        case 'date':
          // 按日期分组资料
          const dateGroups = groupByDate(allMaterials);
          definition = `mindmap
  root((上传时间))
${generateDateTree(dateGroups)}`;
          break;
        case 'fileType':
          // 按文件类型分组资料
          const typeGroups = groupByType(allMaterials);
          definition = `mindmap
  root((文件类型))
${generateTypeTree(typeGroups)}`;
          break;
      }
      setMermaidDefinition(definition);
      
      // 生成ReactFlow图数据
      import('@/domains/mindmap/external/ui/components/MaterialSearchMindMap').then(module => {
        if (typeof module.generateReactFlowTree === 'function') {
          const reactFlowData = module.generateReactFlowTree(categories, viewMode, allMaterials);
          setReactFlowElements(reactFlowData);
        }
      }).catch(error => {
        console.error('加载 ReactFlow 数据生成函数失败:', error);
        // 生成简单的错误图
        setReactFlowElements({
          nodes: [
            {
              id: 'root',
              position: { x: 0, y: 0 },
              data: { label: '加载错误' },
              style: { background: '#ffdddd' }
            }
          ],
          edges: []
        });
      });
    } catch (error) {
      console.error('生成思维导图时出错:', error);
      setMermaidDefinition('mindmap\n  root((数据处理出错))\n    出错原因\n      请检查数据格式');
      setReactFlowElements({
        nodes: [
          {
            id: 'root',
            position: { x: 0, y: 0 },
            data: { label: '数据处理出错' },
            style: { background: '#ffdddd' }
          }
        ],
        edges: []
      });
    }
  }, [viewMode, categories, allMaterials]);
  
  // 调整容器高度，为ReactFlow视图提供更多空间
  useEffect(() => {
    if (displayType === 'reactflow') {
      // 如果是ReactFlow视图，需要更多空间
      const container = document.querySelector('.mindmap-container');
      if (container) {
        container.classList.add('reactflow-view');
      }
    } else {
      // 如果是Mermaid视图，恢复默认高度
      const container = document.querySelector('.mindmap-container');
      if (container) {
        container.classList.remove('reactflow-view');
      }
    }
  }, [displayType]);
  
  // 切换显示类型
  const toggleDisplayType = () => {
    setDisplayType(prev => {
      const newType = prev === 'mermaid' ? 'reactflow' : 'mermaid';
      // 重置缩放比例
      if (newType === 'reactflow') {
        setZoom(100); // ReactFlow有自己的缩放控制
      }
      return newType;
    });
  };
  
  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string, nodeText: string) => {
    if (nodeId === 'mermaid-diagram' || nodeText.includes('暂无数据') || nodeText.includes('出错')) {
      return;
    }
    
    // 提取节点文本（移除可能的计数信息）
    const nodeName = nodeText.replace(/\s*\(\d+\)$/, '');
    
    if (nodeName === '资料分类' || nodeName === '上传时间' || nodeName === '文件类型') {
      // 点击根节点重置当前路径
      setCurrentPath([]);
      return;
    }
    
    // 点击分类节点时添加到当前路径
    setCurrentPath(prev => [...prev, nodeName]);
    
    // 在这里可以加载该分类下的资料
    const relatedMaterials = allMaterials.filter(material => 
      material.tags && material.tags.includes(nodeName)
    );
    
    // 设置当前文件夹的资料
    setFolderMaterials(relatedMaterials);
  }, [allMaterials]);
  
  // 导航到指定文件夹
  const navigateTo = useCallback((path: string[]) => {
    setCurrentPath(path);
  }, []);
  
  // 搜索处理
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // 放大缩小控制
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };
  
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };
  
  const resetZoom = () => {
    setZoom(100);
  };
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    selectedFile,
    setSelectedFile,
    uploadProgress,
    isUploading,
    showUploadForm,
    handleOpenUploadForm,
    closeUploadForm,
    handleUpload
  } = useMaterialUpload(currentPath, () => {
    // 刷新当前文件夹的资料
    const materials = userFilesService.getApprovedFiles();
    setAllMaterials(materials);
  });
  
  // 以下是辅助函数，用于生成Mermaid图
  const generateCategoryTree = (categories: TagCategory[], level: number = 1): string => {
    let result = '';
    categories.forEach(category => {
      const indent = '  '.repeat(level);
      result += `${indent}${category.name}\n`;
      
      if (category.children && category.children.length > 0) {
        result += generateCategoryTree(category.children, level + 1);
      }
    });
    return result;
  };
  
  const groupByDate = (materials: Material[]): Record<string, Material[]> => {
    const groups: Record<string, Material[]> = {};
    
    materials.forEach(material => {
      const date = material.createdAt ? new Date(material.createdAt) : new Date();
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      
      groups[yearMonth].push(material);
    });
    
    return groups;
  };
  
  const generateDateTree = (groups: Record<string, Material[]>): string => {
    let result = '';
    
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a)); // 降序排序
    
    sortedDates.forEach(date => {
      const materials = groups[date];
      result += `  ${date} (${materials.length})\n`;
      
      materials.forEach(material => {
        result += `    ${material.name || '未命名文件'}\n`;
      });
    });
    
    return result;
  };
  
  const groupByType = (materials: Material[]): Record<string, Material[]> => {
    const groups: Record<string, Material[]> = {};
    
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
      
      if (!groups[type]) {
        groups[type] = [];
      }
      
      groups[type].push(material);
    });
    
    return groups;
  };
  
  const generateTypeTree = (groups: Record<string, Material[]>): string => {
    let result = '';
    
    Object.keys(groups).forEach(type => {
      const materials = groups[type];
      result += `  ${type} (${materials.length})\n`;
      
      materials.forEach(material => {
        result += `    ${material.name || '未命名文件'}\n`;
      });
    });
    
    return result;
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* 添加 ReactFlow 相关的样式 */}
      <style>
        {`
          /* ReactFlow 节点样式 */
          .react-flow__node {
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          .react-flow__node:hover {
            transform: scale(1.05);
            z-index: 10;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          }
          
          /* 连接线样式 */
          .react-flow__edge {
            transition: stroke-width 0.2s, opacity 0.2s;
          }
          
          .react-flow__edge:hover {
            stroke-width: 3px !important;
            opacity: 1 !important;
          }
          
          /* 控制器样式 */
          .react-flow__controls {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          
          .react-flow__controls button {
            background-color: white;
            border: none;
            box-shadow: none;
            color: #333;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            transition: background-color 0.2s;
          }
          
          .react-flow__controls button:hover {
            background-color: #f0f0f0;
          }
          
          /* 背景样式 */
          .react-flow__background {
            opacity: 0.5;
          }
          
          /* 视口样式，保证全屏显示 */
          .react-flow-viewport {
            width: 100%;
            height: 100%;
          }
          
          /* ReactFlow 容器样式 */
          .reactflow-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            background-color: rgba(250, 250, 255, 0.8);
            border-radius: 8px;
            overflow: hidden;
          }
          
          /* Mermaid 思维导图连接线样式修复 */
          .mindmap-container svg {
            overflow: visible !important;
          }
          
          .mindmap-container .edge path,
          .mindmap-container .edgePath path {
            stroke: #999 !important;
            stroke-width: 1.5px !important;
            opacity: 1 !important;
          }
          
          .mindmap-container .edgeLabel rect {
            opacity: 0.8 !important;
          }
          
          .mindmap-container .node rect,
          .mindmap-container .node circle,
          .mindmap-container .node polygon,
          .mindmap-container .node ellipse {
            stroke-width: 1.5px !important;
            fill-opacity: 1 !important;
          }
          
          /* 确保线段渲染 */
          .mindmap-container line {
            stroke: #999 !important;
            stroke-width: 1.5px !important;
            opacity: 1 !important;
          }
          
          /* 改进思维导图节点可读性 */
          .mindmap-container .nodeLabel {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            fill: #333;
            font-weight: 500;
          }
          
          /* 修复marker箭头 */
          .mindmap-container marker path {
            fill: #999 !important;
            stroke: none !important;
          }
          
          /* 连接线动画效果 */
          @keyframes dash {
            from { stroke-dashoffset: 24; }
            to { stroke-dashoffset: 0; }
          }
          
          .mindmap-container .edge.animated path {
            stroke-dasharray: 5, 5 !important;
            animation: dash 1s linear infinite !important;
          }
        `}
      </style>
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/material-search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">全平台资料导图</h1>
            <p className="text-muted-foreground">浏览、搜索和上传共享资料</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索资料..."
              className="pl-9"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button 
            onClick={handleOpenUploadForm}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            上传资料
          </Button>
        </div>
      </div>
      
      {/* 导图模式选择 */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          当前模式: {viewMode === 'category' ? '分类视图' : viewMode === 'date' ? '时间视图' : '类型视图'}
          {displayType === 'reactflow' && ' (树状图)'}
        </p>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={displayType === 'reactflow' ? "default" : "outline"}
            size="sm"
            onClick={toggleDisplayType}
            className="flex items-center gap-1"
          >
            <GitBranch className="h-4 w-4 mr-1" />
            {displayType === 'mermaid' ? '切换到树状图' : '切换到思维导图'}
          </Button>
          
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as ViewMode)}
          >
            <TabsList>
              <TabsTrigger value="category">
                按分类
              </TabsTrigger>
              <TabsTrigger value="date">
                按时间
              </TabsTrigger>
              <TabsTrigger value="fileType">
                按类型
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 左侧导航区域 */}
        <MaterialFolderNavigation
          currentPath={currentPath}
          folderMaterials={folderMaterials}
          navigateTo={navigateTo}
          setCurrentPath={setCurrentPath}
          openPreview={openPreview}
          downloadMaterial={downloadMaterial}
          handleOpenUploadForm={handleOpenUploadForm}
        />
        
        {/* 右侧思维导图区域 */}
        <div className={`xl:col-span-3 mindmap-container ${displayType === 'reactflow' ? 'h-[700px]' : 'h-[600px]'} bg-white border rounded-md shadow-sm overflow-hidden transition-all duration-300`}>
          <div className="flex items-center justify-between p-3 border-b">
            <div>
              <h3 className="font-medium">资料导图 - {
                viewMode === 'category' ? '分类视图' :
                viewMode === 'date' ? '时间视图' : '类型视图'
              } {displayType === 'reactflow' ? '(树状结构)' : ''}</h3>
            </div>
            
            <div className="flex items-center gap-1">
              {displayType === 'mermaid' && (
                <>
                  <Button variant="outline" size="sm" onClick={zoomOut} title="缩小">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="mx-1 text-sm font-mono">{zoom}%</span>
                  <Button variant="outline" size="sm" onClick={zoomIn} title="放大">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetZoom} title="重置视图">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className={`${displayType === 'reactflow' ? 'h-[calc(100%-52px)]' : 'h-[calc(100%-52px)]'} overflow-auto p-2`}>
            <div style={{ 
              zoom: displayType === 'mermaid' ? `${zoom}%` : '100%', 
              transformOrigin: 'center center',
              height: displayType === 'reactflow' ? '100%' : 'auto'
            }}>
              {displayType === 'mermaid' ? (
                <MaterialMermaidMindMap 
                  definition={mermaidDefinition}
                  materials={allMaterials}
                  categories={categories}
                  onNodeClick={(paths) => {
                    if (paths && paths.length > 0) {
                      setCurrentPath(paths);
                      // 查找相关资料
                      const lastPath = paths[paths.length - 1];
                      const relatedMaterials = allMaterials.filter(material => 
                        material.tags && material.tags.includes(lastPath)
                      );
                      setFolderMaterials(relatedMaterials);
                    }
                  }}
                  className="w-full h-full"
                />
              ) : (
                <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
                    <div className="absolute bottom-[15%] right-[10%] w-40 h-40 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>
                  </div>
                  
                  <ReactFlow
                    nodes={reactFlowElements.nodes}
                    edges={reactFlowElements.edges}
                    onNodeClick={(event, node) => {
                      if (node && node.data && node.data.label) {
                        const nodeName = node.data.label;
                        if (nodeName === '资料分类' || nodeName === '上传时间' || nodeName === '文件类型') {
                          // 点击根节点重置当前路径
                          setCurrentPath([]);
                        } else {
                          // 点击分类节点时添加到当前路径
                          setCurrentPath([nodeName]);
                          
                          // 在这里可以加载该分类下的资料
                          const relatedMaterials = allMaterials.filter(material => 
                            material.tags && material.tags.includes(nodeName)
                          );
                          
                          // 设置当前文件夹的资料
                          setFolderMaterials(relatedMaterials);
                        }
                      }
                    }}
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
        </div>
      </div>
      
      {/* 资料预览对话框 */}
      <MaterialPreviewDialog
        open={previewOpen}
        onClose={closePreview}
        material={selectedMaterial}
      />
      
      {/* 资料上传对话框 */}
      <MaterialUploadDialog
        open={showUploadForm}
        onClose={closeUploadForm}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        uploadProgress={uploadProgress}
        isUploading={isUploading}
        onUpload={handleUpload}
        currentPath={currentPath}
      />
    </div>
  );
};

export default GlobalMaterialMap; 
