import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth, DataIsolationIcon } from '@/lib/auth';
import { cn } from '@/lib/utils';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { Shield, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeToggleButtons } from '@/components/theme/ThemeSettings';
import { useTheme } from '@/contexts/ThemeContext';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { focusMode } = useTheme();

  useEffect(() => {
    // 当路由变化时，滚动到页面顶部
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden decoration-element",
        focusMode && "opacity-30"
      )}>
        {/* 顶部渐变光效 */}
        <div 
          className="absolute -top-[30%] -left-[10%] w-[120%] h-[50%] opacity-30 blur-3xl decoration-element" 
          style={{ 
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.4) 0%, rgba(125, 211, 252, 0.1) 35%, rgba(125, 211, 252, 0) 70%)'
          }}
        />
        
        {/* 底部渐变光效 */}
        <div 
          className="absolute -bottom-[30%] right-[10%] w-[100%] h-[50%] opacity-30 blur-3xl decoration-element" 
          style={{ 
            background: 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, rgba(192, 132, 252, 0.1) 35%, rgba(192, 132, 252, 0) 70%)'
          }}
        />
        
        {/* 中央装饰元素 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-10 blur-3xl decoration-element"
          style={{ 
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, rgba(129, 140, 248, 0.05) 40%, rgba(129, 140, 248, 0) 60%)'
          }}
        />
        
        {/* 装饰性网格线 */}
        <div 
          className="absolute inset-0 opacity-[0.015] decoration-element" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)',
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* 装饰性圆点 */}
        <div className="absolute inset-0 opacity-[0.02] decoration-element" style={{
          backgroundImage: 'radial-gradient(circle, gray 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="flex h-screen">
        <div className={cn("sidebar-animation", focusMode && "opacity-80 hover:opacity-100 transition-opacity")}>
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          {/* 顶部欢迎横幅 - 使用粒子背景 */}
          <ParticleBackground 
            className={cn(
              "w-full border-b mb-2 main-content-header particle-background",
              focusMode && "opacity-80 hover:opacity-100 transition-opacity"
            )}
            particleCount={40}
            colorScheme="mixed"
            density="medium"
            speed="slow"
          >
            <div className="container mx-auto p-4 backdrop-blur-sm bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium flex items-center gap-2"
                  >
                    {getGreeting()}, {user?.username || '用户'}
                    
                    {/* 数据隔离状态指示器 */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex">
                            <DataIsolationIcon className="h-4 w-4 text-green-500" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>数据已隔离 - 您的个人数据受到保护</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {/* 同步状态指示器 */}
                    {user?.syncStatus === 'syncing' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex">
                              <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>数据同步中...</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                    className="text-sm text-muted-foreground mt-1"
                  >
                    {getWelcomeMessage()}
                  </motion.p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* 主题切换按钮 */}
                  <ThemeToggleButtons />
                  
                  {/* 用户头像 */}
                  {user && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.username} />
                        ) : (
                          <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                        )}
                        
                        {/* 同步状态指示器 - 头像上的小标记 */}
                        {user.syncStatus === 'syncing' && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
                        )}
                        {user.syncStatus === 'synced' && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full" />
                        )}
                      </Avatar>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </ParticleBackground>
          
          <div className="container mx-auto p-6 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="pb-20"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* 页脚 */}
          <footer className={cn(
            "bg-card border-t mt-auto p-4 footer-container",
            focusMode && "opacity-60 hover:opacity-100 transition-opacity"
          )}>
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="text-sm text-muted-foreground text-center md:text-left">
                © 2023 MindMap Hub. All rights reserved.
              </div>
              <div className="flex items-center gap-x-4">
                <div className="h-5 w-[1px] bg-muted-foreground/20 hidden md:block"></div>
                <div className="text-xs text-muted-foreground/70">
                  教育资源集合与思维导图平台
                </div>
                
                {/* 添加数据隔离指示器 */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <DataIsolationIcon className="h-3 w-3" />
                        <span>数据隔离保护中</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>您的数据受到严格隔离保护，只有您能看到您的个人资料</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

// 根据时间获取问候语
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
};

// 随机欢迎消息
const getWelcomeMessage = () => {
  const messages = [
    '欢迎回到MindMap思维导图平台！',
    '今天有什么想法要整理吗？',
    '思维导图让知识更有条理',
    '探索新知识的旅程从这里开始',
    '组织思维，连接知识点',
    '今天是学习的好日子',
    '您的数据受到严格隔离保护',
    '所有更新将实时同步到您的设备'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export default MainLayout;
