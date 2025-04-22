import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { userFilesService, commentsService } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Download,
  ThumbsUp,
  Heart,
  MessageSquare,
  FileText,
  Calendar,
  User,
  ChevronLeft,
  Send,
  Reply,
  Clock,
  Tag
} from 'lucide-react';
import MaterialComments from '@/modules/materials/components/MaterialComments';
import FilePreview from '@/modules/materials/components/FilePreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// 为MaterialDetail组件创建一个新类型
interface MaterialComment {
  id: number;
  materialId: number;
  parentId?: number;
  content: string;
  author: string;
  authorId: number;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  liked?: boolean;
  replies?: MaterialComment[];
}

const MaterialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [material, setMaterial] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<MaterialComment[]>([]);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [favoriteDialogOpen, setFavoriteDialogOpen] = useState(false);
  const [favoriteNote, setFavoriteNote] = useState('');
  
  useEffect(() => {
    if (!id) {
      navigate('/search');
      return;
    }
    
    const materialId = parseInt(id);
    const loadMaterial = () => {
      try {
        const foundMaterial = userFilesService.getById(materialId);
        if (foundMaterial) {
          setMaterial(foundMaterial);
          
          // 增加浏览次数
          userFilesService.incrementViews(materialId);
          
          // 检查用户是否已点赞/收藏此资料
          const likedMaterials = JSON.parse(localStorage.getItem('user_liked_materials') || '[]');
          const favoritedMaterials = JSON.parse(localStorage.getItem('user_favorited_materials') || '[]');
          
          setLiked(likedMaterials.includes(materialId));
          setFavorited(favoritedMaterials.includes(materialId));
          
          // 加载评论
          loadComments(materialId);
        } else {
          toast({
            title: "资料不存在",
            description: "找不到指定的资料，可能已被删除",
            variant: "destructive"
          });
          navigate('/search');
        }
      } catch (error) {
        console.error("加载资料出错:", error);
        toast({
          title: "加载失败",
          description: "加载资料时发生错误",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMaterial();
  }, [id, navigate]);
  
  // 初始加载时检查用户是否已收藏
  useEffect(() => {
    if (user && material) {
      const isFavorited = userFilesService.isFavoritedByUser(material.id, user.id);
      setFavorited(isFavorited);
    }
  }, [user, material]);
  
  const loadComments = (materialId: number) => {
    try {
      // 通过commentsService获取此资料的评论
      const materialComments = commentsService.getByMaterialId(materialId);
      
      // 获取用户点赞过的评论
      const likedComments = JSON.parse(localStorage.getItem('user_liked_comments') || '[]');
      
      // 转换为UI需要的格式，并添加liked标记
      const processedComments = materialComments.map(comment => ({
        ...comment,
        liked: likedComments.includes(comment.id),
        replies: [], // 将在下一步填充
      }));
      
      // 处理回复（parentId不为空的评论）
      const topLevelComments: MaterialComment[] = [];
      const replyMap: Record<number, MaterialComment[]> = {};
      
      processedComments.forEach(comment => {
        if (comment.parentId) {
          // 这是一个回复
          if (!replyMap[comment.parentId]) {
            replyMap[comment.parentId] = [];
          }
          replyMap[comment.parentId].push(comment);
        } else {
          // 这是一个顶级评论
          topLevelComments.push(comment);
        }
      });
      
      // 将回复添加到相应的父评论中
      topLevelComments.forEach(comment => {
        if (replyMap[comment.id]) {
          comment.replies = replyMap[comment.id];
        }
      });
      
      // 按时间排序
      topLevelComments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setComments(topLevelComments);
    } catch (error) {
      console.error("加载评论出错:", error);
    }
  };
  
  const handleAddComment = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能发表评论",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: "评论内容不能为空",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const materialId = parseInt(id!);
      
      const commentData = {
        materialId,
        parentId: undefined, // 顶级评论
        content: newComment.trim(),
        author: user.username,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      // 保存评论
      const savedComment = commentsService.add(commentData);
      
      // 更新UI
      const newCommentObj: MaterialComment = {
        ...savedComment,
        liked: false,
        replies: []
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      
      toast({
        title: "评论成功",
        description: "您的评论已成功发布"
      });
    } catch (error) {
      console.error("添加评论出错:", error);
      toast({
        title: "评论失败",
        description: "发布评论时发生错误",
        variant: "destructive"
      });
    }
  };
  
  const handleLikeMaterial = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能点赞",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const materialId = parseInt(id!);
      const likedMaterials = JSON.parse(localStorage.getItem('user_liked_materials') || '[]');
      
      // 切换点赞状态
      if (liked) {
        // 取消点赞
        const updatedLikedMaterials = likedMaterials.filter((id: number) => id !== materialId);
        localStorage.setItem('user_liked_materials', JSON.stringify(updatedLikedMaterials));
        
        // 更新资料点赞数
        const updatedMaterial = userFilesService.update(materialId, {
          likes: (material.likes || 0) - 1
        });
        
        if (updatedMaterial) {
          setMaterial(updatedMaterial);
        }
      } else {
        // 添加点赞
        likedMaterials.push(materialId);
        localStorage.setItem('user_liked_materials', JSON.stringify(likedMaterials));
        
        // 更新资料点赞数
        const updatedMaterial = userFilesService.update(materialId, {
          likes: (material.likes || 0) + 1
        });
        
        if (updatedMaterial) {
          setMaterial(updatedMaterial);
        }
      }
      
      setLiked(!liked);
      
      toast({
        title: liked ? "已取消点赞" : "点赞成功",
      });
    } catch (error) {
      console.error("点赞出错:", error);
      toast({
        title: "操作失败",
        description: "点赞操作失败，请稍后再试",
        variant: "destructive"
      });
    }
  };
  
  const handleFavoriteMaterial = () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能收藏",
        variant: "destructive"
      });
      return;
    }
    
    // 如果已经收藏，则取消收藏
    if (favorited) {
      try {
        const updatedMaterial = userFilesService.removeFavorite(parseInt(id!), user.id);
        
        if (updatedMaterial) {
          setMaterial(updatedMaterial);
          setFavorited(false);
        }
        
        toast({
          title: "已取消收藏",
        });
      } catch (error) {
        console.error("取消收藏出错:", error);
        toast({
          title: "操作失败",
          description: "取消收藏操作失败，请稍后再试",
          variant: "destructive"
        });
      }
    } else {
      // 如果未收藏，打开收藏对话框
      setFavoriteDialogOpen(true);
    }
  };
  
  // 确认收藏
  const handleConfirmFavorite = () => {
    try {
      const updatedMaterial = userFilesService.addFavorite(
        parseInt(id!), 
        user?.id!, 
        user?.username!, 
        favoriteNote
      );
      
      if (updatedMaterial) {
        setMaterial(updatedMaterial);
        setFavorited(true);
      }
      
      // 关闭对话框并重置备注
      setFavoriteDialogOpen(false);
      setFavoriteNote('');
      
      toast({
        title: "收藏成功",
      });
    } catch (error) {
      console.error("收藏出错:", error);
      toast({
        title: "操作失败",
        description: "收藏操作失败，请稍后再试",
        variant: "destructive"
      });
    }
  };
  
  // 取消收藏操作
  const handleCancelFavorite = () => {
    setFavoriteDialogOpen(false);
    setFavoriteNote('');
  };
  
  const handleDownload = () => {
    if (!material || !material.file || !material.file.dataUrl) {
      toast({
        title: "下载失败",
        description: "文件数据不完整或不可用",
        variant: "destructive"
      });
      return;
    }
    
    // 创建临时链接并触发下载
    const link = document.createElement('a');
    link.href = material.file.dataUrl;
    link.download = material.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 增加下载次数
    const materialId = parseInt(id!);
    userFilesService.incrementDownloads(materialId);
    
    // 更新UI中的下载次数
    setMaterial({
      ...material,
      downloads: (material.downloads || 0) + 1
    });
    
    toast({
      title: "下载开始",
      description: `正在下载 ${material.title || material.file.name}`
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-16 w-16 border-4 border-t-primary border-primary/30 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!material) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">资料不存在</h2>
        <p className="text-muted-foreground mb-4">找不到指定的资料，可能已被删除</p>
        <Button onClick={() => navigate('/search')}>
          返回搜索
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className="gap-1" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
          返回
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧：资料信息 */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{material.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{material.username || '未知用户'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>上传于：{new Date(material.uploadTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>文件名：{material.file.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>文件大小：{(material.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  标签
                </h3>
                <div className="flex flex-wrap gap-1">
                  {material.tags && material.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold">{material.views || 0}</p>
                  <p className="text-xs text-muted-foreground">浏览</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{material.downloads || 0}</p>
                  <p className="text-xs text-muted-foreground">下载</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{material.likes || 0}</p>
                  <p className="text-xs text-muted-foreground">点赞</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  下载
                </Button>
                <Button 
                  variant="outline" 
                  className={`${liked ? 'text-red-500' : ''}`}
                  onClick={handleLikeMaterial}
                >
                  <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline"
                  className={`${favorited ? 'text-yellow-500' : ''}`}
                  onClick={handleFavoriteMaterial}
                >
                  <Heart className={`h-4 w-4 ${favorited ? 'fill-yellow-500' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">资料描述</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{material.description || '没有描述信息'}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* 右侧：资料预览和评论 */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="preview" className="flex-1">
                <FileText className="h-4 w-4 mr-1" />
                资料预览
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-1" />
                评论 ({comments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6">
                  <FilePreview file={material.file} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">评论区</CardTitle>
                  <CardDescription>
                    与其他用户交流讨论该资料
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 添加评论 */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback>{user?.username?.[0] || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea 
                        placeholder="发表评论..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <Button 
                        className="self-end"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* 评论列表 */}
                  <MaterialComments 
                    comments={comments} 
                    setComments={setComments} 
                    materialId={parseInt(id!)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* 收藏对话框 */}
      <Dialog open={favoriteDialogOpen} onOpenChange={setFavoriteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>收藏资料</DialogTitle>
            <DialogDescription>
              请添加收藏备注（可选），帮助您记住收藏这个资料的原因
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="favorite-note">收藏备注</Label>
              <Textarea
                id="favorite-note"
                placeholder="添加备注信息（可选）"
                value={favoriteNote}
                onChange={(e) => setFavoriteNote(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                收藏时间：{new Date().toLocaleString()}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">收藏路径：</span>
              {material?.folderPath && material.folderPath.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {material.folderPath.map((folder, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="text-muted-foreground mx-1">›</span>}
                      <Badge variant="outline" className="text-xs">
                        {folder}
                      </Badge>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">无分类路径</span>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelFavorite}>取消</Button>
            <Button onClick={handleConfirmFavorite}>确认收藏</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialDetail; 
