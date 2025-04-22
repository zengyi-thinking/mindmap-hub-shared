import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import * as uuid from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { MindMapNode } from '@/modules/mindmap/types/mindmap';
import { Material } from '@/modules/materials/types/materials';

/**
 * 思维导图节点操作钩子
 * 处理节点的添加、删除、更新和附加资料等操作
 */
export const useMindMapNodes = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  /**
   * 添加新节点
   * 如果有选中的节点，则添加为其子节点，否则添加为根节点
   */
  const addNode = useCallback((reactFlowInstance: any, reactFlowWrapper: React.RefObject<HTMLDivElement>, selectedNode?: Node | null) => {
    if (!reactFlowInstance) {
      toast({
        title: "操作失败",
        description: "无法访问思维导图实例",
        variant: "destructive"
      });
      return null;
    }
    
    // 生成唯一ID
    const id = `node-${uuid.v4()}`;
    
    // 获取视图中心点或相对于选择节点的位置
    let position;
    
    if (selectedNode) {
      // 如果有选中的节点，添加为其子节点
      position = {
        x: selectedNode.position.x + 250, // 在选中节点右侧
        y: selectedNode.position.y       // 与选中节点同高
      };
    } else {
      // 没有选中节点，添加到视图中心
      try {
        // 尝试获取画布中心点
        const viewportCenter = reactFlowInstance.getViewport ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 };
        let centerX = 100;
        let centerY = 100;
        
        if (reactFlowWrapper.current) {
          centerX = reactFlowWrapper.current.clientWidth / 2;
          centerY = reactFlowWrapper.current.clientHeight / 2;
        }
        
        // 计算相对于视口中心的位置
        position = reactFlowInstance.project ? 
          reactFlowInstance.project({
            x: centerX,
            y: centerY
          }) : 
          { x: centerX, y: centerY };
      } catch (error) {
        console.error("获取画布中心点失败:", error);
        // 使用默认位置
        position = { x: 100, y: 100 };
      }
    }
    
    console.log("新节点位置:", position);
    
    // 创建新节点
    const newNode: MindMapNode = {
      id,
      type: 'materialNode',
      position,
      data: {
        label: '新节点',
        notes: '',
        icon: '',
        materials: []
      },
      style: {
        background: '#ffffff' // 默认白色背景
      }
    };
    
    // 更新节点
    setNodes(nodes => [...nodes, newNode]);
    
    // 如果有选中节点，创建连接边
    if (selectedNode) {
      const newEdge = {
        id: `edge-${selectedNode.id}-${id}`,
        source: selectedNode.id,
        target: id,
        type: 'smoothstep',
        animated: false
      };
      
      setEdges(edges => [...edges, newEdge]);
    }
    
    console.log("成功创建新节点:", newNode);
    return newNode;
  }, [setNodes, setEdges]);
  
  /**
   * 通过按Tab键添加子节点
   */
  const addChildNodeByTab = useCallback((event: React.KeyboardEvent, node: Node, reactFlowInstance: any, reactFlowWrapper: React.RefObject<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      return addNode(reactFlowInstance, reactFlowWrapper, node);
    }
    return null;
  }, [addNode]);
  
  /**
   * 删除节点
   */
  const deleteNode = useCallback((node?: Node | null) => {
    if (!node) return false;
    
    setNodes(nodes => nodes.filter(n => n.id !== node.id));
    setEdges(edges => edges.filter(e => e.source !== node.id && e.target !== node.id));
    
    return true;
  }, [setNodes, setEdges]);
  
  /**
   * 更新节点
   */
  const updateNode = useCallback((
    node: Node | null,
    name: string,
    notes: string,
    color: string,
    icon: string,
    url: string
  ) => {
    if (!node) return false;
    
    console.log("更新节点:", { id: node.id, name, notes, color, icon, url });
    
    setNodes(nodes => 
      nodes.map(n => {
        if (n.id === node.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label: name,
              notes,
              icon,
              url
            },
            // 确保颜色应用到样式中
            style: {
              ...n.style,
              background: color
            }
          };
        }
        return n;
      })
    );
    
    return true;
  }, [setNodes]);
  
  /**
   * 附加资料到节点
   */
  const attachMaterials = useCallback((
    node: Node | null,
    materials: Material[]
  ) => {
    if (!node) return false;
    
    console.log("附加资料到节点:", { nodeId: node.id, materials });
    
    // 确保节点数据结构完整
    setNodes(nodes => 
      nodes.map(n => {
        if (n.id === node.id) {
          const updatedNode = {
            ...n,
            data: {
              ...n.data,
              materials
            }
          };
          console.log("更新后的节点:", updatedNode);
          return updatedNode;
        }
        return n;
      })
    );
    
    return true;
  }, [setNodes]);

  return {
    addNode,
    addChildNodeByTab,
    deleteNode,
    updateNode,
    attachMaterials
  };
};

export default useMindMapNodes;

