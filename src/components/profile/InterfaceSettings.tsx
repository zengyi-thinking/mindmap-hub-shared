import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Sparkles, 
  MessageSquare, 
  Key,
  Save,
  Bot,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from '@/components/ui/use-toast';
import { 
  getAiConfig, 
  saveAiConfig, 
  getApiKey, 
  saveApiKey, 
  ApiProvider, 
  apiProviders,
  defaultAiConfig 
} from '@/components/ai/aiConfig';

const InterfaceSettings: React.FC = () => {
  // 主题设置
  const { theme, setTheme } = useTheme();
  
  // AI设置
  const [aiSettings, setAiSettings] = useState(() => {
    // 默认设置，会在useEffect中更新
    return {
      enabled: true,
      floatingType: 'button' as 'button' | 'bubble',
      apiProvider: 'local' as ApiProvider,
      modelId: 'local',
      systemPrompt: '',
      defaultGreeting: ''
    };
  });
  
  // API密钥
  const [apiKeys, setApiKeys] = useState<Record<ApiProvider, string>>({} as Record<ApiProvider, string>);
  
  // 加载设置
  useEffect(() => {
    // 客户端加载设置
    if (typeof window !== 'undefined') {
      try {
        const config = getAiConfig();
        setAiSettings({
          enabled: config.enabled,
          floatingType: config.floatingType,
          apiProvider: config.apiProvider,
          modelId: config.modelId,
          systemPrompt: config.systemPrompt,
          defaultGreeting: config.defaultGreeting
        });
        
        // 加载所有API密钥
        const providers = Object.keys(apiProviders) as ApiProvider[];
        const keys: Record<ApiProvider, string> = {} as Record<ApiProvider, string>;
        
        providers.forEach(provider => {
          keys[provider] = getApiKey(provider);
        });
        
        setApiKeys(keys);
      } catch (e) {
        console.error('加载设置失败:', e);
      }
    }
  }, []);
  
  // 保存设置
  const saveSettings = () => {
    // 保存AI助手设置
    saveAiConfig(aiSettings);
    
    // 保存所有API密钥
    Object.entries(apiKeys).forEach(([provider, key]) => {
      saveApiKey(provider as ApiProvider, key);
    });
    
    toast({
      title: "设置已保存",
      description: "您的界面设置已成功保存",
    });
  };
  
  // 处理AI设置变更
  const handleAiSettingChange = (key: string, value: any) => {
    setAiSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 处理API密钥变更
  const handleApiKeyChange = (provider: ApiProvider, key: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: key
    }));
  };
  
  // 打开API帮助链接
  const openApiHelpLink = (provider: ApiProvider) => {
    const helpUrl = apiProviders[provider].helpUrl;
    if (helpUrl) {
      window.open(helpUrl, '_blank');
    }
  };
  
  const currentProviderInfo = apiProviders[aiSettings.apiProvider];
  const isApiKeyNeeded = aiSettings.apiProvider !== 'local';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">界面设置</h2>
        <Button onClick={saveSettings}>
          <Save className="h-4 w-4 mr-2" />
          保存所有设置
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sun className="h-5 w-5 mr-2 text-yellow-500" />
            <Moon className="h-5 w-5 mr-2 text-blue-500" />
            主题设置
          </CardTitle>
          <CardDescription>
            选择您喜欢的应用主题显示模式
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div 
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted'}`}
              onClick={() => setTheme('light')}
            >
              <Sun className="h-8 w-8 mb-2 text-yellow-500" />
              <span>明亮模式</span>
            </div>
            <div 
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted'}`}
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-8 w-8 mb-2 text-blue-500" />
              <span>暗黑模式</span>
            </div>
            <div 
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-muted'}`}
              onClick={() => setTheme('system')}
            >
              <Monitor className="h-8 w-8 mb-2 text-gray-500" />
              <span>跟随系统</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI助手设置
          </CardTitle>
          <CardDescription>
            自定义AI助手的行为和外观
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 基本设置 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用AI助手</Label>
                <p className="text-sm text-muted-foreground">
                  控制是否在应用中显示AI助手
                </p>
              </div>
              <Switch
                checked={aiSettings.enabled}
                onCheckedChange={(checked) => handleAiSettingChange('enabled', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>交互方式</Label>
              <Select
                value={aiSettings.floatingType}
                onValueChange={(value) => handleAiSettingChange('floatingType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择交互方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="button">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2" />
                      <span>简单按钮</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bubble">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>气泡预览</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                简单按钮：仅显示一个可点击的按钮；气泡预览：显示带有预览文本的气泡
              </p>
            </div>
          </div>
          
          {/* API设置 */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">API设置</h3>
            
            <div className="space-y-2">
              <Label>AI提供商</Label>
              <Select
                value={aiSettings.apiProvider}
                onValueChange={(value) => {
                  handleAiSettingChange('apiProvider', value);
                  // 更新为当前提供商的默认模型
                  const provider = value as ApiProvider;
                  const defaultModel = apiProviders[provider].modelOptions[0]?.id || 'local';
                  handleAiSettingChange('modelId', defaultModel);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择AI提供商" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">本地模式</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                  <SelectItem value="doubao">豆包</SelectItem>
                  <SelectItem value="moonshot">Moonshot AI</SelectItem>
                  <SelectItem value="baidu">文心一言</SelectItem>
                  <SelectItem value="spark">讯飞星火</SelectItem>
                  <SelectItem value="zhipu">智谱AI</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {aiSettings.apiProvider === 'local' 
                 ? '本地模式使用预设回复，不需要API密钥' 
                 : `使用${currentProviderInfo.name}的API，需要配置API密钥`}
              </p>
            </div>
            
            {isApiKeyNeeded && (
              <div className="space-y-2">
                <Label>
                  <div className="flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    {currentProviderInfo.label}
                  </div>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder={currentProviderInfo.placeholder}
                    value={apiKeys[aiSettings.apiProvider] || ''}
                    onChange={(e) => handleApiKeyChange(aiSettings.apiProvider, e.target.value)}
                    className="flex-1"
                  />
                  {currentProviderInfo.helpUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openApiHelpLink(aiSettings.apiProvider)}
                      title={`如何获取${currentProviderInfo.name}的API密钥`}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    您的API密钥将安全地存储在本地，不会传输至我们的服务器
                  </p>
                  {currentProviderInfo.helpUrl && (
                    <a 
                      href={currentProviderInfo.helpUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      获取{currentProviderInfo.name}密钥
                    </a>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>模型选择</Label>
              <Select
                value={aiSettings.modelId}
                onValueChange={(value) => handleAiSettingChange('modelId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {currentProviderInfo.modelOptions.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                选择您想要使用的AI模型
              </p>
            </div>
          </div>
          
          {/* 高级设置 */}
          <div className="space-y-4 pt-4 border-t">
            <Tabs defaultValue="greeting">
              <TabsList className="mb-4">
                <TabsTrigger value="greeting">问候语设置</TabsTrigger>
                <TabsTrigger value="system">系统提示词</TabsTrigger>
              </TabsList>
              
              <TabsContent value="greeting" className="space-y-2">
                <Label>默认问候语</Label>
                <Input
                  placeholder="输入AI助手的默认问候语"
                  value={aiSettings.defaultGreeting}
                  onChange={(e) => handleAiSettingChange('defaultGreeting', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  当用户首次打开AI助手时显示的问候语
                </p>
              </TabsContent>
              
              <TabsContent value="system" className="space-y-2">
                <Label>系统提示词</Label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="输入系统提示词，定义AI助手的行为和角色"
                  value={aiSettings.systemPrompt}
                  onChange={(e) => handleAiSettingChange('systemPrompt', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  系统提示词用于定义AI助手的角色和行为，这将影响AI的回复风格
                </p>
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAiSettingChange('systemPrompt', defaultAiConfig.systemPrompt)}
                  >
                    重置为默认
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterfaceSettings; 