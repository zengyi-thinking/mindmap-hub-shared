import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// 用于存储JointJS实例的类型
declare global {
  interface Window {
    joint: any;
  }
}

interface JointJSMindMapProps {
  /**
   * 搜索关键词，作为中心节点
   */
  searchQuery: string;
  /**
   * 搜索结果数据，用于构建思维导图
   */
  searchResults?: any[];
  /**
   * 是否处于加载状态
   */
  loading?: boolean;
  /**
   * 点击节点的回调函数
   */
  onNodeClick?: (nodeData: any) => void;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 布局方向，水平或垂直
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * 主题颜色
   */
  theme?: 'light' | 'dark';
}

/**
 * 基于JointJS的思维导图组件
 * 用于可视化搜索结果和相关概念
 */
const JointJSMindMap: React.FC<JointJSMindMapProps> = ({
  searchQuery,
  searchResults = [],
  loading = false,
  onNodeClick,
  className = '',
  direction = 'horizontal',
  theme = 'light'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const paperRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 加载JointJS依赖
  useEffect(() => {
    // 检查是否已经加载
    if (window.joint) {
      setScriptLoaded(true);
      return;
    }

    // 加载CSS
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.7.5/joint.css';
    document.head.appendChild(linkEl);
    
    // 加载所需的脚本
    const scriptJQuery = document.createElement('script');
    scriptJQuery.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    document.body.appendChild(scriptJQuery);
    
    const scriptLodash = document.createElement('script');
    scriptLodash.src = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js';
    document.body.appendChild(scriptLodash);
    
    const scriptBackbone = document.createElement('script');
    scriptBackbone.src = 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.1/backbone-min.js';
    document.body.appendChild(scriptBackbone);
    
    const scriptJoint = document.createElement('script');
    scriptJoint.src = 'https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.7.5/joint.min.js';
    scriptJoint.onload = () => setScriptLoaded(true);
    document.body.appendChild(scriptJoint);
    
    return () => {
      // 清理函数
      document.body.removeChild(scriptJQuery);
      document.body.removeChild(scriptLodash);
      document.body.removeChild(scriptBackbone);
      document.body.removeChild(scriptJoint);
      document.head.removeChild(linkEl);
    };
  }, []);

  // 创建并初始化图形
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !searchQuery) return;

    try {
      // 初始化JointJS
      const { joint } = window;
      
      // 设置颜色主题
      const colors = theme === 'dark' 
        ? {
            background: '#1f2937',
            node: {
              fill: '#374151',
              stroke: '#4b5563',
              text: '#f9fafb'
            },
            centralNode: {
              fill: '#6366f1',
              stroke: '#4f46e5',
              text: '#ffffff'
            },
            link: {
              stroke: '#6b7280'
            }
          }
        : {
            background: '#ffffff',
            node: {
              fill: '#f3f4f6',
              stroke: '#d1d5db',
              text: '#1f2937'
            },
            centralNode: {
              fill: '#3b82f6',
              stroke: '#2563eb',
              text: '#ffffff'
            },
            link: {
              stroke: '#9ca3af'
            }
          };
      
      // 清除现有图形
      if (graphRef.current) {
        paperRef.current.remove();
      }

      // 创建图形
      graphRef.current = new joint.dia.Graph();
      
      // 创建画布
      paperRef.current = new joint.dia.Paper({
        el: containerRef.current,
        model: graphRef.current,
        width: '100%',
        height: '100%',
        gridSize: 1,
        background: {
          color: colors.background
        },
        interactive: {
          linkMove: false,
          elementMove: false,
          labelMove: false,
        }
      });
      
      // 自定义节点形状
      const MindMapNode = joint.shapes.standard.Rectangle.define('MindMap.Node', {
        attrs: {
          body: {
            rx: 10,
            ry: 10,
            fill: colors.node.fill,
            stroke: colors.node.stroke,
            strokeWidth: 1
          },
          label: {
            fontFamily: '"PingFang SC", "Microsoft YaHei", "SimHei", "Heiti SC", sans-serif',
            fontSize: 14,
            fontWeight: 'normal',
            fill: colors.node.text,
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '50%'
          }
        }
      });
      
      // 创建中心节点
      const centralNode = new MindMapNode({
        position: { x: 300, y: 200 },
        size: { width: 200, height: 50 },
        attrs: {
          body: {
            fill: colors.centralNode.fill,
            stroke: colors.centralNode.stroke,
            strokeWidth: 2
          },
          label: {
            text: searchQuery,
            fill: colors.centralNode.text,
            fontWeight: 'bold',
            fontSize: 16
          }
        },
        data: {
          id: 'central',
          type: 'query',
          originalText: searchQuery
        }
      });
      
      // 添加中心节点到图形
      graphRef.current.addCell(centralNode);
      
      // 处理搜索结果，创建子节点
      if (searchResults && searchResults.length > 0) {
        const nodeSpacing = direction === 'horizontal' ? { x: 220, y: 0 } : { x: 0, y: 80 };
        const linkVertices = direction === 'horizontal' 
          ? [{ x: 30, y: 0 }, { x: -30, y: 0 }]
          : [{ x: 0, y: 30 }, { x: 0, y: -30 }];
        
        // 按类别对结果进行分组
        const groupedResults: {[key: string]: any[]} = {};
        searchResults.forEach(result => {
          const category = result.category || '其他';
          if (!groupedResults[category]) {
            groupedResults[category] = [];
          }
          groupedResults[category].push(result);
        });
        
        // 计算节点位置
        let offsetY = -((Object.keys(groupedResults).length - 1) * 100) / 2;
        
        // 为每个类别创建节点
        Object.entries(groupedResults).forEach(([category, items], categoryIndex) => {
          // 创建类别节点
          const categoryNode = new MindMapNode({
            position: direction === 'horizontal' 
              ? { x: centralNode.position().x + nodeSpacing.x, y: centralNode.position().y + offsetY }
              : { x: centralNode.position().x + offsetY, y: centralNode.position().y + nodeSpacing.y },
            size: { width: 150, height: 40 },
            attrs: {
              body: {
                fill: colors.node.fill,
                stroke: colors.node.stroke,
                strokeWidth: 1.5
              },
              label: {
                text: category,
                fill: colors.node.text,
                fontWeight: 'bold'
              }
            },
            data: {
              id: `category-${categoryIndex}`,
              type: 'category',
              originalText: category
            }
          });
          
          graphRef.current.addCell(categoryNode);
          
          // 创建中心节点到类别节点的连接
          const link = new joint.shapes.standard.Link({
            source: { id: centralNode.id },
            target: { id: categoryNode.id },
            router: { name: 'manhattan' },
            connector: { name: 'rounded' },
            attrs: {
              line: {
                stroke: colors.link.stroke,
                strokeWidth: 2,
                targetMarker: {
                  type: 'path',
                  stroke: colors.link.stroke,
                  fill: colors.link.stroke,
                  d: 'M 10 -5 0 0 10 5 Z'
                }
              }
            },
            vertices: direction === 'horizontal' 
              ? [] 
              : [
                { x: centralNode.position().x, y: centralNode.position().y + 60 },
                { x: categoryNode.position().x, y: categoryNode.position().y - 30 }
              ]
          });
          
          graphRef.current.addCell(link);
          
          // 为类别下的每个项目创建节点
          const itemSpacing = direction === 'horizontal' ? 60 : 50;
          const itemOffsetY = -((items.length - 1) * itemSpacing) / 2;
          
          items.forEach((item, itemIndex) => {
            const itemNode = new MindMapNode({
              position: direction === 'horizontal'
                ? { 
                    x: categoryNode.position().x + nodeSpacing.x, 
                    y: categoryNode.position().y + itemOffsetY + itemIndex * itemSpacing 
                  }
                : { 
                    x: categoryNode.position().x + itemOffsetY + itemIndex * itemSpacing, 
                    y: categoryNode.position().y + nodeSpacing.y 
                  },
              size: { width: 150, height: 40 },
              attrs: {
                body: {
                  fill: colors.node.fill,
                  stroke: colors.node.stroke
                },
                label: {
                  text: item.title || item.name || `项目 ${itemIndex + 1}`,
                  fill: colors.node.text
                }
              },
              data: {
                id: `item-${categoryIndex}-${itemIndex}`,
                type: 'item',
                originalItem: item
              }
            });
            
            graphRef.current.addCell(itemNode);
            
            // 创建类别节点到项目节点的连接
            const itemLink = new joint.shapes.standard.Link({
              source: { id: categoryNode.id },
              target: { id: itemNode.id },
              router: { name: 'manhattan' },
              connector: { name: 'rounded' },
              attrs: {
                line: {
                  stroke: colors.link.stroke,
                  strokeWidth: 1.5,
                  targetMarker: {
                    type: 'path',
                    stroke: colors.link.stroke,
                    fill: colors.link.stroke,
                    d: 'M 8 -4 0 0 8 4 Z'
                  }
                }
              },
              vertices: direction === 'horizontal'
                ? []
                : [
                  { x: categoryNode.position().x, y: categoryNode.position().y + 50 },
                  { x: itemNode.position().x, y: itemNode.position().y - 20 }
                ]
            });
            
            graphRef.current.addCell(itemLink);
          });
          
          offsetY += 100; // 移动到下一个分类位置
        });
      }
      
      // 自动布局
      if (direction === 'horizontal') {
        joint.layout.DirectedGraph.layout(graphRef.current, {
          setLinkVertices: false,
          rankDir: 'LR', // 从左到右布局
          nodeSep: 100,  // 节点间水平间距
          rankSep: 200,  // 级别间垂直间距
          marginX: 50,   // 水平边距
          marginY: 50    // 垂直边距
        });
      } else {
        joint.layout.DirectedGraph.layout(graphRef.current, {
          setLinkVertices: false,
          rankDir: 'TB', // 从上到下布局
          nodeSep: 80,   // 节点间水平间距
          rankSep: 120,  // 级别间垂直间距
          marginX: 50,   // 水平边距
          marginY: 50    // 垂直边距
        });
      }
      
      // 缩放以适应视图
      paperRef.current.scaleContentToFit({ padding: 50 });
      
      // 添加点击事件监听
      paperRef.current.on('element:pointerclick', (elementView: any) => {
        const element = elementView.model;
        const nodeData = element.get('data');
        
        if (nodeData && onNodeClick) {
          onNodeClick(nodeData);
        }
      });
      
      // 添加鼠标悬停效果
      paperRef.current.on('element:mouseenter', (elementView: any) => {
        const element = elementView.model;
        element.attr({
          body: {
            filter: {
              name: 'highlight',
              args: { color: theme === 'dark' ? '#4f46e5' : '#3b82f6', width: 3 }
            },
            cursor: 'pointer'
          }
        });
      });
      
      paperRef.current.on('element:mouseleave', (elementView: any) => {
        const element = elementView.model;
        element.removeAttr('body/filter');
      });
      
    } catch (error) {
      console.error('Error initializing JointJS:', error);
    }
  }, [scriptLoaded, searchQuery, searchResults, direction, theme, onNodeClick]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0 relative h-[600px]">
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              <p className="text-sm text-muted-foreground">正在生成思维导图...</p>
            </div>
          </div>
        )}
        <div 
          ref={containerRef} 
          className="w-full h-full"
        />
      </CardContent>
    </Card>
  );
};

export default JointJSMindMap; 