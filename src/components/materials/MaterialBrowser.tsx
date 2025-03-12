import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import MaterialCard from './MaterialCard';
import { Material } from '@/types/materials';
import { userFilesService } from '@/lib/storage';
import { Skeleton } from "@/components/ui/skeleton";

const MaterialBrowser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      try {
        // 获取已批准的用户文件作为材料
        const approvedFiles = userFilesService.getAll().filter(file => file.status === 'approved');
        setMaterials(approvedFiles.map(file => ({
          id: file.id,
          title: file.title,
          description: file.description || '暂无描述',
          tags: file.tags || [],
          uploader: file.userName || '匿名用户',
          uploadTime: new Date(file.uploadTime).toLocaleString(),
          downloads: file.downloadCount || 0,
          likes: file.likeCount || 0,
          favorites: file.favoriteCount || 0,
          fileName: file.fileName,
          fileSize: file.size,
          fileType: file.type,
          fileUrl: file.url
        })));
      } catch (error) {
        console.error('加载材料失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="搜索资料（按标题或标签）..."
          className="w-full pl-9"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">没有找到符合条件的资料</p>
        </div>
      )}
    </div>
  );
};

export default MaterialBrowser;
