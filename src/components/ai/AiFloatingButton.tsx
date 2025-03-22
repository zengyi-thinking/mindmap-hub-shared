import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import AiChatDialog from './AiChatDialog';

const AiFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 默认位置在右下角，但会从本地存储中加载保存的位置
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem('aiButtonPosition');
    if (savedPosition) {
      try {
        return JSON.parse(savedPosition);
      } catch (e) {
        console.error('Failed to parse saved position', e);
      }
    }
    return { x: 0, y: 0 };
  });
  
  // 保存位置到本地存储
  useEffect(() => {
    localStorage.setItem('aiButtonPosition', JSON.stringify(position));
  }, [position]);

  // 监听窗口大小变化，确保悬浮球不会超出视窗
  useEffect(() => {
    const handleResize = () => {
      setPosition(prevPosition => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonSize = 56; // 悬浮球的大小
        
        // 确保悬浮球不会超出视窗边界
        const newX = Math.min(Math.max(prevPosition.x, 0), viewportWidth - buttonSize);
        const newY = Math.min(Math.max(prevPosition.y, 0), viewportHeight - buttonSize);
        
        if (newX !== prevPosition.x || newY !== prevPosition.y) {
          return { x: newX, y: newY };
        }
        return prevPosition;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
        dragElastic={0.1}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="fixed z-50 shadow-lg rounded-full"
        style={{ 
          bottom: position.y === 0 ? '20px' : 'auto',
          right: position.x === 0 ? '20px' : 'auto',
          top: position.y !== 0 ? `${position.y}px` : 'auto',
          left: position.x !== 0 ? `${position.x}px` : 'auto',
        }}
        onDragEnd={(event, info) => {
          // 计算新位置
          if (position.x === 0 && position.y === 0) {
            // 如果是默认位置，需要转换为具体坐标
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const newX = viewportWidth - info.point.x;
            const newY = viewportHeight - info.point.y;
            setPosition({ 
              x: viewportWidth - newX - 56, // 考虑按钮大小
              y: viewportHeight - newY - 56
            });
          } else {
            // 如果已经有具体坐标，直接更新
            setPosition({
              x: position.x + info.offset.x,
              y: position.y + info.offset.y
            });
          }
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-glow"
          variant="default"
        >
          <Bot className="h-7 w-7" />
        </Button>
      </motion.div>

      <AiChatDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AiFloatingButton; 