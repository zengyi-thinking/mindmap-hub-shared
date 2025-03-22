// AI助手配置

// API提供商类型
export type ApiProvider = 'openai' | 'deepseek' | 'doubao' | 'moonshot' | 'baidu' | 'spark' | 'zhipu' | 'local';

// API提供商信息
export interface ApiProviderInfo {
  name: string;  // 显示名称
  label: string; // 显示标签
  placeholder: string; // 密钥格式提示
  apiUrl: string; // API端点
  helpUrl: string; // API获取帮助链接
  modelOptions: Array<{
    id: string;
    name: string;
  }>;
}

// API提供商配置
export const apiProviders: Record<string, ApiProviderInfo> = {
  openai: {
    name: 'OpenAI',
    label: 'OpenAI API密钥',
    placeholder: 'sk-...',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    helpUrl: 'https://platform.openai.com/account/api-keys',
    modelOptions: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
    ]
  },
  deepseek: {
    name: 'DeepSeek',
    label: 'DeepSeek API密钥',
    placeholder: 'sk-...',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    helpUrl: 'https://platform.deepseek.com/',
    modelOptions: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder' }
    ]
  },
  doubao: {
    name: '豆包',
    label: '豆包 API密钥',
    placeholder: 'dbk-...',
    apiUrl: 'https://api.doubao.com/v1/chat/completions',
    helpUrl: 'https://open.doubao.com/',
    modelOptions: [
      { id: 'doubao-lite', name: '豆包Lite' },
      { id: 'doubao-pro', name: '豆包Pro' }
    ]
  },
  moonshot: {
    name: 'Moonshot AI',
    label: 'Moonshot API密钥',
    placeholder: 'sk-...',
    apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
    helpUrl: 'https://platform.moonshot.cn/',
    modelOptions: [
      { id: 'moonshot-v1', name: 'Moonshot V1' },
      { id: 'moonshot-v1-8k', name: 'Moonshot V1-8K' },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1-32K' },
      { id: 'moonshot-v1-128k', name: 'Moonshot V1-128K' }
    ]
  },
  baidu: {
    name: '文心一言',
    label: '百度智能云API密钥',
    placeholder: '请输入AK和SK...',
    apiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
    helpUrl: 'https://cloud.baidu.com/product/wenxinworkshop',
    modelOptions: [
      { id: 'ernie-bot-4', name: '文心一言4.0' },
      { id: 'ernie-bot', name: '文心一言' },
      { id: 'ernie-bot-lite', name: '文心一言轻量版' }
    ]
  },
  spark: {
    name: '讯飞星火',
    label: '讯飞星火API密钥',
    placeholder: '请输入API密钥...',
    apiUrl: 'https://spark-api.xf-yun.com/v2.1/chat',
    helpUrl: 'https://xinghuo.xfyun.cn/sparkapi',
    modelOptions: [
      { id: 'spark-desk-v3', name: '星火认知大模型V3.0' },
      { id: 'spark-desk-v2', name: '星火认知大模型V2.0' },
      { id: 'spark-desk-v1.5', name: '星火认知大模型V1.5' }
    ]
  },
  zhipu: {
    name: '智谱AI',
    label: '智谱AI API密钥',
    placeholder: 'sk-...',
    apiUrl: 'https://open.bigmodel.cn/api/paas/v3/model-api',
    helpUrl: 'https://open.bigmodel.cn/',
    modelOptions: [
      { id: 'chatglm_pro', name: 'ChatGLM Pro' },
      { id: 'chatglm_std', name: 'ChatGLM Std' },
      { id: 'chatglm_lite', name: 'ChatGLM Lite' }
    ]
  },
  local: {
    name: '本地模式',
    label: '无需API密钥',
    placeholder: '',
    apiUrl: '',
    helpUrl: '',
    modelOptions: [
      { id: 'local', name: '本地回复' }
    ]
  }
};

export interface AiConfig {
  // 使用AI助手的类型: 'bubble' (带预览气泡) 或 'button' (简单按钮)
  floatingType: 'bubble' | 'button';
  
  // 默认的问候语
  defaultGreeting: string;
  
  // 系统提示词，定义AI助手的行为
  systemPrompt: string;
  
  // 是否默认启用AI助手
  enabled: boolean;

  // 当前选择的API提供商
  apiProvider: ApiProvider;
  
  // 当前选择的模型ID
  modelId: string;
}

// 默认AI助手配置
export const defaultAiConfig: AiConfig = {
  floatingType: 'button', // 默认使用简单按钮
  defaultGreeting: '你好！我是思维导图AI助手。有什么我可以帮助你的？',
  systemPrompt: '你是思维导图AI助手，你的任务是帮助用户理解和创建思维导图，给出关于思维导图制作和使用的建议。你的回答应当专业、友好且简洁。',
  enabled: true,
  apiProvider: 'local', // 默认使用本地模式，不需要API密钥
  modelId: 'local'
};

// 获取当前配置
export function getAiConfig(): AiConfig {
  // 从localStorage读取用户设置，如果没有则使用默认配置
  const savedConfig = localStorage.getItem('aiAssistantConfig');
  if (savedConfig) {
    try {
      return { ...defaultAiConfig, ...JSON.parse(savedConfig) };
    } catch (e) {
      console.error('无法解析AI助手配置', e);
    }
  }
  return defaultAiConfig;
}

// 保存配置
export function saveAiConfig(config: Partial<AiConfig>): void {
  const currentConfig = getAiConfig();
  const newConfig = { ...currentConfig, ...config };
  localStorage.setItem('aiAssistantConfig', JSON.stringify(newConfig));
}

// API密钥存储键名
export const getApiKeyStorageKey = (provider: ApiProvider): string => {
  return `${provider.toUpperCase()}_API_KEY`;
};

// 获取特定提供商的API密钥
export function getApiKey(provider: ApiProvider): string {
  return localStorage.getItem(getApiKeyStorageKey(provider)) || '';
}

// 保存特定提供商的API密钥
export function saveApiKey(provider: ApiProvider, key: string): void {
  localStorage.setItem(getApiKeyStorageKey(provider), key);
}

export default {
  getAiConfig,
  saveAiConfig,
  getApiKey,
  saveApiKey,
  apiProviders
}; 