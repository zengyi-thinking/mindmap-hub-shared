import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { materialsService } from '../lib/storage';
import { Material } from '../types/materials';
import { motion } from 'framer-motion';
import { Download, Heart, BookmarkCheck, Edit, Trash2, Search, Filter, Eye, Tag, Upload, Check, X } from 'lucide-react';

const MaterialManagement = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const { toast } = useToast();

  // 加载所有资料
  useEffect(() => {
    const loadMaterials = () => {
      const allMaterials = materialsService.getAll();
      setMaterials(allMaterials);
    };
    
    loadMaterials();
  }, []);

  // 筛选资料
  const filteredMaterials = materials.filter(material => {
    // 搜索条件
    const matchesSearch = searchQuery === '' || 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 标签条件
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => material.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // 获取所有唯一标签
  const allTags = Array.from(new Set(materials.flatMap(material => material.tags)));

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // 打开删除对话框
  const openDeleteDialog = (material: Material) => {
    setMaterialToDelete(material);
    setIsDeleteDialogOpen(true);
  };

  // 处理删除资料
  const handleDeleteMaterial = () => {
    if (materialToDelete) {
      const success = materialsService.delete(materialToDelete.id);
      if (success) {
        setMaterials(prev => prev.filter(m => m.id !== materialToDelete.id));
        toast({
          title: "删除成功",
          description: `已删除《${materialToDelete.title}》`,
        });
      } else {
        toast({
          title: "删除失败",
          description: "无法删除该资料，请稍后重试",
          variant: "destructive"
        });
      }
      setIsDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  // 打开编辑对话框
  const openEditDialog = (material: Material) => {
    setEditingMaterial(material);
    setEditTitle(material.title);
    setEditDescription(material.description);
    setEditTags(material.tags.join(', '));
    setIsEditDialogOpen(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    if (editingMaterial) {
      const updatedMaterial = materialsService.update(editingMaterial.id, {
        title: editTitle,
        description: editDescription,
        tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      });
      
      if (updatedMaterial) {
        setMaterials(prev => prev.map(m => 
          m.id === editingMaterial.id ? updatedMaterial : m
        ));
        toast({
          title: "更新成功",
          description: `已更新《${updatedMaterial.title}》`,
        });
      } else {
        toast({
          title: "更新失败",
          description: "无法更新该资料，请稍后重试",
          variant: "destructive"
        });
      }
      setIsEditDialogOpen(false);
      setEditingMaterial(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-primary">资料管理</h1>
        <p className="text-muted-foreground">管理平台上的学习资料</p>
      </div>
      
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索资料..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card rounded-lg p-4 border shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-medium">按标签筛选</h2>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer hover:bg-primary/90 transition-all ${
                selectedTags.includes(tag) ? "bg-gradient-primary" : ""
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && <Check className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
        
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTags([])}
          >
            清除筛选
          </Button>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card rounded-lg border overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[350px]">资料标题</TableHead>
                <TableHead>上传者</TableHead>
                <TableHead>上传时间</TableHead>
                <TableHead className="text-center">下载</TableHead>
                <TableHead className="text-center">收藏</TableHead>
                <TableHead className="text-center">点赞</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material, index) => (
                  <TableRow key={material.id} className="hover:bg-muted/50 group">
                    <TableCell className="font-medium">
                      <div>
                        {material.title}
                        <div className="text-xs text-muted-foreground mt-1">{material.description.substring(0, 60)}...</div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {material.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs px-1.5 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{material.uploader}</TableCell>
                    <TableCell>{material.uploadTime}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center">
                        <Download className="h-4 w-4 mr-1 text-muted-foreground" />
                        {material.downloads}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center">
                        <BookmarkCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                        {material.favorites}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-muted-foreground" />
                        {material.likes}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => openEditDialog(material)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => openDeleteDialog(material)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    未找到符合条件的资料
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
      
      {/* 统计卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Upload className="mr-2 h-4 w-4 text-primary" />
              总资料数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{materials.length}</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Download className="mr-2 h-4 w-4 text-primary" />
              总下载数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {materials.reduce((sum, material) => sum + material.downloads, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Heart className="mr-2 h-4 w-4 text-primary" />
              总点赞数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {materials.reduce((sum, material) => sum + material.likes, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Tag className="mr-2 h-4 w-4 text-primary" />
              标签总数
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">{allTags.length}</p>
        </CardContent>
      </Card>
      </motion.div>
      
      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除《{materialToDelete?.title}》吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteMaterial}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>编辑资料</DialogTitle>
            <DialogDescription>
              修改资料信息，点击保存完成编辑。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">标题</Label>
              <Input 
                id="title" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea 
                id="description" 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)} 
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">标签（用逗号分隔）</Label>
              <Input 
                id="tags" 
                value={editTags} 
                onChange={(e) => setEditTags(e.target.value)} 
                placeholder="如：计算机科学, 算法, C语言"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialManagement;
