import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bot, User, SendHorizontal, Sparkles, RotateCcw, 
  Settings, Key, Save, FileText, Book, MapPin, 
  BrainCircuit, FileUp, ListTodo, Compass,
  Download, Trash2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService, Message } from './aiService';
import { v4 as uuidv4 } from 'uuid';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ApiProvider, 
  apiProviders, 
  getApiKey, 
  saveApiKey,
  getAiConfig,
  saveAiConfig
} from './aiConfig';

interface AiChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// 本地存储键名常量
const CONVERSATION_HISTORY_KEY = 'ai_conversation_history';
const MAX_STORED_MESSAGES = 50; // 限制存储的消息数量，防止本地存储过大

export const AiChatDialog: React.FC<AiChatDialogProps> = ({ isOpen, onClose }) => {
  // 使用AI服务的初始问候语作为默认消息
  const defaultGreeting = aiService.getInitialGreeting();
  
  // 将消息状态初始化移至useEffect中，以便从本地存储加载
  const [messages, setMessages] = useState<Message[]>([defaultGreeting]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // API设置相关状态
  const [currentProvider, setCurrentProvider] = useState<ApiProvider>(
    aiService.getCurrentProvider()
  );
  const [apiKeys, setApiKeys] = useState<Record<ApiProvider, string>>(() => {
    const providers = Object.keys(apiProviders) as ApiProvider[];
    const keys: Record<ApiProvider, string> = {} as Record<ApiProvider, string>;
    
    providers.forEach(provider => {
      keys[provider] = getApiKey(provider);
    });
    
    return keys;
  });
  const [selectedModel, setSelectedModel] = useState(aiService.getCurrentModelId());
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 当对话框打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 历史会话相关状态
  const [hasHistory, setHasHistory] = useState(false);
  
  // 加载对话历史
  const loadConversationHistory = () => {
    try {
      const savedHistory = localStorage.getItem(CONVERSATION_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory) as Message[];
        
        // 验证解析的历史数据是否有效
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          // 确保所有消息都有有效的timestamp属性（字符串转Date对象）
          const validHistory = parsedHistory.map(message => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }));
          
          setMessages(validHistory);
          setHasHistory(true);
          return true;
        }
      }
    } catch (error) {
      console.error('加载对话历史失败:', error);
    }
    return false;
  };
  
  // 保存对话历史
  const saveConversationHistory = () => {
    try {
      // 如果消息超过限制，只保存最近的部分
      const historyToSave = messages.length > MAX_STORED_MESSAGES
        ? messages.slice(-MAX_STORED_MESSAGES)
        : messages;
        
      localStorage.setItem(CONVERSATION_HISTORY_KEY, JSON.stringify(historyToSave));
    } catch (error) {
      console.error('保存对话历史失败:', error);
    }
  };
  
  // 清除对话历史
  const clearConversationHistory = () => {
    try {
      localStorage.removeItem(CONVERSATION_HISTORY_KEY);
      handleResetConversation();
      setHasHistory(false);
      toast({
        title: "历史记录已清除",
        description: "所有对话历史已被清除",
      });
    } catch (error) {
      console.error('清除对话历史失败:', error);
      toast({
        title: "清除失败",
        description: "清除对话历史时出现错误",
        variant: "destructive"
      });
    }
  };
  
  // 在组件首次挂载时尝试加载历史对话
  useEffect(() => {
    if (!loadConversationHistory()) {
      // 如果没有历史记录或加载失败，使用默认问候语
      setMessages([defaultGreeting]);
    }
  }, []);
  
  // 当消息更新时保存对话历史
  // 排除初次加载和重置对话的情况
  useEffect(() => {
    // 只有当消息数量大于1时才保存（避免保存只有问候语的空对话）
    // 或者当消息数量为1但不是默认问候语时
    if (
      (messages.length > 1) || 
      (messages.length === 1 && messages[0].id !== defaultGreeting.id)
    ) {
      saveConversationHistory();
      if (!hasHistory && messages.length > 1) {
        setHasHistory(true);
      }
    }
  }, [messages]);
  
  // 修改重置对话的处理函数
  const handleResetConversation = () => {
    aiService.resetConversation();
    const newGreeting = aiService.getInitialGreeting();
    setMessages([newGreeting]);
  };

  // 保存API设置
  const saveSettings = () => {
    // 保存所有API密钥
    Object.entries(apiKeys).forEach(([provider, key]) => {
      saveApiKey(provider as ApiProvider, key);
    });
    
    // 保存当前提供商和模型选择
    saveAiConfig({
      apiProvider: currentProvider,
      modelId: selectedModel
    });
    
    setShowSettings(false);
    
    // 重置对话
    handleResetConversation();
    
    toast({
      title: "设置已保存",
      description: `已切换到${apiProviders[currentProvider].name}，所有设置已成功保存`,
    });
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: uuidv4(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // 使用AI服务获取响应
      const aiResponse = await aiService.getResponse(userMessage.content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      // 如果API调用失败，显示错误消息
      const errorMessage: Message = {
        id: uuidv4(),
        content: '抱歉，我暂时无法回答你的问题。请稍后再试或检查API设置。',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('AI响应错误:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理API密钥更改
  const handleApiKeyChange = (provider: ApiProvider, key: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: key
    }));
  };
  
  // 获取当前配置状态
  const config = getAiConfig();
  const isApiKeyNeeded = currentProvider !== 'local';
  const currentApiKey = apiKeys[currentProvider] || '';
  const currentProviderInfo = apiProviders[currentProvider];

  // AI工具状态
  const [activeTab, setActiveTab] = useState<'chat' | 'tools'>('chat');
  const [activeTool, setActiveTool] = useState<'mindmap' | 'notes' | 'path'>('mindmap');
  
  // 自动生成思维导图状态
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isGeneratingMindmap, setIsGeneratingMindmap] = useState(false);
  const [generatedMindmap, setGeneratedMindmap] = useState<{nodes: any[], edges: any[]} | null>(null);
  
  // 智能笔记整理状态
  const [discussionComments, setDiscussionComments] = useState<any[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [organizedNotes, setOrganizedNotes] = useState<string>('');
  const [isOrganizingNotes, setIsOrganizingNotes] = useState(false);
  
  // 个性化学习路径状态
  const [learningPathRecommendation, setLearningPathRecommendation] = useState<any>(null);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  
  // 获取材料列表
  useEffect(() => {
    // 这里应该从服务或存储中获取材料列表
    // 模拟数据
    const mockMaterials = [
      { id: 1, title: '计算机网络基础', description: '介绍计算机网络的基本概念和原理', tags: ['网络', '计算机'] },
      { id: 2, title: '数据结构与算法', description: '讲解常见的数据结构和算法', tags: ['算法', '编程'] },
      { id: 3, title: '人工智能导论', description: '人工智能的基础知识和应用', tags: ['AI', '机器学习'] }
    ];
    setMaterials(mockMaterials);
    
    // 模拟讨论数据
    const mockComments = [
      { id: 1, materialId: 1, userName: '用户A', content: '我觉得TCP/IP协议非常重要', timestamp: new Date().toISOString() },
      { id: 2, materialId: 1, userName: '用户B', content: '网络安全也需要重点关注', timestamp: new Date().toISOString() },
      { id: 3, materialId: 2, userName: '用户C', content: '红黑树的平衡操作有点难理解', timestamp: new Date().toISOString() }
    ];
    setDiscussionComments(mockComments);
  }, []);

  // 处理思维导图生成
  const handleGenerateMindmap = async () => {
    if (!selectedMaterial) return;
    
    setIsGeneratingMindmap(true);
    try {
      const result = await aiService.generateMindMapFromMaterial(selectedMaterial);
      setGeneratedMindmap(result);
      
      // 添加系统消息通知生成成功
      const successMessage: Message = {
        id: uuidv4(),
        content: `已成功生成"${selectedMaterial.title}"的思维导图结构，包含${result.nodes.length}个节点和${result.edges.length}个连接。你可以在编辑器中使用这个结构。`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
      setActiveTab('chat'); // 返回聊天界面
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        content: `生成思维导图失败: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingMindmap(false);
    }
  };

  // 处理笔记整理
  const handleOrganizeNotes = async () => {
    if (!selectedDiscussion) return;
    
    const relevantComments = discussionComments.filter(
      comment => comment.materialId === selectedDiscussion.id
    );
    
    if (relevantComments.length === 0) {
      const warningMessage: Message = {
        id: uuidv4(),
        content: `未找到与"${selectedDiscussion.title}"相关的讨论内容，无法生成笔记。`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }
    
    setIsOrganizingNotes(true);
    try {
      const notes = await aiService.organizeDiscussionNotes(relevantComments);
      setOrganizedNotes(notes);
      
      // 添加系统消息通知生成成功
      const successMessage: Message = {
        id: uuidv4(),
        content: `已成功整理"${selectedDiscussion.title}"的讨论内容为结构化笔记。`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
      setActiveTab('chat'); // 返回聊天界面
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        content: `整理笔记失败: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsOrganizingNotes(false);
    }
  };

  // 处理学习路径生成
  const handleGenerateLearningPath = async () => {
    // 模拟用户浏览历史
    const mockViewHistory = [
      { title: '计算机网络基础', tags: ['网络', '计算机'] },
      { title: '数据结构中的树', tags: ['算法', '数据结构'] }
    ];
    
    // 模拟可用的思维导图
    const mockMindMaps = [
      { id: 1, title: '计算机网络完全指南', tags: ['网络', '协议', '安全'] },
      { id: 2, title: '数据结构与算法可视化', tags: ['算法', '数据结构', '编程'] },
      { id: 3, title: '操作系统原理', tags: ['操作系统', '计算机'] },
    ];
    
    setIsGeneratingPath(true);
    try {
      const recommendation = await aiService.generateLearningPathRecommendations(
        mockViewHistory,
        mockMindMaps,
        materials
      );
      setLearningPathRecommendation(recommendation);
      
      // 构建推荐消息
      let recommendationText = `📚 **个性化学习路径**\n\n${recommendation.learningPath}\n\n`;
      
      if (recommendation.recommendedMindMaps.length > 0) {
        recommendationText += "**推荐思维导图**:\n";
        recommendation.recommendedMindMaps.forEach(map => {
          recommendationText += `- ${map.title}\n`;
        });
        recommendationText += "\n";
      }
      
      if (recommendation.recommendedMaterials.length > 0) {
        recommendationText += "**推荐学习资料**:\n";
        recommendation.recommendedMaterials.forEach(mat => {
          recommendationText += `- ${mat.title}\n`;
        });
      }
      
      // 添加系统消息通知
      const successMessage: Message = {
        id: uuidv4(),
        content: recommendationText,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
      setActiveTab('chat'); // 返回聊天界面
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        content: `生成学习路径失败: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingPath(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            思维导图AI助手
          </DialogTitle>
          
          {/* 工具/设置按钮组 */}
          <div className="flex items-center space-x-2">
            <Tabs 
              value={activeTab} 
              onValueChange={(v) => setActiveTab(v as 'chat' | 'tools')}
              className="w-auto mr-2"
            >
              <TabsList className="grid grid-cols-2 h-8 w-36">
                <TabsTrigger value="chat" className="text-xs">
                  对话
                </TabsTrigger>
                <TabsTrigger value="tools" className="text-xs flex items-center gap-1">
                  <BrainCircuit className="h-3 w-3" />
                  智能工具
                </TabsTrigger>
              </TabsList>
            </Tabs>
          
          {/* 设置按钮 */}
          <Popover open={showSettings} onOpenChange={setShowSettings}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">AI助手设置</h4>
                
                {/* API提供商选择 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    选择AI提供商
                  </label>
                  <Tabs 
                    defaultValue={currentProvider} 
                    value={currentProvider}
                    onValueChange={(value) => setCurrentProvider(value as ApiProvider)}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="local">本地</TabsTrigger>
                      <TabsTrigger value="openai">OpenAI</TabsTrigger>
                      <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
                      <TabsTrigger value="doubao">豆包</TabsTrigger>
                    </TabsList>
                    <TabsContent value={currentProvider}>
                      <div className="space-y-2 mt-2">
                        {isApiKeyNeeded && (
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Key className="h-4 w-4 mr-2" />
                              <label className="text-xs font-medium">
                                {currentProviderInfo.label}
                              </label>
                            </div>
                            <Input
                              type="password"
                              value={currentApiKey}
                              onChange={(e) => handleApiKeyChange(currentProvider, e.target.value)}
                              placeholder={currentProviderInfo.placeholder}
                              className="flex-1"
                            />
                            <p className="text-xs text-muted-foreground">
                              密钥仅存储在您的本地设备上，不会传输到其他地方。
                            </p>
                          </div>
                        )}
                        
                        {/* 模型选择 */}
                        <div className="space-y-2 mt-4">
                          <label className="text-xs font-medium">选择模型</label>
                          <Select 
                            value={selectedModel} 
                            onValueChange={setSelectedModel}
                            disabled={currentProvider === 'local'}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择模型" />
                            </SelectTrigger>
                            <SelectContent>
                              {currentProviderInfo.modelOptions.map(model => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <Button onClick={saveSettings} className="w-full">
                  <Save className="h-4 w-4 mr-1" />
                  保存设置
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          </div>
        </DialogHeader>
        
        {/* 对话与工具选项卡内容 */}
        {activeTab === 'chat' ? (
          // 聊天对话内容
        <div className="flex flex-col h-[60vh]">
          <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 mb-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex items-start max-w-[80%] ${
                        message.role === 'user'
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } rounded-lg px-3 py-2 text-sm`}>
                      <div className="mt-0.5 mr-2">
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // 处理 Markdown 加粗
                          .replace(/\n/g, '<br />') // 处理换行符
                      }}></div>
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
            <div className="flex flex-col pt-4 border-t">
              {/* 历史会话管理按钮组 - 只在有历史记录时显示 */}
              {hasHistory && messages.length > 1 && (
                <div className="flex justify-between mb-3">
                  <div className="text-xs text-muted-foreground">
                    共 {messages.length} 条对话消息
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 text-xs flex items-center gap-1"
                      onClick={clearConversationHistory}
                    >
                      <Trash2 className="h-3 w-3" />
                      清除历史
                    </Button>
                  </div>
                </div>
              )}
              
              {/* 对话输入区域 */}
            <div className="flex items-center space-x-2">
              <Button 
                  onClick={handleResetConversation} 
                variant="outline" 
                size="icon" 
                title="重置对话"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="输入您的问题或指令..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputValue.trim()}
                  variant="default"
                  size="icon"
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // AI工具内容
          <div className="flex flex-col h-[60vh]">
            <Tabs 
              value={activeTool} 
              onValueChange={(v) => setActiveTool(v as 'mindmap' | 'notes' | 'path')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="mindmap" className="text-xs flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  自动生成思维导图
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs flex items-center gap-1">
                  <ListTodo className="h-3 w-3" />
                  智能笔记整理
                </TabsTrigger>
                <TabsTrigger value="path" className="text-xs flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  学习路径推荐
                </TabsTrigger>
              </TabsList>
              
              {/* 自动生成思维导图 */}
              <TabsContent value="mindmap" className="mt-4 space-y-4">
                <div className="text-sm text-muted-foreground">
                  选择一个资料，AI将自动分析内容并生成思维导图初始结构。
                </div>
                
                <Select 
                  value={selectedMaterial ? String(selectedMaterial.id) : ''} 
                  onValueChange={(value) => {
                    const selected = materials.find(m => String(m.id) === value);
                    setSelectedMaterial(selected || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择资料" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map(material => (
                      <SelectItem key={material.id} value={String(material.id)}>
                        {material.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedMaterial && (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <div className="font-medium">{selectedMaterial.title}</div>
                    <div className="text-muted-foreground mt-1">{selectedMaterial.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedMaterial.tags.map((tag: string) => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          {tag}
                </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleGenerateMindmap} 
                  disabled={!selectedMaterial || isGeneratingMindmap}
                  className="w-full"
                >
                  {isGeneratingMindmap ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      生成中...
                    </>
                  ) : (
                    <>生成思维导图</>
                  )}
                </Button>
              </TabsContent>
              
              {/* 智能笔记整理 */}
              <TabsContent value="notes" className="mt-4 space-y-4">
                <div className="text-sm text-muted-foreground">
                  选择一个讨论话题，AI将自动整理相关讨论为结构化笔记。
                </div>
                
                <Select 
                  value={selectedDiscussion ? String(selectedDiscussion.id) : ''} 
                  onValueChange={(value) => {
                    const selected = materials.find(m => String(m.id) === value);
                    setSelectedDiscussion(selected || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择讨论主题" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map(material => (
                      <SelectItem key={material.id} value={String(material.id)}>
                        {material.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedDiscussion && (
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <div className="font-medium">{selectedDiscussion.title}</div>
                    <div className="text-muted-foreground mt-1">
                      相关讨论: {discussionComments.filter(c => c.materialId === selectedDiscussion.id).length} 条评论
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleOrganizeNotes} 
                  disabled={!selectedDiscussion || isOrganizingNotes}
                  className="w-full"
                >
                  {isOrganizingNotes ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      整理中...
                    </>
                  ) : (
                    <>整理为结构化笔记</>
                  )}
                </Button>
              </TabsContent>
              
              {/* 学习路径推荐 */}
              <TabsContent value="path" className="mt-4 space-y-4">
                <div className="text-sm text-muted-foreground">
                  根据您的使用习惯和浏览历史，AI将为您推荐个性化学习路径。
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm">
                  <div className="font-medium">个性化推荐</div>
                  <div className="text-muted-foreground mt-1">
                    系统将分析您的浏览历史和感兴趣的内容，推荐适合您的学习路径和资料。
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateLearningPath} 
                  disabled={isGeneratingPath}
                  className="w-full"
                >
                  {isGeneratingPath ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      生成中...
                    </>
                  ) : (
                    <>生成学习路径推荐</>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="flex-1 overflow-auto">
              {/* 这里可以显示操作结果预览 */}
            </div>
            
            <div className="border-t pt-4 mt-auto">
              <Button 
                onClick={() => setActiveTab('chat')} 
                variant="outline" 
                className="w-full"
              >
                返回对话
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog; 