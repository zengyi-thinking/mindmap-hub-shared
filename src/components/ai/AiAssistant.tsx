import React, { useState, useEffect } from 'react';
import { getAiConfig } from './aiConfig';
import AiFloatingButton from './AiFloatingButton';
import AiChatBubble from './AiChatBubble';

/**
 * AI助手组件 - 根据配置显示不同类型的AI助手界面
 */
const AiAssistant: React.FC = () => {
  // 是否已加载配置
  const [loaded, setLoaded] = useState(false);
  // 当前使用的助手类型
  const [assistantType, setAssistantType] = useState<'bubble' | 'button'>('button');
  // 是否启用AI助手
  const [enabled, setEnabled] = useState(true);

  // 在客户端加载配置
  useEffect(() => {
    const config = getAiConfig();
    setAssistantType(config.floatingType);
    setEnabled(config.enabled);
    setLoaded(true);
  }, []);

  // 防止服务端渲染问题
  if (!loaded) return null;
  
  // 如果AI助手被禁用
  if (!enabled) return null;

  // 根据配置返回不同类型的助手
  if (assistantType === 'bubble') {
    return <AiChatBubble />;
  }
  
  return <AiFloatingButton />;
};

export default AiAssistant; 