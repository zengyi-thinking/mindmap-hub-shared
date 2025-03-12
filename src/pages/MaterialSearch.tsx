import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Search, Download, ArrowRight, Filter, X, Eye, Tag, FileText, PlusCircle, Circle, Save } from 'lucide-react';
import { ReactFlow, Background, Controls, Node, Edge, MarkerType, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { userFilesService, materialsService, mindMapsService } from '@/lib/storage';
import { useAuth } from '@/lib/auth';

// Define hierarchical tag structure
interface TagCategory {
  id: string;
  name: string;
  children?: TagCategory[];
}

const MaterialSearch = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTagPath, setSelectedTagPath] = useState<string[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [mindMapTitle, setMindMapTitle] = useState('');
  const [mindMapDescription, setMindMapDescription] = useState('');
  const [materialsData, setMaterialsData] = useState([]);

  // Load materials from storage on component mount
  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    // 从storage获取材料数据，而不是使用硬编码的示例数据
    const approvedFiles = userFilesService.getApprovedFiles();
    setMaterialsData(approvedFiles);
  };

  // Hierarchical tag system
  const tagHierarchy: TagCategory[] = [
    {
      id: "contests",
      name: "比赛",
      children: [
        {
          id: "math-modeling",
          name: "数学建模",
          children: [
            { id: "rules", name: "比赛规则" },
            { id: "previous-problems", name: "历年真题" },
            { id: "winning-works", name: "获奖作品" },
            { id: "notices", name: "比赛注意事项" }
          ]
        },
        {
          id: "programming",
          name: "程序设计",
          children: [
            { id: "algorithms", name: "算法" },
            { id: "languages", name: "编程语言" },
            { id: "frameworks", name: "开发框架" }
          ]
        },
        {
          id: "innovation",
          name: "创新创业",
          children: [
            { id: "business-plans", name: "商业计划书" },
            { id: "case-studies", name: "案例分析" },
            { id: "pitches", name: "路演材料" }
          ]
        }
      ]
    },
    {
      id: "cs",
      name: "计算机科学",
      children: [
        {
          id: "basics",
          name: "基础理论",
          children: [
            { id: "data-structures", name: "数据结构" },
            { id: "algorithms", name: "算法" },
            { id: "operating-systems", name: "操作系统" },
            { id: "computer-networks", name: "计算机网络" }
          ]
        },
        {
          id: "development",
          name: "开发技术",
          children: [
            { id: "frontend", name: "前端开发" },
            { id: "backend", name: "后端开发" },
            { id: "mobile", name: "移动开发" },
            { id: "database", name: "数据库" }
          ]
        },
        {
          id: "advanced",
          name: "高级主题",
          children: [
            { id: "ai", name: "人工智能" },
            { id: "ml", name: "机器学习" },
            { id: "cloud", name: "云计算" },
            { id: "security", name: "网络安全" }
          ]
        }
      ]
    },
    {
      id: "education",
      name: "教育资源",
      children: [
        {
          id: "textbooks",
          name: "教材",
          children: [
            { id: "undergraduate", name: "本科教材" },
            { id: "graduate", name: "研究生教材" },
            { id: "mooc", name: "在线课程" }
          ]
        },
        {
          id: "notes",
          name: "笔记",
          children: [
            { id: "lecture-notes", name: "课堂笔记" },
            { id: "summary", name: "总结归纳" }
          ]
        },
        {
          id: "exercises",
          name: "习题",
          children: [
            { id: "practice", name: "练习题" },
            { id: "exams", name: "考试题" },
            { id: "solutions", name: "解答" }
          ]
        }
      ]
    }
  ];

  // Extract all unique tags from the hierarchy for filtering
  const flattenTags = (categories: TagCategory[]): string[] => {
    let tags: string[] = [];
    
    categories.forEach(category => {
      tags.push(category.name);
      
      if (category.children) {
        const level2Tags = category.children.map(child => child.name);
        tags = [...tags, ...level2Tags];
        
        category.children.forEach(child => {
          if (child.children) {
            const level3Tags = child.children.map(grandchild => grandchild.name);
            tags = [...tags, ...level3Tags];
          }
        });
      }
    });
    
    return [...new Set(tags)];
  };

  const popularTags = flattenTags(tagHierarchy);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Find the complete path for a tag in the hierarchy
  const findTagPath = (tagName: string): string[] => {
    for (const level1 of tagHierarchy) {
      if (level1.name === tagName) {
        return [level1.name];
      }
      
      if (level1.children) {
        for (const level2 of level1.children) {
          if (level2.name === tagName) {
            return [level1.name, level2.name];
          }
          
          if (level2.children) {
            for (const level3 of level2.children) {
              if (level3.name === tagName) {
                return [level1.name, level2.name, level3.name];
              }
            }
          }
        }
      }
    }
    
    return [];
  };

  // Generate mind map based on selected tags and search query
  const generateMindMap = () => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Set up the central search node
    const centralNode: Node = {
      id: 'central',
      type: 'input',
      data: { label: searchQuery || '资料搜索' },
      position: { x: 400, y: 300 },
      style: {
        background: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
        border: 'none',
        borderRadius: '50%',
        width: 120,
        height: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '10px',
        textAlign: 'center',
      },
    };
    
    newNodes.push(centralNode);
    
    // Tags to process (either selected tags or default ones if none selected)
    const tagsToProcess = selectedTags.length > 0 
      ? selectedTags 
      : materialsData.length > 0 && materialsData[0].tags 
        ? materialsData[0].tags.slice(0, 3) 
        : ['比赛', '数学建模', '比赛规则'];
    
    // Process each selected tag
    tagsToProcess.forEach((tag, tagIndex) => {
      // Find the complete path for this tag in the hierarchy
      const tagPath = findTagPath(tag);
      
      if (tagPath.length === 0) {
        // 如果在分层结构中找不到标签，将其作为自定义标签处理
        const customTagNode: Node = {
          id: `custom-${tagIndex}`,
          data: { label: tag },
          position: { 
            x: 400 + 250 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)), 
            y: 300 + 250 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) 
          },
          style: {
            background: 'hsl(var(--accent))',
            border: '1px solid hsl(var(--accent-foreground) / 0.2)',
            borderRadius: '16px',
            padding: '8px 16px',
            fontSize: '13px',
          },
        };
        
        newNodes.push(customTagNode);
        
        // 连接到中心节点
        newEdges.push({
          id: `edge-central-custom-${tagIndex}`,
          source: 'central',
          target: `custom-${tagIndex}`,
          animated: true,
          style: { stroke: 'hsl(var(--primary) / 0.5)' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: 'hsl(var(--primary))',
          },
        });
        
        // 查找具有此自定义标签的材料
        const relatedMaterials = materialsData.filter(m => 
          m.tags && m.tags.includes(tag)
        );
        
        // 添加材料节点
        relatedMaterials.forEach((material, materialIndex) => {
          const materialNode: Node = {
            id: `material-custom-${tagIndex}-${materialIndex}`,
            data: { 
              label: material.title || material.file.name,
              materialId: material.id
            },
            position: { 
              x: 400 + 250 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.cos((materialIndex + 0.5) * Math.PI / 2), 
              y: 300 + 250 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.sin((materialIndex + 0.5) * Math.PI / 2) 
            },
            style: {
              background: 'white',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '12px',
              width: 120,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            },
          };
          
          newNodes.push(materialNode);
          
          // 将材料连接到标签
          newEdges.push({
            id: `edge-custom-${tagIndex}-material-${materialIndex}`,
            source: `custom-${tagIndex}`,
            target: `material-custom-${tagIndex}-${materialIndex}`,
            style: { stroke: 'hsl(var(--border))' },
            type: 'smoothstep',
          });
        });
      } else {
        // 分层标签处理
        let lastNodeId = 'central';
        let lastLevelNodeIds: string[] = ['central'];
        
        // Create nodes for each level in the path
        tagPath.forEach((pathTag, pathIndex) => {
          const isLastLevel = pathIndex === tagPath.length - 1;
          const levelNodeId = `level-${tagIndex}-${pathIndex}`;
          
          // Create node for this level
          const levelNode: Node = {
            id: levelNodeId,
            data: { label: pathTag },
            position: { 
              x: 400 + (pathIndex + 1) * 180 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)), 
              y: 300 + (pathIndex + 1) * 180 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) 
            },
            style: {
              background: isLastLevel ? 'hsl(180, 70%, 85%)' : 'hsl(var(--accent))',
              border: '1px solid hsl(var(--accent-foreground) / 0.2)',
              borderRadius: '16px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: isLastLevel ? 'bold' : 'normal',
            },
          };
          
          newNodes.push(levelNode);
          
          // Connect to previous level
          lastLevelNodeIds.forEach(sourceId => {
            newEdges.push({
              id: `edge-${sourceId}-${levelNodeId}`,
              source: sourceId,
              target: levelNodeId,
              animated: pathIndex === 0,
              style: { stroke: 'hsl(var(--primary) / 0.5)' },
              markerEnd: pathIndex === 0 ? {
                type: MarkerType.ArrowClosed,
                width: 15,
                height: 15,
                color: 'hsl(var(--primary))',
              } : undefined,
            });
          });
          
          // If this is the last level, add related materials
          if (isLastLevel) {
            // Find materials with this tag path
            const relatedMaterials = materialsData.filter(m => 
              tagPath.every((pathItem, idx) => m.tags[idx] === pathItem)
            );
            
            // Add material nodes
            relatedMaterials.forEach((material, materialIndex) => {
              const materialNode: Node = {
                id: `material-${tagIndex}-${pathIndex}-${materialIndex}`,
                data: { label: material.title },
                position: { 
                  x: 400 + (pathIndex + 1) * 180 * Math.cos(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.cos((materialIndex + 0.5) * Math.PI / 2), 
                  y: 300 + (pathIndex + 1) * 180 * Math.sin(tagIndex * (2 * Math.PI / tagsToProcess.length)) + 150 * Math.sin((materialIndex + 0.5) * Math.PI / 2) 
                },
                style: {
                  background: 'white',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '12px',
                  width: 120,
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                },
              };
              
              newNodes.push(materialNode);
              
              // Connect material to tag
              newEdges.push({
                id: `edge-${levelNodeId}-material-${materialIndex}`,
                source: levelNodeId,
                target: `material-${tagIndex}-${pathIndex}-${materialIndex}`,
                style: { stroke: 'hsl(var(--border))' },
                type: 'smoothstep',
              });
            });
          }
          
          lastNodeId = levelNodeId;
          lastLevelNodeIds = [levelNodeId];
        });
      }
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleSearch = () => {
    setSearchPerformed(true);
    
    // 如果有搜索查询或标签，根据条件过滤材料
    if (searchQuery || selectedTags.length > 0) {
      let filtered = materialsData;
      
      // 按标签筛选
      if (selectedTags.length > 0) {
        filtered = filtered.filter(material => 
          material.tags && selectedTags.some(tag => material.tags.includes(tag))
        );
      }
      
      // 按搜索关键词筛选
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(material => 
          (material.title && material.title.toLowerCase().includes(query)) ||
          (material.description && material.description.toLowerCase().includes(query)) ||
          (material.file && material.file.name.toLowerCase().includes(query)) ||
          (material.tags && material.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      
      // 更新材料数据
      setMaterialsData(filtered);
    } else {
      // 如果没有搜索条件，重新加载所有材料
      loadMaterials();
    }
    
    // 生成思维导图
    generateMindMap();
    
    // 选择第一个标签路径作为默认路径（如果有）
    if (selectedTags.length > 0) {
      const firstTag = selectedTags[0];
      const tagPath = findTagPath(firstTag);
      setSelectedTagPath(tagPath.length > 0 ? tagPath : [firstTag]);
    } else if (materialsData.length > 0 && materialsData[0].tags) {
      setSelectedTagPath([materialsData[0].tags[0]]);
    }
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  // Filter materials based on the selected tag path
  const filteredMaterials = materialsData.filter(material => {
    if (selectedTagPath.length === 0) return true;
    
    // Check if the material tags contain all the tags in the selected path
    return material.tags && selectedTagPath.every(tag => material.tags.includes(tag));
  });

  const onNodeClick = (event, node) => {
    // 如果点击的是材料节点
    if (node.id.startsWith('material-') && node.data.materialId) {
      // 查找材料并显示预览
      const material = materialsData.find(m => m.id === node.data.materialId);
      if (material) {
        setSelectedMaterial(material);
        setPreviewDialogOpen(true);
      }
    }
  };

  // 保存思维导图到localStorage
  const saveMindMap = () => {
    if (!mindMapTitle.trim()) {
      toast({
        title: "请输入标题",
        description: "思维导图需要一个标题才能保存",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能保存思维导图",
        variant: "destructive"
      });
      return;
    }
    
    // 创建思维导图对象
    const mindMapData = {
      title: mindMapTitle,
      description: mindMapDescription,
      nodes: nodes,
      edges: edges,
      tags: selectedTags,
      searchQuery: searchQuery,
      createdAt: new Date().toISOString(),
      userId: user.id,
      username: user.name,
      isPublic: true,
      views: 0,
      likes: 0,
      downloads: 0
    };
    
    // 保存到localStorage
    mindMapsService.add(mindMapData);
    
    toast({
      title: "保存成功",
      description: "思维导图已成功保存"
    });
    
    setSaveDialogOpen(false);
    setMindMapTitle('');
    setMindMapDescription('');
  };

  // 下载材料
  const downloadMaterial = (material) => {
    if (!material || !material.file) return;
    
    // 增加下载计数
    userFilesService.incrementDownloads(material.id);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = material.file.content;
    link.download = material.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "下载开始",
      description: `${material.file.name} 下载已开始`
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            资料标签化导图搜索
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="text-muted-foreground"
          >
            通过关键词和标签，将资料以思维导图形式展现
          </motion.p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle>资料搜索</CardTitle>
            <CardDescription>
              输入关键词并选择标签，系统将生成相关资料的思维导图
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="输入关键词搜索资料..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <Button className="sm:w-auto" onClick={handleSearch}>
                  搜索
                </Button>
                <Button 
                  variant="outline" 
                  className="sm:w-auto flex items-center gap-2"
                  onClick={toggleFilter}
                >
                  <Filter className="h-4 w-4" />
                  筛选
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </div>
              
              {filterVisible && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border rounded-md p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">按标签筛选</h3>
                    {selectedTags.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs" 
                        onClick={clearAllTags}
                      >
                        清除全部
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {searchPerformed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <Card className="overflow-hidden border mb-8">
              <CardHeader className="p-4 pb-3 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">思维导图可视化</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => reactFlowInstance?.fitView()}>
                      重置视图
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSaveDialogOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-3.5 w-3.5" />
                      保存
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs flex gap-2 items-center mt-1">
                  <Circle className="h-2 w-2 fill-primary stroke-none" />
                  点击节点可以查看相关资料
                  <Circle className="h-2 w-2 fill-accent stroke-none ml-2" />
                  拖动可以移动思维导图
                </CardDescription>
              </CardHeader>
              <div style={{ height: '60vh', width: '100%' }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  onInit={setReactFlowInstance}
                  fitView
                  attributionPosition="bottom-right"
                  zoomOnScroll={true}
                  panOnScroll={true}
                  nodesDraggable={true}
                  elementsSelectable={true}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background 
                    variant="dots" 
                    gap={20} 
                    size={1} 
                    color="hsl(var(--muted-foreground) / 0.3)"
                  />
                  <Controls 
                    showInteractive={false}
                    position="bottom-right"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                </ReactFlow>
              </div>
            </Card>
            
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">相关资料列表</CardTitle>
                <CardDescription>
                  基于您选择的标签路径展示相关资料
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    标签路径:
                  </div>
                  {selectedTagPath.length > 0 ? (
                    selectedTagPath.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">未选择标签路径</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((material, i) => (
                      <Card 
                        key={i} 
                        className="glass-card subtle-hover cursor-pointer transition-all duration-200 hover:shadow-md"
                        onClick={() => {
                          setSelectedMaterial(material);
                          setPreviewDialogOpen(true);
                        }}
                      >
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">{material.title || material.file.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {material.description || "没有描述"}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-1">
                              {material.tags && material.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  userFilesService.incrementViews(material.id);
                                  setSelectedMaterial(material);
                                  setPreviewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadMaterial(material);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 py-8 text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>没有找到相关资料</p>
                      <p className="text-sm mt-1">请尝试选择不同的标签或搜索条件</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* 保存思维导图对话框 */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>保存思维导图</DialogTitle>
            <DialogDescription>
              填写以下信息保存您的思维导图，方便后续查看和分享
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="mindmap-title">标题 *</Label>
              <Input 
                id="mindmap-title" 
                placeholder="输入思维导图标题..." 
                value={mindMapTitle}
                onChange={(e) => setMindMapTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mindmap-desc">描述</Label>
              <Textarea 
                id="mindmap-desc" 
                placeholder="输入描述信息..."
                rows={3}
                value={mindMapDescription}
                onChange={(e) => setMindMapDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>标签</Label>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
                {selectedTags.length === 0 && (
                  <span className="text-xs text-muted-foreground">未选择标签</span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>取消</Button>
            <Button onClick={saveMindMap}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 资料预览对话框 */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedMaterial && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMaterial.title || selectedMaterial.file.name}</DialogTitle>
                <DialogDescription>
                  上传者: {selectedMaterial.username || "未知用户"} · 
                  上传时间: {new Date(selectedMaterial.uploadTime).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/30">
                  <p>{selectedMaterial.description || "没有描述"}</p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <div className="text-sm font-medium mr-2">标签:</div>
                  {selectedMaterial.tags && selectedMaterial.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <p className="text-muted-foreground">文件大小</p>
                    <p className="font-medium">{(selectedMaterial.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <p className="text-muted-foreground">查看次数</p>
                    <p className="font-medium">{selectedMaterial.views || 0}</p>
                  </div>
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <p className="text-muted-foreground">下载次数</p>
                    <p className="font-medium">{selectedMaterial.downloads || 0}</p>
                  </div>
                </div>
                
                {selectedMaterial.file && selectedMaterial.file.type.startsWith('image/') && (
                  <div className="border rounded-md p-2 overflow-hidden">
                    <img 
                      src={selectedMaterial.file.content} 
                      alt={selectedMaterial.title || selectedMaterial.file.name}
                      className="w-full h-auto object-contain max-h-[400px]"
                    />
                  </div>
                )}
                
                {selectedMaterial.file && selectedMaterial.file.type === 'application/pdf' && (
                  <div className="border rounded-md p-2 flex justify-center">
                    <object
                      data={selectedMaterial.file.content}
                      type="application/pdf"
                      width="100%"
                      height="500px"
                    >
                      <p>您的浏览器无法预览PDF文件</p>
                    </object>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>关闭</Button>
                <Button onClick={() => downloadMaterial(selectedMaterial)}>
                  <Download className="mr-2 h-4 w-4" />
                  下载
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialSearch;
