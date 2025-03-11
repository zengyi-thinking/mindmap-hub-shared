import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Brain, 
  Upload, 
  Search, 
  MessageSquare, 
  User, 
  FileText, 
  Users, 
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type NavItem = {
  title: string;
  icon: React.ElementType;
  path: string;
  admin?: boolean;
};

const navItems: NavItem[] = [
  {
    title: '仪表盘',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: '资料思维化搜索',
    icon: Brain,
    path: '/mindmaps',
  },
  {
    title: '资料上传界面',
    icon: Upload,
    path: '/upload',
  },
  {
    title: '资料标签化导图搜索',
    icon: Search,
    path: '/search',
  },
  {
    title: '讨论交流中心',
    icon: MessageSquare,
    path: '/discussion',
  },
  {
    title: '个人中心',
    icon: User,
    path: '/profile',
  },
  {
    title: '管理员操作-资料管理',
    icon: FileText,
    path: '/admin/materials',
    admin: true,
  },
  {
    title: '管理员操作-用户管理',
    icon: Users,
    path: '/admin/users',
    admin: true,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 使用isAdmin函数检查用户是否为管理员
  const showAdminItems = isAdmin();

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-sidebar-border shadow-lg transition-all duration-300 lg:relative lg:flex lg:flex-col",
          expanded ? "w-64" : "w-16",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
        animate={{
          width: expanded ? 256 : 64,
          x: mobileOpen || window.innerWidth >= 1024 ? 0 : -256
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <AnimatePresence mode="wait" initial={false}>
            {expanded ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold text-sidebar-foreground">思维导图中心</span>
              </motion.div>
            ) : (
              <motion.div
                key="small-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex"
          >
            {expanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-2">
          <ul className="flex flex-col gap-1">
            {navItems
              .filter(item => !item.admin || (item.admin && showAdminItems))
              .map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link to={item.path}>
                      <motion.div
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors relative",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        whileHover={{ x: expanded ? 4 : 0 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0", expanded ? "" : "mx-auto")} />
                        <AnimatePresence>
                          {expanded && (
                            <motion.span 
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="whitespace-nowrap overflow-hidden"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        
                        {!expanded && (
                          <div
                            className={cn(
                              "absolute left-full top-0 ml-1 rounded-md px-2 py-1 text-xs font-medium text-sidebar-foreground bg-sidebar invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0",
                              "whitespace-nowrap"
                            )}
                          >
                            {item.title}
                          </div>
                        )}
                        
                        {isActive && (
                          <motion.div
                            className="absolute top-0 left-0 bottom-0 w-1 bg-white rounded-full"
                            layoutId="activeNavIndicator"
                          />
                        )}
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
        
        {/* 用户个人信息和登出按钮 */}
        <div className="border-t border-sidebar-border p-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full flex items-center justify-start gap-2 px-3",
                    !expanded && "justify-center"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <AnimatePresence>
                    {expanded && (
                      <motion.div 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex flex-col items-start overflow-hidden"
                      >
                        <span className="text-sm font-medium">{user.username}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.role === 'admin' ? '管理员' : '用户'}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  个人中心
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
