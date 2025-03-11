
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ArrowRight, Filter, X, Eye, Tag, FileText } from 'lucide-react';
import { ReactFlow, Background, Controls, Node, Edge, MarkerType, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define hierarchical tag structure
interface TagCategory {
  id: string;
  name: string;
  children?: TagCategory[];
}

const MaterialSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTagPath, setSelectedTagPath] = useState<string[]>([]);

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

  // Sample materials for demonstration
  const materials = [
    { 
      id: 1, 
      title: '数学建模竞赛指南', 
      description: '数学建模竞赛入门指南，包含竞赛流程介绍与解题方法。',
      tags: ['比赛', '数学建模', '比赛规则'],
      downloads: 128
    },
    { 
      id: 2, 
      title: '全国大学生数学建模竞赛历年真题', 
      description: '近十年全国大学生数学建模竞赛真题集锦。',
      tags: ['比赛', '数学建模', '历年真题'],
      downloads: 196
    },
    { 
      id: 3, 
      title: '数学建模获奖作品集锦', 
      description: '历届数学建模竞赛获奖作品分析与解读。',
      tags: ['比赛', '数学建模', '获奖作品'],
      downloads: 156
    },
    { 
      id: 4, 
      title: '数学建模竞赛注意事项', 
      description: '参加数学建模竞赛前的准备与注意事项汇总。',
      tags: ['比赛', '数学建模', '比赛注意事项'],
      downloads: 87
    },
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
      : ['比赛', '数学建模', '比赛规则'];
    
    // Process each selected tag
    tagsToProcess.forEach((tag, tagIndex) => {
      // Find the complete path for this tag in the hierarchy
      const tagPath = findTagPath(tag);
      
      if (tagPath.length === 0) {
        // If we can't find it in hierarchy, it's a custom tag
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
        
        // Connect to central node
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
        
        // Find materials with this custom tag
        const relatedMaterials = materials.filter(m => 
          m.tags.includes(tag)
        );
        
        // Add material nodes
        relatedMaterials.forEach((material, materialIndex) => {
          const materialNode: Node = {
            id: `material-custom-${tagIndex}-${materialIndex}`,
            data: { label: material.title },
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
          
          // Connect material to tag
          newEdges.push({
            id: `edge-custom-${tagIndex}-material-${materialIndex}`,
            source: `custom-${tagIndex}`,
            target: `material-custom-${tagIndex}-${materialIndex}`,
            style: { stroke: 'hsl(var(--border))' },
            type: 'smoothstep',
          });
        });
      } else {
        // It's a hierarchical tag, process the hierarchy
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
            const relatedMaterials = materials.filter(m => 
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
    generateMindMap();
    
    // Set a specific tag path for detail view (this would normally come from search/selection)
    setSelectedTagPath(['比赛', '数学建模', '比赛规则']);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  // Filter materials based on the selected tag path
  const filteredMaterials = materials.filter(material => {
    if (selectedTagPath.length === 0) return true;
    
    // Check if the material tags contain all the tags in the selected path
    return selectedTagPath.every((tag, index) => material.tags[index] === tag);
  });

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-lg border shadow-lg overflow-hidden h-[600px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                attributionPosition="bottom-right"
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">相关资料列表</h3>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  标签路径:
                </div>
                {selectedTagPath.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredMaterials.map((material, i) => (
                  <Card key={i} className="glass-card subtle-hover">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{material.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-xs text-muted-foreground mb-3">{material.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          {material.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  查看更多相关资料
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MaterialSearch;
