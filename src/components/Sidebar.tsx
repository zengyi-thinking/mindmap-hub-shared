import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  PanelLeft,
  Home,
  Search,
  FileUp,
  MessageSquare,
  BarChart,
  Users,
  LogOut,
  Settings,
  User,
  Menu,
  BookOpen,
  BrainCircuit,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && expanded) {
        setExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [expanded]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 侧边栏导航项 - 更新路径与App.tsx中的路由匹配
  const navItems = [
    {
      title: '仪表盘',
      icon: <Home size="1.2rem" />,
      path: '/dashboard',
      roles: ['user', 'admin']
    },
    {
      title: '思维导图管理',
      icon: <BrainCircuit size="1.2rem" />,
      path: '/mindmaps',
      roles: ['user', 'admin']
    },
    {
      title: '资料搜索',
      icon: <Search size="1.2rem" />,
      path: '/search',
      roles: ['user', 'admin']
    },
    {
      title: '上传资料',
      icon: <FileUp size="1.2rem" />,
      path: '/upload',
      roles: ['user', 'admin']
    },
    {
      title: '讨论中心',
      icon: <MessageSquare size="1.2rem" />,
      path: '/discussion',
      roles: ['user', 'admin']
    },
    {
      title: '个人中心',
      icon: <User size="1.2rem" />,
      path: '/profile',
      roles: ['user', 'admin']
    },
    {
      title: '管理资料',
      icon: <LayoutGrid size="1.2rem" />,
      path: '/admin/materials',
      roles: ['admin']
    },
    {
      title: '用户管理',
      icon: <Users size="1.2rem" />,
      path: '/admin/users',
      roles: ['admin']
    }
  ];

  const filteredNavItems = user
    ? navItems.filter(item => item.roles.includes(user.role))
    : navItems.filter(item => item.roles.includes('user'));

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "4rem" }
  };

  const NavItem = ({ title, icon, path }: { title: string; icon: React.ReactNode; path: string }) => {
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

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={expanded ? "expanded" : "collapsed"}
      animate={expanded ? "expanded" : "collapsed"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "flex flex-col h-screen bg-card border-r shadow-sm z-20 overflow-y-auto py-6 relative",
        expanded ? "w-64" : "w-16"
      )}
    >
      {/* 侧边栏背景装饰 */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-full h-64 opacity-20 blur-xl"
          style={{ background: 'radial-gradient(circle, rgba(125, 211, 252, 0.4) 0%, rgba(125, 211, 252, 0.1) 35%, rgba(125, 211, 252, 0) 70%)' }}
        />
      </div>
      
      {/* Logo Section */}
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
                <span className="font-bold text-xl overflow-hidden whitespace-nowrap text-primary">MindMap</span>
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

      {/* 用户资料部分 */}
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

      {/* 导航菜单 */}
      <div className="flex-1 px-3">
        <div className={cn(
          "text-xs font-semibold mb-2 text-muted-foreground",
          !expanded && "text-center"
        )}>
          {expanded ? '导航菜单' : '菜单'}
        </div>
        <nav className="space-y-0.5">
          {filteredNavItems.map((item) => (
            <NavItem
              key={item.path}
              title={item.title}
              icon={item.icon}
              path={item.path}
            />
          ))}
        </nav>
      </div>

      {/* 底部菜单 */}
      <div className="mt-auto px-3">
        <div className={cn(
          "text-xs font-semibold mb-2 text-muted-foreground",
          !expanded && "text-center"
        )}>
          {expanded ? '设置' : '设置'}
        </div>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-x-3 px-3 py-2.5 rounded-lg w-full text-left justify-start hover:bg-destructive/10 text-destructive",
                  !expanded && "justify-center"
                )}
              >
                <LogOut size="1.2rem" />
                {expanded && <span className="text-sm">退出登录</span>}
              </Button>
            </TooltipTrigger>
            {!expanded && <TooltipContent side="right">退出登录</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
