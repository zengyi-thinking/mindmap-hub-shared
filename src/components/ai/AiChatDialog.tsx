import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, SendHorizontal, Sparkles, RotateCcw, Settings, Key, Save } from 'lucide-react';
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

export const AiChatDialog: React.FC<AiChatDialogProps> = ({ isOpen, onClose }) => {
  // 使用AI服务的初始问候语
  const [messages, setMessages] = useState<Message[]>([
    aiService.getInitialGreeting()
  ]);
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

  // 重置对话
  const handleResetConversation = () => {
    aiService.resetConversation();
    setMessages([
      aiService.getInitialGreeting()
    ]);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            思维导图AI助手
          </DialogTitle>
          
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
        </DialogHeader>
        
        <div className="flex flex-col h-[60vh]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`flex max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground flex-row-reverse'
                          : 'bg-muted dark:bg-slate-800'
                      } p-3 rounded-lg`}
                    >
                      <div className="flex-shrink-0 mr-2">
                        {message.role === 'user' ? (
                          <div className="bg-primary-foreground p-1 rounded-full ml-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                        ) : (
                          <div className="bg-primary p-1 rounded-full mr-2">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        <div className={`text-xs ${
                          message.role === 'user'
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted dark:bg-slate-800 p-3 rounded-lg flex items-center">
                      <div className="bg-primary p-1 rounded-full mr-2">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <span className="animate-bounce delay-0">•</span>
                        <span className="animate-bounce delay-150">•</span>
                        <span className="animate-bounce delay-300">•</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleResetConversation}
                title="重置对话"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <form 
                className="flex-1 flex items-center space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  ref={inputRef}
                  placeholder="输入你的问题..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-primary text-white"
                >
                  <SendHorizontal className="h-4 w-4 mr-1" />
                  发送
                </Button>
              </form>
            </div>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              {isApiKeyNeeded && !currentApiKey ? (
                <span className="flex items-center justify-center">
                  <Key className="h-3 w-3 mr-1" />
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="underline hover:text-primary transition-colors"
                  >
                    设置{currentProviderInfo.name}API密钥
                  </button>
                  以启用更智能的回答
                </span>
              ) : (
                <>
                  当前使用: <span className="font-medium">{currentProviderInfo.name}</span>
                  {currentProvider !== 'local' && selectedModel && (
                    <> - {currentProviderInfo.modelOptions.find(m => m.id === selectedModel)?.name}</>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog; 