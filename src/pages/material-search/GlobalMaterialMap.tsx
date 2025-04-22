import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import MaterialNode from '@/modules/mindmap/components/MaterialNode';
import MaterialFolderNavigation from '@/modules/materials/components/MaterialFolderNavigation';
import MaterialMindMap from '@/modules/materials/components/MaterialMindMap';
import MaterialPreviewDialog from '@/modules/materials/components/MaterialPreviewDialog';
import MaterialUploadDialog from '@/modules/materials/components/MaterialUploadDialog';
import { useMaterialMindMap } from '@/modules/materials/hooks/useMaterialMindMap';
import { useMaterialUpload } from '@/modules/materials/hooks/useMaterialUpload';
import { useMaterialPreview } from '@/modules/materials/hooks/useMaterialPreview';

// 注册自定义节点类型
const nodeTypes = {
  materialNode: MaterialNode
};

const GlobalMaterialMap: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // 使用自定义hooks
  const {
    nodes,
    edges,
    currentPath,
    setCurrentPath,
    folderMaterials,
    handleNodeClick,
    navigateTo,
    onInitReactFlow
  } = useMaterialMindMap();
  
  const {
    selectedMaterial,
    previewOpen,
    openPreview,
    closePreview,
    downloadMaterial
  } = useMaterialPreview();
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    selectedFile,
    setSelectedFile,
    uploadProgress,
    isUploading,
    showUploadForm,
    handleOpenUploadForm,
    closeUploadForm,
    handleUpload
  } = useMaterialUpload(currentPath, () => {
    // 刷新当前文件夹的资料被移到了useMaterialMindMap内部
  });
  
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/material-search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">全平台资料导图</h1>
            <p className="text-muted-foreground">浏览、搜索和上传共享资料</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索资料..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleOpenUploadForm}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            上传资料
          </Button>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 左侧导航区域 */}
        <MaterialFolderNavigation
          currentPath={currentPath}
          folderMaterials={folderMaterials}
          navigateTo={navigateTo}
          setCurrentPath={setCurrentPath}
          openPreview={openPreview}
          downloadMaterial={downloadMaterial}
          handleOpenUploadForm={handleOpenUploadForm}
        />
        
        {/* 右侧思维导图区域 */}
        <MaterialMindMap
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          handleNodeClick={handleNodeClick}
          onInitReactFlow={onInitReactFlow}
        />
      </div>
      
      {/* 资料预览对话框 */}
      <MaterialPreviewDialog
        open={previewOpen}
        onOpenChange={closePreview}
        selectedMaterial={selectedMaterial}
        downloadMaterial={downloadMaterial}
      />
      
      {/* 上传表单对话框 */}
      <MaterialUploadDialog
        open={showUploadForm}
        onOpenChange={closeUploadForm}
        currentPath={currentPath}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        uploadProgress={uploadProgress}
        isUploading={isUploading}
        handleUpload={handleUpload}
        closeUploadForm={closeUploadForm}
      />
    </div>
  );
};

export default GlobalMaterialMap; 
