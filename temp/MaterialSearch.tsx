import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { mindmapService } from '@/lib/mindmapStorage';
import styles from './MaterialSearch.module.css';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { MindMap } from '@/types/mindmap';

// 导入拆分后的组件
import MaterialSearchContainer from '@/features/material-search/MaterialSearchContainer';
import MaterialSearchTabs from '@/features/material-search/MaterialSearchTabs';
import MaterialUploadDialog from '@/features/material-search/MaterialUploadDialog';
import MaterialPreviewDialog from '@/features/material-search/MaterialPreviewDialog';
import PublicMindMapsGrid from '@/features/material-search/PublicMindMapsGrid';
import MaterialMindMapGenerator from '@/features/material-search/MaterialMindMapGenerator';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ErrorFallback from '@/components/ui/ErrorFallback';

/**
 * 材料搜索页面
 * 包含资料标签化导图搜索和全平台资料导图浏览
 */
const MaterialSearch: React.FC = () => {
  // 从URL参数获取初始tab
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tabFromUrl = params.get('tab');
  
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'search');
  const [publicMindMaps, setPublicMindMaps] = useState<MindMap[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // 加载公开的思维导图
  useEffect(() => {
    if (activeTab === 'mindmaps') {
      const sharedMindMaps = mindmapService.getShared();
      setPublicMindMaps(sharedMindMaps);
    }
  }, [activeTab]);
  
  // 查看思维导图
  const viewMindMap = (id: number) => {
    navigate(`/mindmap-view/${id}`);
  };
  
  // 切换tab时更新URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'mindmaps') {
      navigate(`/global-material-map`, { replace: true });
    } else {
      navigate(`/material-search?tab=${value}`, { replace: true });
    }
  };
  
  // 打开上传对话框
  const openUploadDialog = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能上传资料",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    setShowUploadForm(true);
  };
  
  // 关闭上传对话框
  const closeUploadDialog = () => {
    setShowUploadForm(false);
  };
  
  // 处理上传成功
  const handleUploadSuccess = () => {
    toast({
      title: "上传成功",
      description: "您的资料已成功上传，等待审核"
    });
  };
  
  // 查看材料预览
  const handleSelectMaterial = (material: any) => {
    setSelectedMaterial(material);
    setPreviewOpen(true);
  };
  
  // 关闭预览对话框
  const closePreviewDialog = () => {
    setPreviewOpen(false);
  };
  
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <div className={styles.container}>
        <ParticleBackground />
        
        <div className={styles.contentContainer}>
          <MaterialSearchTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onUploadClick={openUploadDialog}
          >
            <TabsContent value="search" className="mt-0">
              <MaterialSearchContainer />
            </TabsContent>
            
            <TabsContent value="mindmaps" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-card rounded-lg border shadow-sm p-4">
                  <h2 className="text-xl font-bold mb-4">资料导图浏览</h2>
                  <MaterialMindMapGenerator onSelectMaterial={handleSelectMaterial} />
                </div>
                
                <div className="bg-card rounded-lg border shadow-sm p-4">
                  <h2 className="text-xl font-bold mb-4">思维导图推荐</h2>
                  <PublicMindMapsGrid
                    mindMaps={publicMindMaps}
                    onViewMindMap={viewMindMap}
                  />
                </div>
              </div>
            </TabsContent>
          </MaterialSearchTabs>
        </div>
        
        {/* 上传对话框 */}
        <MaterialUploadDialog
          open={showUploadForm}
          onClose={closeUploadDialog}
          onUploadSuccess={handleUploadSuccess}
        />
        
        {/* 预览对话框 */}
        <MaterialPreviewDialog
          open={previewOpen}
          onClose={closePreviewDialog}
          material={selectedMaterial}
        />
      </div>
    </ErrorBoundary>
  );
};

export default MaterialSearch; 