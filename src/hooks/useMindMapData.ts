
import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { mindmapService } from '@/lib/mindmapStorage';
import { toast } from '@/components/ui/use-toast';
import { MindMapNode, MindMapEdge, MindMap } from '@/types/mindmap';
import { Material } from '@/types/materials';

export function useMindMapData() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = id === 'new';
  
  // State for the mindmap
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Add a tag
  const addTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);
  
  // Remove a tag
  const removeTag = useCallback((tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }, [tags]);
  
  // Save the mindmap
  const saveMindMap = useCallback((nodes: MindMapNode[], edges: MindMapEdge[]) => {
    if (!title.trim()) {
      toast({
        title: "请输入标题",
        description: "思维导图需要一个标题才能保存",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能保存思维导图",
        variant: "destructive"
      });
      return;
    }
    
    const mindMapData: Partial<MindMap> = {
      title,
      description,
      content: {
        nodes,
        edges,
        version: "1.0"
      },
      tags,
      updatedAt: new Date().toISOString(),
      creator: user.username || 'Unknown',
      starred: false,
      shared: isPublic,
      viewCount: 0
    };
    
    if (isNew) {
      const newMindMap = mindmapService.add(mindMapData);
      toast({
        title: "保存成功",
        description: "思维导图已成功创建"
      });
      // Navigate to edit the newly created mindmap
      navigate(`/mindmap-editor/${newMindMap.id}`);
    } else if (id) {
      mindmapService.update(parseInt(id), mindMapData);
      toast({
        title: "保存成功",
        description: "思维导图已成功更新"
      });
    }
  }, [title, description, tags, isPublic, isNew, id, user, navigate]);
  
  // Load mindmap data
  const loadMindMap = useCallback(() => {
    if (!isNew && id) {
      const mindmap = mindmapService.getById(parseInt(id));
      if (mindmap) {
        setTitle(mindmap.title);
        setDescription(mindmap.description || '');
        setIsPublic(mindmap.shared);
        setTags(mindmap.tags || []);
        
        return mindmap.content;
      } else {
        toast({
          title: "未找到思维导图",
          description: "请创建新的思维导图",
          variant: "destructive"
        });
        navigate('/mindmaps');
      }
    } else {
      // Return initial data for a new mindmap
      const initialNode: MindMapNode = {
        id: '1',
        type: 'materialNode',
        data: { 
          label: '中心主题',
          icon: 'Brain',
          materials: []
        },
        position: { x: 400, y: 300 },
        style: {
          background: '#f0f4ff',
          border: '2px solid hsl(var(--primary))',
          color: 'hsl(var(--primary))',
          width: 150,
          height: 80,
          padding: '10px',
          borderRadius: '8px',
          fontWeight: 'bold',
        }
      };
      
      return {
        nodes: [initialNode],
        edges: []
      };
    }
  }, [id, isNew, navigate]);
  
  return {
    isNew,
    title,
    setTitle,
    description,
    setDescription,
    isPublic,
    setIsPublic,
    tags,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    saveMindMap,
    loadMindMap
  };
}
