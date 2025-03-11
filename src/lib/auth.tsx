import React, { createContext, useContext, useState, useEffect } from 'react';

// 用户角色类型
export type UserRole = 'user' | 'admin';

// 用户信息接口
export interface User {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
}

// 身份验证上下文接口
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
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
    role: 'admin' as UserRole
  },
  {
    id: 2,
    username: 'user1',
    password: 'password123',
    email: 'user1@example.com',
    role: 'user' as UserRole
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
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 查找用户
    const foundUser = USERS.find(u => 
      u.username === username && u.password === password
    );
    
    if (foundUser) {
      // 创建不包含密码的用户对象
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      // 将用户信息存储到本地存储
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  // 注册函数
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 检查用户名是否已存在
    if (USERS.some(u => u.username === username)) {
      return false;
    }
    
    // 创建新用户(在实际应用中，这里应该是API请求)
    const newUser = {
      id: USERS.length + 1,
      username,
      password,
      email,
      role: 'user' as UserRole
    };
    
    // 添加到用户列表(实际应用中不需要这一步，因为数据会存储在服务器)
    USERS.push(newUser);
    
    // 创建不包含密码的用户对象
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    // 将用户信息存储到本地存储
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 检查是否为管理员
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
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