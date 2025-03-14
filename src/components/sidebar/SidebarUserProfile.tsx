
import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/lib/auth';

const SidebarUserProfile: React.FC = () => {
  const { expanded } = useSidebar();
  const { user } = useAuth();

  return (
    <div className={cn(
      "flex items-center mb-6 mx-3 p-3 rounded-lg bg-muted/50",
      expanded ? "justify-start" : "justify-center"
    )}>
      <Avatar className="h-9 w-9 border-2 border-background">
        <AvatarImage src={user?.avatar || ''} alt={user?.username || '用户'} />
        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-400 text-primary-foreground">
          {user?.username?.[0]?.toUpperCase() || '游'}
        </AvatarFallback>
      </Avatar>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-3 overflow-hidden"
          >
            <div className="font-medium text-sm">{user?.username || '游客'}</div>
            <div className="text-xs text-muted-foreground">{user?.role === 'admin' ? '管理员' : '用户'}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarUserProfile;
