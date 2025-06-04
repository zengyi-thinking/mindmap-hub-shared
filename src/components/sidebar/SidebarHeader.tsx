import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/contexts/SidebarContext';

const SidebarHeader: React.FC = () => {
  const { expanded, toggleSidebar } = useSidebar();

  return (
    <div className="flex items-center justify-between px-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white">
          <BrainCircuit size="1rem" />
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-xl overflow-hidden whitespace-nowrap text-primary">FileMap</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar} 
        className="rounded-full hover:bg-primary/10"
      >
        <motion.div
          animate={{ rotate: expanded ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight size="1rem" />
        </motion.div>
      </Button>
    </div>
  );
};

export default SidebarHeader;
