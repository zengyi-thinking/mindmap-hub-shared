import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // 当路由变化时，滚动到页面顶部
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 顶部渐变光效 */}
        <div 
          className="absolute -top-[30%] -left-[10%] w-[120%] h-[50%] opacity-30 blur-3xl" 
          style={{ 
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.4) 0%, rgba(125, 211, 252, 0.1) 35%, rgba(125, 211, 252, 0) 70%)'
          }}
        />
        
        {/* 底部渐变光效 */}
        <div 
          className="absolute -bottom-[30%] right-[10%] w-[100%] h-[50%] opacity-30 blur-3xl" 
          style={{ 
            background: 'radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, rgba(192, 132, 252, 0.1) 35%, rgba(192, 132, 252, 0) 70%)'
          }}
        />
        
        {/* 中央装饰元素 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-10 blur-3xl"
          style={{ 
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, rgba(129, 140, 248, 0.05) 40%, rgba(129, 140, 248, 0) 60%)'
          }}
        />
        
        {/* 装饰性网格线 */}
        <div 
          className="absolute inset-0 opacity-[0.015]" 
          style={{ 
            backgroundImage: 'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)',
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* 装饰性圆点 */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, gray 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {/* 顶部欢迎横幅 */}
          <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 border-b p-4 mb-2">
            <div className="container mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium"
              >
                {getGreeting()}, {user?.username || '用户'}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="text-sm text-muted-foreground mt-1"
              >
                {getWelcomeMessage()}
              </motion.p>
            </div>
          </div>
          
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
          <footer className="bg-card border-t mt-auto p-4">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="text-sm text-muted-foreground text-center md:text-left">
                © 2023 MindMap Hub. All rights reserved.
              </div>
              <div className="flex items-center gap-x-4">
                <div className="h-5 w-[1px] bg-muted-foreground/20 hidden md:block"></div>
                <div className="text-xs text-muted-foreground/70">
                  教育资源集合与思维导图平台
                </div>
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
    '今天是学习的好日子'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

export default MainLayout;
