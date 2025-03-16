
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mindmapService } from '@/lib/mindmapStorage';
import { useToast } from '@/components/ui/use-toast';
import { MindMap } from '@/types/mindmap';

export const useMyMindMaps = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newMindMapName, setNewMindMapName] = useState('');
  const [newMindMapDescription, setNewMindMapDescription] = useState('');
  const [newMindMapTags, setNewMindMapTags] = useState('');
  const [privacyOption, setPrivacyOption] = useState('private');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null);
  
  useEffect(() => {
    // 从localStorage加载思维导图数据
    const loadMindMaps = () => {
      const storedMindMaps = mindmapService.getAll();
      setMindMaps(storedMindMaps);
    };
    
    loadMindMaps();
    
    // 检查是否需要打开创建对话框（从仪表盘跳转过来）
    if (location.state && location.state.openCreateDialog) {
      setCreateDialogOpen(true);
      // 清除状态，防止再次渲染时重新打开对话框
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCreateMindMap = () => {
    if (!newMindMapName.trim()) return;
    
    const newMindMapData = {
      title: newMindMapName,
      updatedAt: new Date().toISOString().split('T')[0],
      starred: false,
      shared: privacyOption === 'public',
      description: newMindMapDescription,
      tags: newMindMapTags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    // 使用mindmapService添加新思维导图
    const newMindMap = mindmapService.add(newMindMapData);
    
    // 更新状态
    setMindMaps([newMindMap, ...mindMaps]);
    setNewMindMapName('');
    setNewMindMapDescription('');
    setNewMindMapTags('');
    setPrivacyOption('private');
    setCreateDialogOpen(false);
    
    // 显示成功提示
    toast({
      title: "创建成功",
      description: `思维导图「${newMindMap.title}」已创建`,
    });
    
    // 在实际应用中，这里应该导航到思维导图编辑器
    // navigate(`/mindmap-editor/${newMindMap.id}`);
  };
  
  const toggleStarred = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // 使用mindmapService切换收藏状态
    const updatedMindMap = mindmapService.toggleStarred(id);
    
    if (updatedMindMap) {
      setMindMaps(
        mindMaps.map(mindMap => 
          mindMap.id === id ? updatedMindMap : mindMap
        )
      );
      
      toast({
        title: updatedMindMap.starred ? "已收藏" : "已取消收藏",
        description: `思维导图「${updatedMindMap.title}」${updatedMindMap.starred ? "已添加到收藏" : "已从收藏中移除"}`,
      });
    }
  };
  
  const toggleShared = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // 使用mindmapService切换共享状态
    const updatedMindMap = mindmapService.toggleShared(id);
    
    if (updatedMindMap) {
      setMindMaps(
        mindMaps.map(mindMap => 
          mindMap.id === id ? updatedMindMap : mindMap
        )
      );
      
      toast({
        title: updatedMindMap.shared ? "已共享" : "已取消共享",
        description: `思维导图「${updatedMindMap.title}」${updatedMindMap.shared ? "现在可以被其他用户查看" : "已设为私密"}`
      });
    }
  };
  
  const handleDeleteMindMap = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (window.confirm('确定要删除这个思维导图吗？此操作不可撤销。')) {
      // 使用mindmapService删除思维导图
      const success = mindmapService.delete(id);
      
      if (success) {
        setMindMaps(mindMaps.filter(mindMap => mindMap.id !== id));
        
        toast({
          title: "删除成功",
          description: "思维导图已永久删除",
        });
      }
    }
  };
  
  const handleShareMindMap = (mindMap: MindMap, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedMindMap(mindMap);
    setShareDialogOpen(true);
  };
  
  const handleEditMindMap = (id: number) => {
    console.log(`编辑思维导图: ${id}`);
    // 在实际应用中，这里应该导航到思维导图编辑器
    // navigate(`/mindmap-editor/${id}`);
  };
  
  const filteredMindMaps = mindMaps.filter(mindMap => 
    mindMap.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const starredMindMaps = filteredMindMaps.filter(mindMap => mindMap.starred);
  const recentMindMaps = [...filteredMindMaps].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return {
    mindMaps,
    filteredMindMaps,
    starredMindMaps,
    recentMindMaps,
    searchQuery,
    setSearchQuery,
    newMindMapName,
    setNewMindMapName,
    newMindMapDescription,
    setNewMindMapDescription,
    newMindMapTags,
    setNewMindMapTags,
    privacyOption,
    setPrivacyOption,
    createDialogOpen,
    setCreateDialogOpen,
    shareDialogOpen,
    setShareDialogOpen,
    selectedMindMap,
    setSelectedMindMap,
    handleSearch,
    handleCreateMindMap,
    toggleStarred,
    toggleShared,
    handleDeleteMindMap,
    handleShareMindMap,
    handleEditMindMap
  };
};
