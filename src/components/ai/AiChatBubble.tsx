import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { AiChatDialog } from './AiChatDialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const AiChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(false);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
    // 当打开对话框时关闭气泡
    if (!isOpen) {
      setIsBubbleOpen(false);
    }
  };

  const toggleBubble = () => {
    setIsBubbleOpen(!isBubbleOpen);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
        <AnimatePresence>
          {isBubbleOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg max-w-xs mb-2"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-primary">思维助手</h4>
                <button 
                  onClick={toggleBubble} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                有任何疑问或需要帮助？点击下方按钮与我交流！
              </p>
              <Button 
                onClick={toggleDialog} 
                className="w-full mt-3 bg-primary text-white"
                size="sm"
              >
                开始对话
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isBubbleOpen ? toggleDialog : toggleBubble}
          className="bg-primary text-white rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <Bot size={24} />
        </motion.button>
      </div>
      
      <AiChatDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default AiChatBubble; 