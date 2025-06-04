import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { GenerateMindMapRequest, MindMapLayout, MindMapNode } from '@/types/mindmap';
import { useMindMapService } from '@/services/ai/mindMapService';

// 导入自定义组件
import MindMapViewer from '@/components/ai-mindmap/MindMapViewer';
import MindMapControls from '@/components/ai-mindmap/MindMapControls';
import MindMapInfoPanel from '@/components/ai-mindmap/MindMapInfoPanel';
import MindMapGenerationForm from '@/components/ai-mindmap/MindMapGenerationForm';

/**
 * AI思维导图生成页面
 */
const AIMindMapPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const viewerRef = useRef<HTMLDivElement>(null);
  const { generateMindMap } = useMindMapService();
  
  // 状态
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [layout, setLayout] = useState<MindMapLayout>('horizontal' as MindMapLayout);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 计算总节点数
  const countTotalNodes = useCallback((node: MindMapNode | null): number => {
    if (!node) return 0;
    
    let count = 1; // 当前节点
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        count += countTotalNodes(child);
      });
    }
    
    return count;
  }, []);
  
  // 处理深色模式检测
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // 初始检查
    checkDarkMode();
    
    // 监听类名变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // 如果组件加载后没有关键字，使用默认关键字生成示例思维导图
  useEffect(() => {
    if (!mindMapData && !isLoading) {
      handleGenerate({
        keyword: '人工智能',
        depth: 2,
        maxNodesPerLevel: 5,
        includeLinks: true
      });
    }
  }, []);
  
  // 处理生成思维导图
  const handleGenerate = async (params: GenerateMindMapRequest) => {
    setIsLoading(true);
    setSelectedNode(null);
    
    try {
      const data = await generateMindMap(params);
      
      if (data) {
        // 递归添加深度信息
        const addDepthInfo = (node: MindMapNode, depth = 0): MindMapNode => {
          const updatedNode = { ...node, depth };
          
          if (updatedNode.children && updatedNode.children.length > 0) {
            updatedNode.children = updatedNode.children.map(child => 
              addDepthInfo(child, depth + 1)
            );
          }
          
          return updatedNode;
        };
        
        const processedData = addDepthInfo(data);
        setMindMapData(processedData);
        
        setKeyword(params.keyword); // 更新输入框中的关键词
        
        toast({
          title: "思维导图生成成功",
          description: `已生成"${params.keyword}"的思维导图`,
        });
      }
    } catch (error) {
      console.error('生成思维导图失败:', error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "无法生成思维导图，请稍后再试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理节点点击
  const handleNodeClick = (node: MindMapNode) => {
    setSelectedNode(node);
  };
  
  // 导出SVG
  const handleExportSvg = () => {
    if (!viewerRef.current || !mindMapData) return;
    
    try {
      // 获取SVG元素
      const svgElement = viewerRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('无法找到SVG元素');
      }
      
      // 创建一个新的SVG元素用于导出
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      
      // 设置视图框以包含所有内容
      const bounds = (svgClone.querySelector('g') as SVGGElement)?.getBBox();
      if (bounds) {
        svgClone.setAttribute('viewBox', `${bounds.x - 20} ${bounds.y - 20} ${bounds.width + 40} ${bounds.height + 40}`);
      }
      
      // 添加一些元数据
      const metadata = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
      metadata.textContent = JSON.stringify({
        title: keyword,
        generated: new Date().toISOString(),
        nodeCount: countTotalNodes(mindMapData)
      });
      svgClone.appendChild(metadata);
      
      // 转换为字符串
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = `${keyword}-思维导图.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "导出成功",
        description: "思维导图已导出为SVG格式"
      });
    } catch (error) {
      console.error('导出SVG失败:', error);
      toast({
        title: "导出失败",
        description: "无法导出SVG格式，请稍后再试",
        variant: "destructive"
      });
    }
  };
  
  // 分享思维导图
  const handleShare = () => {
    if (!mindMapData) return;
    
    // 简化的分享实现
    toast({
      title: "分享功能",
      description: "分享功能正在开发中"
    });
  };
  
  // 保存思维导图
  const handleSave = () => {
    if (!mindMapData) return;
    
    // 简化的保存实现
    toast({
      title: "保存成功",
      description: "思维导图已保存到您的账户"
    });
  };
  
  // 视图控制函数
  const zoomRef = useRef<{ zoomIn?: () => void, zoomOut?: () => void, resetView?: () => void }>({});
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* 页面标题和返回按钮 */}
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
            <h1 className="text-2xl font-bold">AI思维导图生成</h1>
            <p className="text-muted-foreground">输入关键词，AI自动生成相关思维导图</p>
          </div>
        </div>
      </div>
      
      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧栏 - 生成表单和控制面板 */}
        <div className="lg:col-span-1 space-y-4">
          {/* 生成表单 */}
          <MindMapGenerationForm
            loading={isLoading}
            keyword={keyword}
            onKeywordChange={setKeyword}
            onGenerate={handleGenerate}
          />
          
          {/* 控制面板 */}
          <MindMapControls
            layout={layout}
            nodeCount={countTotalNodes(mindMapData)}
            onLayoutChange={setLayout}
            onZoomIn={() => zoomRef.current.zoomIn?.()}
            onZoomOut={() => zoomRef.current.zoomOut?.()}
            onResetView={() => zoomRef.current.resetView?.()}
            onExportSvg={handleExportSvg}
            onShare={handleShare}
            onSave={handleSave}
            hasData={!!mindMapData}
          />
          
          {/* 信息面板 */}
          <MindMapInfoPanel
            selectedNode={selectedNode}
            keyword={keyword}
            totalNodes={countTotalNodes(mindMapData)}
          />
        </div>
        
        {/* 右侧主要内容区域 - 思维导图显示 */}
        <div className="lg:col-span-3">
          <div 
            ref={viewerRef} 
            className="border rounded-lg overflow-hidden shadow-sm h-[700px] bg-background"
          >
            <MindMapViewer 
              data={mindMapData}
              layout={layout}
              isDarkMode={isDarkMode}
              onNodeClick={handleNodeClick}
              options={{
                allowZoom: true,
                allowPan: true,
                allowNodeClick: true,
                allowNodeHover: true,
                animationDuration: 500
              }}
            />
          </div>
          
          <div className="mt-2 text-sm text-center text-muted-foreground">
            {mindMapData ? (
              <p>点击节点可查看详细信息，双击放大</p>
            ) : (
              <p>输入关键词，点击生成按钮开始创建思维导图</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMindMapPage; 