import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, SendHorizontal, Sparkles, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService, Message } from './aiService';
import { v4 as uuidv4 } from 'uuid';

interface AiChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiChatDialog: React.FC<AiChatDialogProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是思维导图AI助手。有什么我可以帮助你的？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        content: '抱歉，我暂时无法回答你的问题。请稍后再试。',
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
    setMessages([
      {
        id: uuidv4(),
        content: '你好！我是思维导图AI助手。有什么我可以帮助你的？',
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            思维导图AI助手
          </DialogTitle>
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
              思维助手会帮助你解答关于思维导图的任何疑问
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AiChatDialog; 