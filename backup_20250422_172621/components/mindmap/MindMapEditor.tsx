import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Panel,
  useReactFlow,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button, Input, Tooltip, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { MindMapNode } from './MindMapNode';
import { MindMapSearch } from './MindMapSearch';
import { MindMapControls } from './MindMapControls';
import { generateMindMap } from '../../services/mindmap';
import { UploadedFile, releaseFileUrl } from '../../services/file-upload';
import { applyLayout, LayoutType } from '../../utils/mindmap-layout';
import { themes } from '../../styles/mindmap-themes';

const nodeTypes: NodeTypes = {
  mindmap: MindMapNode,
};

interface MindMapEditorProps {
  initialData?: {
    nodes: Node[];
    edges: Edge[];
  };
  onSave?: (data: { nodes: Node[]; edges: Edge[] }) => void;
}

export const MindMapEditor: React.FC<MindMapEditorProps> = ({ initialData, onSave }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData?.edges || []);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [theme, setTheme] = useState('professional');
  const [layout, setLayout] = useState<LayoutType>('tree');
  const [spacing, setSpacing] = useState({ x: 200, y: 100 });
  
  const { getNode, getNodes, getEdges, setCenter } = useReactFlow();

  // 处理文件上传
  const handleFileUpload = useCallback((nodeId: string, file: UploadedFile) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                file,
              },
            }
          : node
      )
    );
  }, [setNodes]);

  // 处理文件打开
  const handleFileOpen = useCallback((file: UploadedFile) => {
    // 根据文件类型决定打开方式
    if (file.type.startsWith('image/')) {
      Modal.info({
        title: file.name,
        content: (
          <img
            src={file.url}
            alt={file.name}
            style={{ maxWidth: '100%', maxHeight: '80vh' }}
          />
        ),
        width: '80%',
      });
    } else if (file.type === 'application/pdf') {
      window.open(file.url, '_blank');
    } else {
      // 对于其他类型的文件，尝试下载
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  // 添加新节点
  const handleAddNode = useCallback(() => {
    if (!selectedNode) {
      // 添加根节点
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'mindmap',
        position: { x: 0, y: 0 },
        data: {
          label: '新主题',
          level: 0,
          onFileUpload: handleFileUpload,
          onFileOpen: handleFileOpen,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    } else {
      // 添加子节点
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'mindmap',
        position: { 
          x: selectedNode.position.x + spacing.x,
          y: selectedNode.position.y + spacing.y,
        },
        data: { 
          label: '新子主题',
          level: selectedNode.data.level + 1,
          parentId: selectedNode.id,
          onFileUpload: handleFileUpload,
          onFileOpen: handleFileOpen,
        },
      };
      const newEdge: Edge = {
        id: `edge-${selectedNode.id}-${newNode.id}`,
        source: selectedNode.id,
        target: newNode.id,
        type: 'smoothstep',
        animated: true,
      };
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    }
  }, [selectedNode, setNodes, setEdges, spacing, handleFileUpload, handleFileOpen]);

  // 删除节点
  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;

    // 清理节点关联的文件URL
    if (selectedNode.data.file?.url) {
      releaseFileUrl(selectedNode.data.file.url);
    }

    const deleteNodeAndChildren = (nodeId: string) => {
      const node = getNode(nodeId);
      if (!node) return;

      // 清理子节点的文件URL
      if (node.data.file?.url) {
        releaseFileUrl(node.data.file.url);
      }

      // 删除节点
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));

      // 递归删除子节点
      const childEdges = getEdges().filter((e) => e.source === nodeId);
      childEdges.forEach((edge) => {
        deleteNodeAndChildren(edge.target);
      });
    };

    deleteNodeAndChildren(selectedNode.id);
    setSelectedNode(null);
  }, [selectedNode, getNode, getEdges, setNodes, setEdges]);

  // 编辑节点
  const handleEditNode = useCallback(() => {
    if (!selectedNode) return;

    const newLabel = prompt('请输入新的节点名称:', selectedNode.data.label);
    if (newLabel && newLabel !== selectedNode.data.label) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? {
                ...node,
                data: { ...node.data, label: newLabel },
              }
            : node
        )
      );
    }
  }, [selectedNode, setNodes]);

  // 处理节点选择
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // 处理连接
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 处理布局变化
  const handleLayoutChange = useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
    const layoutedNodes = applyLayout(nodes, edges, {
      type: newLayout,
      spacing,
    });
    setNodes(layoutedNodes);
  }, [nodes, edges, spacing, setNodes]);

  // 处理间距变化
  const handleSpacingChange = useCallback((newSpacing: { x: number; y: number }) => {
    setSpacing(newSpacing);
    const layoutedNodes = applyLayout(nodes, edges, {
      type: layout,
      spacing: newSpacing,
    });
    setNodes(layoutedNodes);
  }, [nodes, edges, layout, setNodes]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title="添加节点">
              <Button icon={<PlusOutlined />} onClick={handleAddNode} />
            </Tooltip>
            <Tooltip title="删除节点">
              <Button 
                icon={<DeleteOutlined />} 
                onClick={handleDeleteNode}
                disabled={!selectedNode}
              />
            </Tooltip>
            <Tooltip title="编辑节点">
              <Button 
                icon={<EditOutlined />} 
                onClick={handleEditNode}
                disabled={!selectedNode}
              />
            </Tooltip>
            <Tooltip title="搜索生成">
              <Button 
                icon={<SearchOutlined />} 
                onClick={() => setIsSearchVisible(true)}
              />
            </Tooltip>
          </div>
        </Panel>

        <MindMapControls
          theme={theme}
          layout={layout}
          spacing={spacing}
          onThemeChange={setTheme}
          onLayoutChange={handleLayoutChange}
          onSpacingChange={handleSpacingChange}
        />
      </ReactFlow>

      {isSearchVisible && (
        <MindMapSearch
          onSearch={async (query) => {
            try {
              const result = await generateMindMap(query);
              if (result) {
                setNodes(result.nodes);
                setEdges(result.edges);
                setIsSearchVisible(false);
                message.success('思维导图生成成功');
              }
            } catch (error) {
              message.error('思维导图生成失败');
            }
          }}
          onCancel={() => setIsSearchVisible(false)}
        />
      )}
    </div>
  );
}; 