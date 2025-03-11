
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  X, 
  Plus, 
  FileText, 
  Clock, 
  Download, 
  ThumbsUp, 
  Heart, 
  Star,
  Search
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MaterialUpload = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const popularTags = [
    '计算机科学', '软件工程', '人工智能', '机器学习', 
    '数据结构', '算法', '操作系统', '计算机网络',
    '数据库', '前端开发', '后端开发', '移动开发',
    '云计算', '分布式系统', '网络安全', '编程语言'
  ];
  
  const materials = [
    { 
      id: 1, 
      title: '数据结构与算法分析 - C语言描述', 
      description: '详细介绍了常见数据结构与算法，包含代码示例与分析。',
      uploadTime: '2023-06-15',
      uploader: '张三',
      tags: ['数据结构', '算法', '计算机科学', 'C语言'],
      downloads: 128,
      likes: 45,
      favorites: 23
    },
    { 
      id: 2, 
      title: '操作系统概念（第9版）课件', 
      description: '操作系统概念课程的全套课件，包含详细解说与练习题。',
      uploadTime: '2023-06-10',
      uploader: '李四',
      tags: ['操作系统', '计算机科学'],
      downloads: 96,
      likes: 32,
      favorites: 18
    },
    { 
      id: 3, 
      title: '机器学习实战 - Python实现', 
      description: '通过Python实现常见的机器学习算法，并附有实际应用案例。',
      uploadTime: '2023-06-05',
      uploader: '王五',
      tags: ['机器学习', '人工智能', 'Python'],
      downloads: 156,
      likes: 67,
      favorites: 41
    },
    { 
      id: 4, 
      title: '现代前端开发指南', 
      description: '全面介绍现代前端开发技术栈、工具链与最佳实践。',
      uploadTime: '2023-06-01',
      uploader: '赵六',
      tags: ['前端开发', 'JavaScript', 'React', 'Vue'],
      downloads: 87,
      likes: 29,
      favorites: 15
    },
  ];
  
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };
  
  const handleUpload = () => {
    if (!title.trim()) {
      toast({
        title: "请输入资料标题",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedTags.length === 0) {
      toast({
        title: "请至少选择一个标签",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would handle the actual upload
    toast({
      title: "上传成功",
      description: "您的资料已成功上传"
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setSelectedTags([]);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredMaterials = materials.filter(material => 
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight"
          >
            资料上传与分享
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="text-muted-foreground"
          >
            上传资料并与其他用户分享，通过标签归类整理
          </motion.p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload">上传资料</TabsTrigger>
          <TabsTrigger value="browse">浏览资料</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>上传新资料</CardTitle>
                <CardDescription>
                  请填写资料信息并添加标签，让其他用户更容易找到您分享的内容
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="title">资料标题</Label>
                  <Input
                    id="title"
                    placeholder="输入资料标题"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="description">资料描述</Label>
                  <Textarea
                    id="description"
                    placeholder="简要描述此资料的内容和用途"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label>添加标签</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 rounded-full hover:bg-accent p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="自定义标签"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddCustomTag}
                    >
                      添加
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">热门标签:</p>
                    <ScrollArea className="h-24 rounded-md border">
                      <div className="flex flex-wrap gap-2 p-4">
                        {popularTags.map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => addTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label>上传文件</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="font-medium">点击或拖拽文件到此处上传</p>
                      <p className="text-xs text-muted-foreground">
                        支持的文件类型: PDF, DOCX, PPTX, ZIP, RAR (最大50MB)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleUpload} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  上传资料
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="browse">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map((material) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass-card subtle-hover h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{material.title}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {material.uploadTime} · 上传者: {material.uploader}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm mb-3">{material.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {material.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" /> {material.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {material.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" /> {material.favorites}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="flex gap-2 ml-auto">
                        <Button size="sm" variant="ghost">
                          <Heart className="h-4 w-4 mr-1" />
                          收藏
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialUpload;
