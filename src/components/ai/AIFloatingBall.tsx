import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, SendHorizontal, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import aiService, { AIMessage } from '@/services/aiService';
import styles from './AIFloatingBall.module.css';

const AIFloatingBall: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: '你好！我是你的AI助手，有什么我可以帮助你的吗？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 每当消息更新时，滚动到最新消息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 聚焦到输入框
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // 确定当前页面上下文
  const getCurrentContext = () => {
    const path = location.pathname;
    
    if (path.includes('/mindmap') && path.includes('/edit')) {
      return { page: 'mindmap-edit', id: parseInt(path.split('/')[2]) };
    } else if (path.includes('/mindmap') && !path.includes('/edit')) {
      return { page: 'mindmap-view', id: parseInt(path.split('/')[2]) };
    } else if (path.includes('/material-search')) {
      return { page: 'material-search' };
    } else if (path.includes('/my-mindmaps')) {
      return { page: 'mindmap-list' };
    } else {
      return { page: 'other' };
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // 如果是第一次打开聊天，添加上下文相关的提示
    if (!isOpen && messages.length === 1) {
      const context = getCurrentContext();
      const contextHelp = aiService.getContextualHelp(context);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: contextHelp,
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // 添加用户消息
    const userMessage: AIMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 处理用户查询
      const response = await aiService.processUserQuery(userMessage.content);
      
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // 发生错误时的处理
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，处理您的问题时出现了错误。请稍后再试。',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 浮球按钮 */}
      <motion.button
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full shadow-lg",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "transition-all duration-300 ease-in-out",
          styles.floatingBall,
          styles.pulseAnimation,
          styles.glowEffect,
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
      >
        <div className={styles.botIcon}>
          <Bot size={24} />
        </div>
      </motion.button>

      {/* 聊天面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              "absolute bottom-0 right-0 w-80 h-96 bg-background/95 rounded-lg shadow-xl border border-border overflow-hidden",
              styles.chatWindow
            )}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* 聊天头部 */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <div className="flex items-center space-x-2">
                <Bot size={18} />
                <h3 className="font-medium">AI助手</h3>
              </div>
              <button 
                className="rounded-full p-1 hover:bg-primary-foreground/20 transition-colors"
                onClick={toggleChat}
              >
                <X size={18} />
              </button>
            </div>

            {/* 消息区域 */}
            <div 
              ref={chatContainerRef}
              className="flex flex-col p-3 overflow-y-auto h-[calc(100%-8rem)]"
            >
              {messages.map((message, index) => (
                <motion.div 
                  key={index} 
                  className={cn(
                    "max-w-[85%] mb-3 p-3 rounded-lg",
                    styles.messageIn,
                    message.role === 'user' 
                      ? "bg-primary/10 ml-auto rounded-br-none" 
                      : "bg-muted rounded-bl-none"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm whitespace-pre-line">
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground p-2">
                  <div className={styles.typingIndicator}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                  </div>
                  <span>AI正在思考...</span>
                </div>
              )}
            </div>

            {/* 输入区域 */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-3">
              <div className="flex items-end space-x-2">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题..."
                  className="resize-none min-h-[40px] max-h-[100px] w-full"
                  rows={1}
                />
                <Button 
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
                    styles.sendButton
                  )}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <SendHorizontal size={18} />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Zap size={12} className="mr-1" />
                  <span>提示: 按Enter发送</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIFloatingBall; 