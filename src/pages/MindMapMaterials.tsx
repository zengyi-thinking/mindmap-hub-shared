
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { mindmapService } from '@/lib/mindmapStorage';
import { Material } from '@/types/materials';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const MindMapMaterials: React.FC = () => {
  const { mapId, nodeId } = useParams<{ mapId: string; nodeId: string }>();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [nodeName, setNodeName] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load the mindmap and find the node
    if (mapId && nodeId) {
      const mindmap = mindmapService.getById(parseInt(mapId));
      
      if (mindmap && mindmap.content && mindmap.content.nodes) {
        const node = mindmap.content.nodes.find(n => n.id === nodeId);
        
        if (node) {
          setNodeName(node.data.label || '节点');
          setMaterials(node.data.materials || []);
        }
      }
      
      setLoading(false);
    }
  }, [mapId, nodeId]);
  
  const handleDownload = (material: Material) => {
    // If fileUrl is provided, open it in a new tab
    if (material.fileUrl) {
      window.open(material.fileUrl, '_blank');
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`/mindmap-editor/${mapId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{nodeName} - 附加资料</h1>
          <p className="text-muted-foreground">
            查看该节点关联的所有资料
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-4 pt-2 flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {material.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {material.description || '无描述'}
                </p>
                {material.tags && material.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {material.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-2 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {material.fileType && `${material.fileType} · `}
                  {material.fileSize && `${(material.fileSize / 1024 / 1024).toFixed(2)} MB`}
                </div>
                <Button 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleDownload(material)}
                >
                  <Download className="h-4 w-4" />
                  下载
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-muted mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">没有附加资料</h2>
          <p className="text-muted-foreground">
            该节点暂未关联任何资料文件
          </p>
          <Button 
            className="mt-4"
            onClick={() => navigate(`/mindmap-editor/${mapId}`)}
          >
            返回编辑
          </Button>
        </div>
      )}
    </div>
  );
};

export default MindMapMaterials;
