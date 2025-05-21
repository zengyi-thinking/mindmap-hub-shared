/**
 * 思维导图适配器 - 将新的整洁架构思维导图组件适配到现有应用中
 * 这是一个过渡适配器，连接新旧代码
 */

import React, { useEffect, useState } from 'react';
import { 
  MindMapController,
  MindMapLocalStorageRepository,
  MindMapComponent,
  CreateMindMapDialog
} from '../../../domains/mindmap';

// 获取全局用户ID（示例，实际应用中应该从认证上下文中获取）
const getCurrentUserId = (): string => {
  return 'user-123'; // 这里应该返回实际的用户ID
};

// 创建全局实例
const repository = new MindMapLocalStorageRepository();
const controller = new MindMapController(repository);

interface MindMapAdapterProps {
  /**
   * 思维导图ID
   */
  mindMapId?: string;
  /**
   * 是否在编辑模式
   */
  editable?: boolean;
  /**
   * 创建成功的回调
   */
  onCreateSuccess?: (id: string) => void;
}

/**
 * 思维导图适配器组件
 * 用于将新架构的思维导图组件集成到现有应用中
 */
export const MindMapAdapter: React.FC<MindMapAdapterProps> = ({
  mindMapId,
  editable = false,
  onCreateSuccess
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUserId] = useState(getCurrentUserId());

  const handleCreateSuccess = (newMindMapId: string) => {
    if (onCreateSuccess) {
      onCreateSuccess(newMindMapId);
    }
  };

  return (
    <div className="mindmap-adapter">
      {!mindMapId && (
        <div className="create-button-container">
          <button 
            className="create-button" 
            onClick={() => setDialogOpen(true)}
          >
            创建新思维导图
          </button>
          
          <CreateMindMapDialog
            controller={controller}
            userId={currentUserId}
            isOpen={dialogOpen}
            onOpenChange={setDialogOpen}
            onSuccess={handleCreateSuccess}
          />
        </div>
      )}

      {mindMapId && (
        <MindMapComponent
          controller={controller}
          mindMapId={mindMapId}
          isEditable={editable}
        />
      )}
    </div>
  );
};

/**
 * 思维导图列表容器组件
 * 用于展示用户的思维导图列表
 */
export const MyMindMapsContainer: React.FC = () => {
  const [mindMaps, setMindMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId] = useState(getCurrentUserId());

  // 加载用户的思维导图列表
  useEffect(() => {
    const loadMindMaps = async () => {
      try {
        setLoading(true);
        const userMindMaps = await controller.getUserMindMaps(currentUserId);
        setMindMaps(userMindMaps);
        setError(null);
      } catch (err) {
        setError('加载思维导图列表失败');
        console.error('Failed to load mind maps:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMindMaps();
  }, [currentUserId]);

  const handleCreateSuccess = (newMindMapId: string) => {
    // 刷新列表
    controller.getUserMindMaps(currentUserId)
      .then(updatedMindMaps => {
        setMindMaps(updatedMindMaps);
      })
      .catch(err => {
        console.error('Failed to refresh mind maps:', err);
      });
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-mindmaps-container">
      <h1>我的思维导图</h1>
      
      <MindMapAdapter onCreateSuccess={handleCreateSuccess} />
      
      <div className="mindmap-list">
        {mindMaps.length === 0 ? (
          <div className="empty-state">
            <p>您还没有创建任何思维导图</p>
          </div>
        ) : (
          <ul>
            {mindMaps.map(mindMap => (
              <li key={mindMap.id} className="mindmap-item">
                <h3>{mindMap.title}</h3>
                {mindMap.description && <p>{mindMap.description}</p>}
                <div className="mindmap-meta">
                  <span>创建于: {new Date(mindMap.createdAt).toLocaleDateString()}</span>
                  <span>节点数: {mindMap.nodes.length}</span>
                </div>
                <div className="mindmap-actions">
                  <a href={`/mindmap/${mindMap.id}/view`}>查看</a>
                  <a href={`/mindmap/${mindMap.id}/edit`}>编辑</a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}; 