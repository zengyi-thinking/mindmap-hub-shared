
import React, { useState, useEffect } from 'react';
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
  Search,
  ChevronRight,
  Tag
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define hierarchical tag structure
interface TagCategory {
  id: string;
  name: string;
  children?: TagCategory[];
}

const MaterialUpload = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLevel1, setSelectedLevel1] = useState<string | null>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<string | null>(null);
  
  // Hierarchical tag system
  const tagHierarchy: TagCategory[] = [
    {
      id: "contests",
      name: "比赛",
      children: [
        {
          id: "math-modeling",
          name: "数学建模",
          children: [
            { id: "rules", name: "比赛规则" },
            { id: "previous-problems", name: "历年真题" },
            { id: "winning-works", name: "获奖作品" },
            { id: "notices", name: "比赛注意事项" }
          ]
        },
        {
          id: "programming",
          name: "程序设计",
          children: [
            { id: "algorithms", name: "算法" },
            { id: "languages", name: "编程语言" },
            { id: "frameworks", name: "开发框架" }
          ]
        },
        {
          id: "innovation",
          name: "创新创业",
          children: [
            { id: "business-plans", name: "商业计划书" },
            { id: "case-studies", name: "案例分析" },
            { id: "pitches", name: "路演材料" }
          ]
        }
      ]
    },
    {
      id: "cs",
      name: "计算机科学",
      children: [
        {
          id: "basics",
          name: "基础理论",
          children: [
            { id: "data-structures", name: "数据结构" },
            { id: "algorithms", name: "算法" },
            { id: "operating-systems", name: "操作系统" },
            { id: "computer-networks", name: "计算机网络" }
          ]
        },
        {
          id: "development",
          name: "开发技术",
          children: [
            { id: "frontend", name: "前端开发" },
            { id: "backend", name: "后端开发" },
            { id: "mobile", name: "移动开发" },
            { id: "database", name: "数据库" }
          ]
        },
        {
          id: "advanced",
          name: "高级主题",
          children: [
            { id: "ai", name: "人工智能" },
            { id: "ml", name: "机器学习" },
            { id: "cloud", name: "云计算" },
            { id: "security", name: "网络安全" }
          ]
        }
      ]
    },
    {
      id: "education",
      name: "教育资源",
      children: [
        {
          id: "textbooks",
          name: "教材",
          children: [
            { id: "undergraduate", name: "本科教材" },
            { id: "graduate", name: "研究生教材" },
            { id: "mooc", name: "在线课程" }
          ]
        },
        {
          id: "notes",
          name: "笔记",
          children: [
            { id: "lecture-notes", name: "课堂笔记" },
            { id: "summary", name: "总结归纳" }
          ]
        },
        {
          id: "exercises",
          name: "习题",
          children: [
            { id: "practice", name: "练习题" },
            { id: "exams", name: "考试题" },
            { id: "solutions", name: "解答" }
          ]
        }
      ]
    }
  ];

  // Sample materials data
  const materials = [
    { 
      id: 1, 
      title: '数据结构与算法分析 - C语言描述', 
      description: '详细介绍了常见数据结构与算法，包含代码示例与分析。',
      uploadTime: '2023-06-15',
      uploader: '张三',
      tags: ['计算机科学', '基础理论', '数据结构', 'C语言'],
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
      tags: ['计算机科学', '基础理论', '操作系统'],
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
      tags: ['计算机科学', '高级主题', '机器学习', 'Python'],
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
      tags: ['计算机科学', '开发技术', '前端开发', 'JavaScript'],
      downloads: 87,
      likes: 29,
      favorites: 15
    },
    { 
      id: 5, 
      title: '数学建模竞赛指南', 
      description: '详细介绍数学建模竞赛的基本流程、常用方法和技巧。',
      uploadTime: '2023-07-01',
      uploader: '数模爱好者',
      tags: ['比赛', '数学建模', '比赛规则'],
      downloads: 112,
      likes: 42,
      favorites: 28
    },
    { 
      id: 6, 
      title: '全国大学生数学建模竞赛历年真题', 
      description: '收集了近十年全国大学生数学建模竞赛的真题和优秀解答。',
      uploadTime: '2023-07-05',
      uploader: '数模专家',
      tags: ['比赛', '数学建模', '历年真题'],
      downloads: 156,
      likes: 58,
      favorites: 39
    }
  ];
  
  // Find all level1 tags
  const level1Tags = tagHierarchy.map(category => category.name);
  
  // Find level2 tags based on selected level1
  const getLevel2Tags = () => {
    if (!selectedLevel1) return [];
    const category = tagHierarchy.find(c => c.name === selectedLevel1);
    return category?.children?.map(child => child.name) || [];
  };
  
  // Find level3 tags based on selected level1 and level2
  const getLevel3Tags = () => {
    if (!selectedLevel1 || !selectedLevel2) return [];
    const category = tagHierarchy.find(c => c.name === selectedLevel1);
    const subcategory = category?.children?.find(c => c.name === selectedLevel2);
    return subcategory?.children?.map(child => child.name) || [];
  };
  
  // Helper to get the full tag path
  const getTagPath = (level3Tag: string) => {
    if (selectedLevel1 && selectedLevel2) {
      return `${selectedLevel1}-${selectedLevel2}-${level3Tag}`;
    }
    return level3Tag;
  };
  
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
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
    
    if (!selectedFile) {
      toast({
        title: "请选择要上传的文件",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate file upload
    simulateUpload();
    
    // Here we would handle the actual upload
    setTimeout(() => {
      toast({
        title: "上传成功",
        description: "您的资料已成功上传，正在等待审核",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedTags([]);
      setSelectedFile(null);
      setSelectedLevel1(null);
      setSelectedLevel2(null);
    }, 3500);
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
                
                <div className="grid w-full gap-3">
                  <Label className="mb-1">添加分级标签</Label>
                  
                  <div className="border rounded-md p-4 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">第一级标签</Label>
                      <div className="flex flex-wrap gap-2">
                        {level1Tags.map(tag => (
                          <Badge
                            key={tag}
                            variant={selectedLevel1 === tag ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => {
                              setSelectedLevel1(selectedLevel1 === tag ? null : tag);
                              setSelectedLevel2(null);
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {selectedLevel1 && (
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">第二级标签</Label>
                        <div className="flex flex-wrap gap-2">
                          {getLevel2Tags().map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedLevel2 === tag ? "default" : "outline"}
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => {
                                setSelectedLevel2(selectedLevel2 === tag ? null : tag);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedLevel1 && selectedLevel2 && (
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">第三级标签</Label>
                        <div className="flex flex-wrap gap-2">
                          {getLevel3Tags().map(tag => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(getTagPath(tag)) ? "default" : "outline"}
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => {
                                const fullTag = getTagPath(tag);
                                if (selectedTags.includes(fullTag)) {
                                  removeTag(fullTag);
                                } else {
                                  addTag(fullTag);
                                }
                              }}
                            >
                              {tag}
                              {selectedTags.includes(getTagPath(tag)) && (
                                <X className="ml-1 h-3 w-3" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">已选择的标签路径</Label>
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
                        {selectedTags.length === 0 && (
                          <span className="text-sm text-muted-foreground">未选择任何标签</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">添加自定义标签</Label>
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
                    </div>
                  </div>
                </div>
                
                <div className="grid w-full gap-1.5">
                  <Label>上传文件</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="font-medium">
                        {selectedFile ? selectedFile.name : "点击或拖拽文件到此处上传"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        支持的文件类型: PDF, DOCX, PPTX, ZIP, RAR (最大50MB)
                      </p>
                      {selectedFile && (
                        <Badge variant="outline" className="mt-2">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {isUploading && (
                  <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleUpload} 
                  className="flex items-center gap-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>上传中...({uploadProgress}%)</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      上传资料
                    </>
                  )}
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
                        {material.tags.map((tag, index) => (
                          <Badge 
                            key={`${tag}-${index}`} 
                            variant="secondary" 
                            className="text-xs"
                          >
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Tag className="h-4 w-4 mr-1" />
                              查看标签
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="space-y-2">
                              <h4 className="font-medium">标签路径</h4>
                              <div className="text-sm">
                                {material.tags.map((tag, i, arr) => (
                                  <span key={i}>
                                    {tag}
                                    {i < arr.length - 1 && <ChevronRight className="inline h-3 w-3 mx-1" />}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
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
