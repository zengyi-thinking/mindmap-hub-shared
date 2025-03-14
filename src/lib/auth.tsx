import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

// 用户角色类型
export type UserRole = 'user' | 'admin';
export type SyncStatus = 'synced' | 'syncing' | 'pending';

// 用户信息接口
export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string; // 手机号字段是可选的
  role: UserRole;
  avatar?: string;
  bio?: string; // 个人签名
  lastLogin?: string; // 上次登录时间
  createdAt: string;
  updatedAt?: string; // 最后更新时间
  syncStatus?: SyncStatus; // 同步状态
}

// 用户操作日志接口
interface UserLog {
  id: number;
  userId: number;
  action: string;
  timestamp: string;
  details?: string;
  ip?: string;
}

// 身份验证上下文接口
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
  getUserLogs: () => UserLog[];
  checkDataIsolation: () => 'isolated' | 'shared' | 'unknown';
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟用户数据
const USERS = [
  {
    id: 1,
    username: 'admin',
    password: '000000',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'synced' as SyncStatus,
  },
  {
    id: 2,
    username: 'user1',
    password: 'password123',
    email: 'user1@example.com',
    phone: '13800138000',
    role: 'user' as UserRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'synced' as SyncStatus,
  }
];

// 模拟用户操作日志
const USER_LOGS: UserLog[] = [
  {
    id: 1,
    userId: 1,
    action: '登录',
    timestamp: new Date().toISOString(),
    details: '管理员账户登录',
    ip: '192.168.1.1'
  },
  {
    id: 2,
    userId: 2,
    action: '登录',
    timestamp: new Date().toISOString(),
    details: '用户登录',
    ip: '192.168.1.2'
  }
];

// 身份验证Provider组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 在组件挂载时检查本地存储中的用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        syncStatus: 'synced' // 初始状态设为已同步
      });
      
      // 添加登录日志
      addUserLog(parsedUser.id, '会话恢复', '从本地存储恢复用户会话');
    }
    setIsLoading(false);
  }, []);

  // 添加用户操作日志
  const addUserLog = (userId: number, action: string, details?: string) => {
    const newLog: UserLog = {
      id: USER_LOGS.length + 1,
      userId,
      action,
      timestamp: new Date().toISOString(),
      details,
      ip: '127.0.0.1' // 在实际应用中应获取真实IP
    };
    
    USER_LOGS.push(newLog);
    
    // 在实际应用中这里应该调用API将日志存储到服务器
    return newLog;
  };
  
  // 获取用户操作日志
  const getUserLogs = () => {
    if (!user) return [];
    return USER_LOGS.filter(log => log.userId === user.id);
  };

  // 登录函数
  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 查找用户 (支持用户名或邮箱登录)
    const foundUser = USERS.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
      u.password === password
    );
    
    if (foundUser) {
      // 创建不包含密码的用户对象
      const { password, ...userWithoutPassword } = foundUser;
      const userToSet: User = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
        syncStatus: 'synced' as SyncStatus
      };
      
      setUser(userToSet);
      // 将用户信息存储到本地存储
      localStorage.setItem('user', JSON.stringify(userToSet));
      
      // 添加登录日志
      addUserLog(foundUser.id, '登录', `用户 ${foundUser.username} 登录成功`);
      
      return true;
    }
    
    return false;
  };

  // 注册函数
  const register = async (username: string, email: string, password: string, phone?: string): Promise<boolean> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查用户名或邮箱是否已存在
    if (USERS.some(u => u.username === username || u.email === email)) {
      return false;
    }
    
    // 创建新用户(在实际应用中，这里应该是API请求)
    const newUser = {
      id: USERS.length + 1,
      username,
      password,
      email,
      phone,
      role: 'user' as UserRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'synced' as SyncStatus
    };
    
    // 添加到用户列表(实际应用中不需要这一步，因为数据会存储在服务器)
    USERS.push(newUser);
    
    // 创建不包含密码的用户对象
    const { password: _, ...userWithoutPassword } = newUser;
    
    const userToSet: User = {
      ...userWithoutPassword,
      syncStatus: 'synced' as SyncStatus
    };
    
    setUser(userToSet);
    // 将用户信息存储到本地存储
    localStorage.setItem('user', JSON.stringify(userToSet));
    
    // 添加注册日志
    addUserLog(newUser.id, '注册', `用户 ${username} 完成注册`);
    
    return true;
  };

  // 登出函数
  const logout = () => {
    if (user) {
      // 添加登出日志
      addUserLog(user.id, '登出', `用户 ${user.username} 登出`);
    }
    
    setUser(null);
    localStorage.removeItem('user');
    
    // 清除所有用户数据缓存
    localStorage.removeItem('userFiles');
    
    // 显示登出提示
    toast({
      title: "已安全登出",
      description: "您的所有临时数据已被清除",
    });
  };

  // 检查是否为管理员
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  // 更新用户个人资料
  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    // 标记为同步中
    setUser(prev => prev ? { ...prev, syncStatus: 'syncing' as SyncStatus } : null);
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser: User = { 
      ...user, 
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus: 'synced' as SyncStatus 
    };
    
    // 更新本地存储
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // 更新用户列表中的用户数据
    const userIndex = USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      USERS[userIndex] = { 
        ...USERS[userIndex], 
        ...updates, 
        updatedAt: new Date().toISOString()
      };
    }
    
    // 更新状态
    setUser(updatedUser);
    
    // 添加更新资料日志
    addUserLog(user.id, '更新资料', `用户 ${user.username} 更新了个人资料`);
    
    // 显示全局更新成功提示
    toast({
      title: "资料已更新",
      description: "您的个人资料已成功同步到所有设备",
    });
    
    return true;
  };
  
  // 检查数据隔离状态
  const checkDataIsolation = (): 'isolated' | 'shared' | 'unknown' => {
    // 在实际应用中，可能需要检查服务器配置或进行某种测试
    // 这里简单返回'isolated'状态
    return 'isolated';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      isAdmin, 
      updateUserProfile,
      getUserLogs,
      checkDataIsolation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook，方便使用上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 数据隔离状态图标组件
export const DataIsolationIcon: React.FC<{ className?: string }> = ({ className }) => {
  const { checkDataIsolation } = useAuth();
  const isolationStatus = checkDataIsolation();
  
  if (isolationStatus === 'isolated') {
    return <ShieldCheck className={className} />;
  } else if (isolationStatus === 'shared') {
    return <ShieldAlert className={className} />;
  }
  
  return <Shield className={className} />;
};
