import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, LayoutTemplate, RefreshCw, Maximize, FileDown, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { MindMapNode, MindMapLayout } from '@/types/mindmap';
import { useNLPMindMapService } from '@/services/ai/nlpMindMapService';

// 导入自定义组件
import MindMapViewer from '@/components/ai-mindmap/MindMapViewer';
import MindMapControls from '@/components/ai-mindmap/MindMapControls';
import MindMapInfoPanel from '@/components/ai-mindmap/MindMapInfoPanel';
import MaterialFolderNavigation from '@/components/ai-mindmap/MaterialFolderNavigation';
import MindMapConnector from '@/components/ai-mindmap/MindMapConnector';

/**
 * NLP思维导图生成页面
 */
const NLPMindMapPage: React.FC = () => {
  console.log("NLPMindMapPage 组件开始渲染");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const viewerRef = useRef<HTMLDivElement>(null);
  const { generateMindMapFromText } = useNLPMindMapService();
  
  // 状态
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [layout, setLayout] = useState<MindMapLayout>('radial');
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [depth, setDepth] = useState(3);
  const [maxNodesPerLevel, setMaxNodesPerLevel] = useState(5);
  const [relatedFolders, setRelatedFolders] = useState<string[]>([]);
  const [renderError, setRenderError] = useState<string | null>(null);

  // 示例文本
  const exampleTexts = [
    '深度学习中的注意力机制已经成为现代机器学习模型的关键组成部分，特别是在自然语言处理和计算机视觉领域。注意力机制允许模型集中于输入的特定部分，类似于人类视觉中的选择性注意力。自注意力机制（Self-attention）进一步推动了这一概念，使模型能够在单个序列内建立元素间的关联。Transformer架构利用多头自注意力机制（Multi-head self-attention）处理序列数据，已成为现代语言模型如BERT、GPT系列和T5等的基础。',
    '可持续发展是指在满足当代人需求的同时，不损害后代人满足其需求能力的发展模式。它包括三个相互关联的支柱：经济发展、社会包容和环境保护。联合国在2015年制定了17个可持续发展目标（SDGs），旨在到2030年解决全球面临的经济、社会和环境挑战。气候变化、资源枯竭、生物多样性丧失和社会不平等是当前可持续发展面临的主要挑战。',
    '区块链技术是一种分布式账本技术，通过去中心化、不可篡改的方式记录交易和数据。它最初作为比特币的底层技术而出现，但现在已经扩展到金融、供应链、医疗保健和身份验证等众多领域。区块链通过共识机制（如工作量证明或权益证明）确保网络安全和交易验证。智能合约是自动执行的程序，使区块链能够支持去中心化应用（DApps）和去中心化金融（DeFi）等创新应用。'
  ];
  
  // 添加错误边界
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("页面渲染错误:", error);
      setRenderError(`渲染错误: ${error.message}`);
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  // 使用useEffect确保组件已经挂载
  useEffect(() => {
    console.log("NLPMindMapPage 已挂载");
    
    // 初始化页面时显示一个提示
    toast({
      title: "AI思维导图已准备就绪",
      description: "请输入文本内容生成思维导图",
    });
    
    // 设置示例文本以便于用户开始使用
    setInputText(exampleTexts[0]);
  }, []);
  
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
  React.useEffect(() => {
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
  
  // 处理生成思维导图
  const handleGenerate = async () => {
    console.log("触发生成思维导图按钮");
    
    if (!inputText.trim()) {
      toast({
        title: "请输入文本内容",
        description: "请输入要分析的文本内容以生成思维导图",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setSelectedNode(null);
    setRelatedFolders([]);
    
    try {
      console.log("调用生成服务...");
      const data = await generateMindMapFromText(inputText, depth, maxNodesPerLevel);
      console.log("生成服务返回数据:", data);
      
      if (data) {
        setMindMapData(data);
        
        // 生成相关的示例文件夹路径
        generateRelatedFolders(data.name);
        
        toast({
          title: "思维导图生成成功",
          description: `已生成"${data.name}"的思维导图`,
        });
      } else {
        console.error("生成服务返回空数据");
        toast({
          title: "生成失败",
          description: "服务返回空数据，请稍后再试",
          variant: "destructive"
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
  
  // 生成相关文件夹路径（示例数据）
  const generateRelatedFolders = (keyword: string) => {
    // 这里是示例实现，实际应用中应根据关键词查询相关文件夹
    const mockFolders = [];
    
    // 基于关键词生成示例文件夹路径
    const topics = keyword.split(/\s+/).filter(Boolean);
    
    if (topics.includes('学习') || topics.includes('教育')) {
      mockFolders.push('/materials/courses/learning');
      mockFolders.push('/materials/references/education');
    }
    
    if (topics.includes('人工智能') || topics.includes('AI') || topics.includes('机器学习')) {
      mockFolders.push('/materials/tech/ai');
      mockFolders.push('/materials/courses/machine-learning');
      mockFolders.push('/materials/research/deep-learning');
    }
    
    if (topics.includes('编程') || topics.includes('代码')) {
      mockFolders.push('/materials/code/examples');
      mockFolders.push('/materials/tutorials/programming');
    }
    
    if (topics.includes('数据') || topics.includes('分析')) {
      mockFolders.push('/materials/data/datasets');
      mockFolders.push('/materials/projects/data-analysis');
    }
    
    // 如果没有匹配，添加一些默认文件夹
    if (mockFolders.length === 0) {
      mockFolders.push('/materials/general');
      mockFolders.push('/materials/references');
      mockFolders.push(`/materials/topics/${keyword.toLowerCase().replace(/\s+/g, '-')}`);
    }
    
    console.log("生成的相关文件夹:", mockFolders);
    setRelatedFolders(mockFolders);
  };
  
  // 使用示例文本
  const useExampleText = (index: number) => {
    if (index >= 0 && index < exampleTexts.length) {
      setInputText(exampleTexts[index]);
    }
  };
  
  // 处理节点点击
  const handleNodeClick = (node: MindMapNode) => {
    console.log("点击节点:", node);
    setSelectedNode(node);
    
    // 当点击节点时，生成与节点相关的文件夹路径
    if (node) {
      const nodeFolders = [];
      
      // 这里也是示例实现，根据节点名称生成相关文件夹路径
      const nodeName = node.name.toLowerCase();
      
      if (nodeName.includes('技术') || nodeName.includes('开发')) {
        nodeFolders.push(`/materials/tech/${nodeName.replace(/\s+/g, '-')}`);
        nodeFolders.push(`/materials/programming/${nodeName.replace(/\s+/g, '-')}`);
      } else if (nodeName.includes('概念') || nodeName.includes('定义')) {
        nodeFolders.push(`/materials/concepts/${nodeName.replace(/\s+/g, '-')}`);
        nodeFolders.push(`/materials/theory/${nodeName.replace(/\s+/g, '-')}`);
      } else if (nodeName.includes('应用') || nodeName.includes('案例')) {
        nodeFolders.push(`/materials/applications/${nodeName.replace(/\s+/g, '-')}`);
        nodeFolders.push(`/materials/examples/${nodeName.replace(/\s+/g, '-')}`);
      } else {
        nodeFolders.push(`/materials/topics/${nodeName.replace(/\s+/g, '-')}`);
        nodeFolders.push(`/materials/general/${nodeName.replace(/\s+/g, '-')}`);
      }
      
      // 添加一些通用文件夹
      nodeFolders.push(`/materials/resources/${nodeName.replace(/\s+/g, '-')}`);
      
      // 如果是根节点，使用之前生成的文件夹
      if (mindMapData && node.name === mindMapData.name) {
        setRelatedFolders(relatedFolders);
      } else {
        setRelatedFolders(nodeFolders);
      }
      
      // 滚动右侧文件夹面板到顶部
      const folderPanel = document.querySelector('.folder-navigation-panel');
      if (folderPanel) {
        folderPanel.scrollTop = 0;
      }
    }
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
        title: mindMapData.name,
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
      link.download = `${mindMapData.name}-思维导图.svg`;
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
  
  // 处理文件夹选择
  const handleFolderSelect = (path: string) => {
    console.log('选择文件夹:', path);
    // 这里可以实现更多功能，如打开文件夹等
  };
  
  // 视图控制函数
  const zoomRef = useRef<{ zoomIn?: () => void, zoomOut?: () => void, resetView?: () => void }>({});
  
  // 如果存在渲染错误，显示错误信息
  if (renderError) {
    return (
      <div className="container mx-auto p-4">
        <div className="border-l-4 border-red-500 p-4 bg-red-50 text-red-700">
          <h3 className="text-lg font-bold">页面渲染错误</h3>
          <p>{renderError}</p>
          <button 
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded"
            onClick={() => window.location.reload()}
          >
            重新加载页面
          </button>
        </div>
      </div>
    );
  }
  
  console.log("NLPMindMapPage 开始渲染组件树");
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* 页面标题和返回按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">AI思维导图生成</h1>
            <p className="text-muted-foreground">输入文本内容，AI自动生成结构化思维导图</p>
          </div>
        </div>
      </div>
      
      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧栏 - 文本输入和控制面板 */}
        <div className="lg:col-span-3 space-y-4">
          {/* 文本输入区域 */}
          <div className="space-y-3 border rounded-lg p-4 bg-card">
            <h3 className="font-medium">输入文本内容</h3>
            <Textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="输入要分析的文本内容..."
              className="min-h-[150px]"
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">思维导图深度: {depth}</label>
                <span className="text-xs text-muted-foreground">(1-5)</span>
              </div>
              <Slider 
                min={1} 
                max={5} 
                step={1} 
                value={[depth]} 
                onValueChange={(value) => setDepth(value[0])} 
              />
              
              <div className="flex items-center justify-between">
                <label className="text-sm">每层最大节点数: {maxNodesPerLevel}</label>
                <span className="text-xs text-muted-foreground">(3-10)</span>
              </div>
              <Slider 
                min={3} 
                max={10} 
                step={1} 
                value={[maxNodesPerLevel]} 
                onValueChange={(value) => setMaxNodesPerLevel(value[0])} 
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              className="w-full" 
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  生成思维导图
                </>
              )}
            </Button>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => useExampleText(0)}
                className="text-xs"
              >
                示例1: 注意力机制
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => useExampleText(1)}
                className="text-xs"
              >
                示例2: 可持续发展
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => useExampleText(2)}
                className="text-xs"
              >
                示例3: 区块链技术
              </Button>
            </div>
          </div>
          
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
          
          {/* 连接器面板 */}
          <MindMapConnector
            nodeName={selectedNode?.name || null}
            onConnect={() => {
              toast({
                title: "浏览文件夹",
                description: `为"${selectedNode?.name}"选择关联文件夹`,
              });
              // 这里可以实现文件夹选择器弹窗
            }}
          />
          
          {/* 信息面板 */}
          <MindMapInfoPanel
            selectedNode={selectedNode}
            keyword={mindMapData?.name || ''}
            totalNodes={countTotalNodes(mindMapData)}
          />
        </div>
        
        {/* 中间内容区域 - 思维导图显示 */}
        <div className="lg:col-span-6">
          <div 
            ref={viewerRef} 
            className="border rounded-lg overflow-hidden shadow-sm h-[700px] bg-background"
          >
            {mindMapData ? (
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">尚未生成思维导图</p>
                  <Button onClick={() => handleGenerate()} disabled={isLoading || !inputText.trim()}>
                    {isLoading ? '生成中...' : '立即生成'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-2 text-sm text-center text-muted-foreground">
            {mindMapData ? (
              <p>点击节点可查看详细信息，双击放大</p>
            ) : (
              <p>输入文本内容，点击生成按钮开始创建思维导图</p>
            )}
          </div>
        </div>
        
        {/* 右侧栏 - 文件夹导航 */}
        <div className="lg:col-span-3">
          <MaterialFolderNavigation 
            folderPaths={relatedFolders}
            title={selectedNode ? `${selectedNode.name}相关文件夹` : "相关文件夹"}
            onFolderSelect={handleFolderSelect}
            className="h-full folder-navigation-panel"
          />
        </div>
      </div>
    </div>
  );
};

export default NLPMindMapPage; 