/**
 * 思维导图UI组件 - 使用React实现的思维导图交互界面
 * 这是外部层的一部分，调用适配器层的控制器和展示器
 */

import React, { useState, useEffect } from 'react';
import { MindMapController } from '../../adapters/controllers/MindMapController';
import { MindMapPresenter, MindMapViewModel, MindMapNodeViewModel } from '../../adapters/presenters/MindMapPresenter';

interface MindMapComponentProps {
  /**
   * 思维导图控制器
   */
  controller: MindMapController;
  /**
   * 思维导图ID
   */
  mindMapId: string;
  /**
   * 是否处于编辑模式
   */
  isEditable?: boolean;
}

export const MindMapComponent: React.FC<MindMapComponentProps> = ({
  controller,
  mindMapId,
  isEditable = false
}) => {
  const [mindMap, setMindMap] = useState<MindMapViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeText, setNodeText] = useState<string>('');

  // 加载思维导图数据
  useEffect(() => {
    const loadMindMap = async () => {
      try {
        setLoading(true);
        const result = await controller.getMindMap(mindMapId);
        const viewModel = MindMapPresenter.toViewModel(result);
        setMindMap(viewModel);
        setError(null);
      } catch (err) {
        setError('加载思维导图失败');
        console.error('Failed to load mind map:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMindMap();
  }, [controller, mindMapId]);

  // 处理节点选择
  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    
    if (mindMap) {
      const findNode = (nodes: MindMapNodeViewModel[]): MindMapNodeViewModel | null => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            return node;
          }
          
          if (node.children.length > 0) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        
        return null;
      };

      const node = findNode([mindMap.rootNode]);
      if (node) {
        setNodeText(node.text);
      }
    }
  };

  // 处理添加节点
  const handleAddNode = async () => {
    if (!mindMap || !selectedNodeId) return;
    
    try {
      const updatedMindMap = await controller.addNode(
        mindMap.id,
        selectedNodeId,
        '新节点'
      );
      
      const viewModel = MindMapPresenter.toViewModel(updatedMindMap);
      setMindMap(viewModel);
    } catch (err) {
      setError('添加节点失败');
      console.error('Failed to add node:', err);
    }
  };

  // 处理更新节点
  const handleUpdateNode = async () => {
    if (!mindMap || !selectedNodeId) return;
    
    try {
      const updatedMindMap = await controller.updateNode(
        mindMap.id,
        selectedNodeId,
        nodeText
      );
      
      const viewModel = MindMapPresenter.toViewModel(updatedMindMap);
      setMindMap(viewModel);
      setSelectedNodeId(null);
      setNodeText('');
    } catch (err) {
      setError('更新节点失败');
      console.error('Failed to update node:', err);
    }
  };

  // 处理删除节点
  const handleDeleteNode = async () => {
    if (!mindMap || !selectedNodeId) return;
    
    try {
      const updatedMindMap = await controller.removeNode(
        mindMap.id,
        selectedNodeId
      );
      
      const viewModel = MindMapPresenter.toViewModel(updatedMindMap);
      setMindMap(viewModel);
      setSelectedNodeId(null);
      setNodeText('');
    } catch (err) {
      setError('删除节点失败');
      console.error('Failed to delete node:', err);
    }
  };

  // 递归渲染节点
  const renderNode = (node: MindMapNodeViewModel, level: number = 0) => {
    const isSelected = node.id === selectedNodeId;
    
    return (
      <div key={node.id} style={{ marginLeft: `${level * 20}px` }}>
        <div 
          className={`node ${isSelected ? 'selected' : ''}`}
          onClick={() => handleNodeSelect(node.id)}
        >
          {node.text}
        </div>
        
        {node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!mindMap) {
    return <div>未找到思维导图</div>;
  }

  return (
    <div className="mind-map-container">
      <h2>{mindMap.title}</h2>
      {mindMap.description && <p>{mindMap.description}</p>}
      
      <div className="mind-map-viewer">
        {renderNode(mindMap.rootNode)}
      </div>
      
      {isEditable && (
        <div className="mind-map-editor">
          {selectedNodeId && (
            <div className="node-editor">
              <input 
                type="text" 
                value={nodeText} 
                onChange={(e) => setNodeText(e.target.value)} 
              />
              <button onClick={handleUpdateNode}>更新节点</button>
              {selectedNodeId !== mindMap.rootNode.id && (
                <button onClick={handleDeleteNode}>删除节点</button>
              )}
            </div>
          )}
          
          {selectedNodeId && (
            <button onClick={handleAddNode}>添加子节点</button>
          )}
        </div>
      )}
    </div>
  );
}; 