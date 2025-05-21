import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { mindmapService } from '@/lib/mindmapStorage';
import styles from '\.\/MaterialSearch\.module\.css';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { MindMap } from '@/modules/mindmap/bridges/types';

// 导入拆分后的组件
import MaterialSearchContainer from '@/features/material-search/MaterialSearchContainer';
import MaterialSearchTabs from '@/features/material-search/MaterialSearchTabs';
import MaterialUploadDialog from '@/features/material-search/MaterialUploadDialog';
import MaterialPreviewDialog from '@/features/material-search/MaterialPreviewDialog';
import PublicMindMapsGrid from '@/features/material-search/PublicMindMapsGrid';
import MaterialMindMapGenerator from '@/features/material-search/MaterialMindMapGenerator';
import { MaterialMermaidMindMap } from '@/domains/mindmap';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ErrorFallback from '@/components/ui/ErrorFallback';
import { tagHierarchy } from '@/data/tagHierarchy';
import { userFilesService } from '@/lib/storage';
import { TagCategory } from '@/modules/materials/types/materials';
// 导入模拟数据
import { mockCategories, mockMaterials } from '@/features/material-search/MockData';

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
  const [allMaterials, setAllMaterials] = useState(mockMaterials);
  const [categories, setCategories] = useState(mockCategories);
  const [useNewMindMap, setUseNewMindMap] = useState<boolean>(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // 加载公开的思维导图
  useEffect(() => {
    if (activeTab === 'mindmaps') {
      const sharedMindMaps = mindmapService.getShared();
      setPublicMindMaps(sharedMindMaps);
      
      // 尝试加载真实数据，如果失败则使用模拟数据
      try {
        const materials = userFilesService.getApprovedFiles();
        if (materials && materials.length > 0) {
          setAllMaterials(materials);
        }
        
        // 生成分类数据
        const convertToTagCategories = (tags: any[]): TagCategory[] => {
          return tags.map((tag: any, index: number) => ({
            id: `tag-${index}`,
            name: tag.name,
            children: tag.children ? convertToTagCategories(tag.children) : undefined
          }));
        };
        
        if (tagHierarchy && tagHierarchy.length > 0) {
          const categoryData = convertToTagCategories(tagHierarchy);
          setCategories(categoryData);
        }
      } catch (error) {
        console.log('使用模拟数据:', error);
        // 保留模拟数据
      }
    }
  }, [activeTab]);
  
  // 查看思维导图
  const viewMindMap = (id: number) => {
    navigate(`/mindmap-view/${id}`);
  };
  
  // 切换tab时更新URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // 更新URL参数，但保持在当前页面
    navigate(`/material-search?tab=${value}`, { replace: true });
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
  
  // 处理节点点击
  const handleNodeClick = (classNames: string[]) => {
    // 从类名中查找可能的材料ID
    const materialId = classNames.find(className => className.startsWith('material-'));
    
    if (materialId) {
      const id = materialId.replace('material-', '');
      const material = allMaterials.find(m => m.id === id);
      if (material) {
        handleSelectMaterial(material);
      }
    }
  };
  
  // 切换思维导图类型
  const toggleMindMapType = () => {
    setUseNewMindMap(!useNewMindMap);
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
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">资料导图浏览</h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={toggleMindMapType}
                        className="px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20"
                      >
                        切换到{useNewMindMap ? "ReactFlow" : "Mermaid"}视图
                      </button>
                      <a 
                        href="/material-search/mermaid-test" 
                        className="px-3 py-1 text-sm bg-secondary/10 text-secondary rounded hover:bg-secondary/20"
                      >
                        打开Mermaid测试页
                      </a>
                    </div>
                  </div>
                  
                  {useNewMindMap ? (
                    <div className="w-full h-[500px]">
                      <MaterialMermaidMindMap 
                        materials={allMaterials} 
                        categories={categories}
                        onNodeClick={handleNodeClick}
                      />
                    </div>
                  ) : (
                    <MaterialMindMapGenerator onSelectMaterial={handleSelectMaterial} />
                  )}
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


