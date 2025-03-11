
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, ArrowRight, Filter, X, Eye } from 'lucide-react';
import { ReactFlow, Background, Controls, Node, Edge, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const MaterialSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);

  const popularTags = [
    '计算机科学', '软件工程', '人工智能', '机器学习', 
    '数据结构', '算法', '操作系统', '计算机网络',
    '数据库', '前端开发', '后端开发', '移动开发',
    '云计算', '分布式系统', '网络安全', '编程语言',
    '比赛', '数学建模', '比赛规则', '历年真题',
    '获奖作品', '比赛注意事项', '程序设计', '创新创业'
  ];

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

  const handleSearch = () => {
    setSearchPerformed(true);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  // Generate nodes and edges based on the search query and selected tags
  const generateMindMap = (): { nodes: Node[], edges: Edge[] } => {
    const tags = selectedTags.length > 0 
      ? selectedTags 
      : ['比赛', '数学建模', '程序设计', '创新创业']; // Default tags if none selected
    
    const query = searchQuery || '比赛资料';
    
    // Central node (search query)
    const nodes: Node[] = [
      {
        id: 'central',
        type: 'input',
        data: { label: query },
        position: { x: 250, y: 150 },
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
      },
    ];
    
    const edges: Edge[] = [];
    
    // Add tag nodes around the central node
    const tagCount = tags.length;
    const radius = 200;
    
    tags.forEach((tag, i) => {
      const angle = (i / tagCount) * 2 * Math.PI;
      const x = 250 + radius * Math.cos(angle);
      const y = 150 + radius * Math.sin(angle);
      
      const nodeId = `tag-${i}`;
      
      // Add tag node
      nodes.push({
        id: nodeId,
        data: { label: tag },
        position: { x, y },
        style: {
          background: tag === '数学建模' ? 'hsl(180, 70%, 85%)' : 'hsl(var(--accent))',
          border: '1px solid hsl(var(--accent-foreground) / 0.2)',
          borderRadius: '16px',
          padding: '8px 16px',
          fontSize: '13px',
        },
      });
      
      // Connect tag to central node
      edges.push({
        id: `edge-central-${nodeId}`,
        source: 'central',
        target: nodeId,
        animated: true,
        style: { stroke: 'hsl(var(--primary) / 0.5)' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: 'hsl(var(--primary))',
        },
      });
      
      // Add resource nodes for each tag
      // For "数学建模" tag, create specific subnodes as in the example image
      if (tag === '数学建模') {
        const subTags = ['比赛规则', '历年真题', '获奖作品', '比赛注意事项'];
        
        subTags.forEach((subTag, j) => {
          const subAngle = angle - 0.4 + (j / (subTags.length - 1)) * 0.8;
          const subRadius = radius + 120;
          const subX = 250 + subRadius * Math.cos(subAngle);
          const subY = 150 + subRadius * Math.sin(subAngle);
          
          const subNodeId = `subtag-${i}-${j}`;
          
          // Add subtag node
          nodes.push({
            id: subNodeId,
            data: { label: subTag },
            position: { x: subX, y: subY },
            style: {
              background: 'white',
              border: '1px solid hsl(var(--border))',
              borderRadius: '16px',
              padding: '8px 16px',
              fontSize: '12px',
            },
          });
          
          // Connect subtag to parent tag
          edges.push({
            id: `edge-${nodeId}-${subNodeId}`,
            source: nodeId,
            target: subNodeId,
            style: { stroke: 'hsl(var(--border))' },
            type: 'smoothstep',
          });
          
          // For the first subtag "比赛规则", add a specific resource
          if (subTag === '比赛规则') {
            const resourceId = `resource-${subNodeId}`;
            
            nodes.push({
              id: resourceId,
              data: { label: '其他（内含资料）' },
              position: { x: subX + 150, y: subY },
              style: {
                background: 'white',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                width: 150,
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              },
            });
            
            edges.push({
              id: `edge-${subNodeId}-${resourceId}`,
              source: subNodeId,
              target: resourceId,
              style: { stroke: 'hsl(var(--border))' },
              type: 'smoothstep',
            });
          }
        });
      } else {
        // Regular resource nodes for other tags
        const resourceCount = Math.floor(Math.random() * 2) + 2; // 2-3 resources per tag
        
        for (let j = 0; j < resourceCount; j++) {
          const resourceAngle = angle - 0.2 + (j / resourceCount) * 0.4; // Spread resources within a smaller arc
          const resourceRadius = radius + 120;
          const resourceX = 250 + resourceRadius * Math.cos(resourceAngle);
          const resourceY = 150 + resourceRadius * Math.sin(resourceAngle);
          
          const resourceId = `resource-${i}-${j}`;
          const resourceNames = [
            `${tag}学习指南`,
            `${tag}实战教程`,
            `${tag}基础入门`,
            `${tag}高级技巧`,
            `${tag}案例分析`,
          ];
          
          // Add resource node
          nodes.push({
            id: resourceId,
            data: { label: resourceNames[j % resourceNames.length] },
            position: { x: resourceX, y: resourceY },
            style: {
              background: 'white',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '12px',
              width: 100,
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            },
          });
          
          // Connect resource to tag
          edges.push({
            id: `edge-${nodeId}-${resourceId}`,
            source: nodeId,
            target: resourceId,
            style: { stroke: 'hsl(var(--border))' },
            type: 'smoothstep',
          });
        }
      }
    });
    
    return { nodes, edges };
  };
  
  const { nodes, edges } = generateMindMap();

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
            <div className="bg-white rounded-lg border shadow-lg overflow-hidden h-[500px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                attributionPosition="bottom-right"
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                '数学建模竞赛指南', 
                '全国大学生数学建模竞赛历年真题', 
                '数学建模获奖作品集锦'
              ].map((title, i) => (
                <Card key={i} className="glass-card subtle-hover">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {(i === 0 ? ['比赛', '数学建模', '比赛规则'] : 
                          i === 1 ? ['比赛', '数学建模', '历年真题'] : 
                          ['比赛', '数学建模', '获奖作品']).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MaterialSearch;
