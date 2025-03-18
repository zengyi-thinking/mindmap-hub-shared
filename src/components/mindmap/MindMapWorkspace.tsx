import React, { useState, useCallback, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Panel, 
  Edge,
  Node,
  NodeMouseHandler,
  BackgroundVariant,
  EdgeTypes,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { useMindMapNodes } from '@/hooks/useMindMapNodes';
import { PlusCircle, ZoomIn, ZoomOut, Maximize2, RefreshCw, Save } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// 导入所需组件
import MaterialNode from '@/components/mindmap/MaterialNode';
import MindMapEdge from '@/components/mindmap/MindMapEdge';

// 定义可用节点类型
const nodeTypes = {
  materialNode: MaterialNode
};

// 定义可用边类型
const edgeTypes: EdgeTypes = {
  mindmapEdge: MindMapEdge
};

interface MindMapWorkspaceProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: NodeMouseHandler;
  onAddNode: () => void;
  onAutoLayout: () => void;
  onSave: () => void;
  reactFlowWrapper: React.RefObject<HTMLDivElement>;
  setReactFlowInstance: (instance: any) => void;
}

// 内部组件，使用useReactFlow
const FlowContent: React.FC<MindMapWorkspaceProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onAddNode,
  onAutoLayout,
  onSave,
  reactFlowWrapper,
  setReactFlowInstance
}) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 切换全屏
  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (reactFlowWrapper.current?.requestFullscreen) {
        reactFlowWrapper.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, [isFullScreen, reactFlowWrapper]);

  // 监听全屏变化
  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const getBackgroundColor = () => {
    return darkMode ? '#1a1a1a' : '#f9fafb';
  };

  const edgeStyles: CSSProperties = {
    stroke: darkMode ? '#6b7280' : '#9ca3af',
    strokeWidth: 2,
    transition: 'stroke 0.2s, stroke-width 0.2s'
  };

  // 处理初始化
  const onInit = useCallback((instance: any) => {
    console.log("ReactFlow实例已初始化", instance);
    setReactFlowInstance(instance);
  }, [setReactFlowInstance]);

  // 处理添加节点按钮点击
  const handleAddNode = useCallback(() => {
    if (onAddNode) {
      onAddNode();
    }
  }, [onAddNode]);

  return (
    <div 
      className="w-full rounded-lg overflow-hidden border transition-all ease-in-out duration-300"
      style={{ 
        height: 'calc(100vh - 250px)',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        boxShadow: darkMode 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
          : '0 4px 20px rgba(0, 0, 0, 0.05)',
        background: getBackgroundColor()
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onInit={onInit}
        fitView
        defaultEdgeOptions={{
          type: 'mindmapEdge',
          animated: false,
          style: edgeStyles
        }}
        proOptions={{ hideAttribution: true }}
        className="transition-colors duration-300"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={16} 
          size={1} 
          color={darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'} 
          className="transition-colors duration-300"
        />
        
        <Controls 
          className={`rounded-md shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border p-1 transition-colors duration-300`}
          showInteractive={false}
        />
        
        <MiniMap 
          className={`shadow-lg rounded-md ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}
          nodeColor={darkMode ? '#4b5563' : '#e5e7eb'}
          maskColor={darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
        />
        
        <Panel position="top-right" className="flex flex-col gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className={`shadow-md ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} transition-colors duration-200`}
            onClick={toggleFullScreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className={`shadow-md ${darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'} transition-colors duration-200`}
            onClick={onAutoLayout}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </Panel>
        
        <Panel position="bottom-right" className="flex gap-2">
          <Button 
            onClick={onSave}
            variant="default"
            size="sm"
            className="shadow-md transition-transform duration-200 hover:scale-105"
          >
            <Save className="h-4 w-4 mr-1" /> 保存
          </Button>
          
          <Button 
            onClick={handleAddNode}
            variant="default"
            size="sm"
            className="shadow-md transition-transform duration-200 hover:scale-105"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> 添加节点
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// 外部包装组件，提供ReactFlowProvider
const MindMapWorkspace: React.FC<MindMapWorkspaceProps> = (props) => {
  return (
    <div ref={props.reactFlowWrapper}>
      <ReactFlowProvider>
        <FlowContent {...props} />
      </ReactFlowProvider>
    </div>
  );
};

export default MindMapWorkspace;
