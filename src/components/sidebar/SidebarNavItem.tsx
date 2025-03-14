
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/contexts/SidebarContext';

interface SidebarNavItemProps {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ title, icon, path }) => {
  const location = useLocation();
  const { expanded } = useSidebar();
  const isActive = location.pathname === path;
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={path} className="block">
            <motion.div
              className={cn(
                "group flex items-center gap-x-3 px-3 py-2.5 rounded-lg transition-all my-1 relative",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 text-foreground"
              )}
              initial={false}
              whileHover={{ x: 5 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  layoutId="activeNavItem"
                  transition={{ duration: 0.2 }}
                  initial={false}
                  style={{ 
                    background: "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)/0.8))",
                    boxShadow: "0 4px 12px rgba(var(--primary), 0.15)"
                  }}
                />
              )}
              <div className={cn(
                "relative rounded-md p-1.5 transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {icon}
              </div>
              {expanded && (
                <span className={cn(
                  "relative text-sm transition-all overflow-hidden whitespace-nowrap",
                  isActive ? "text-primary-foreground font-medium" : "text-foreground font-normal"
                )}>
                  {title}
                </span>
              )}
            </motion.div>
          </Link>
        </TooltipTrigger>
        {!expanded && <TooltipContent side="right">{title}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarNavItem;
