import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { motion } from 'framer-motion';
import { Brain, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      setError('登录时发生错误，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* 背景渐变效果 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-accent opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      </div>
      
      {/* 品牌标志 */}
      <motion.div 
        className="absolute top-8 left-8 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-10 w-10 rounded-full bg-gradient-primary text-white flex items-center justify-center">
          <Brain className="h-6 w-6" />
        </div>
        <span className="ml-2 text-lg font-bold">思维导图中心</span>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="h-14 w-14 rounded-full bg-gradient-primary bg-gradient-animate text-white flex items-center justify-center">
                <LogIn className="h-7 w-7" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">登录</CardTitle>
            <CardDescription className="text-center">
              登录到思维导图共享平台
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              
              <div className="mb-4">
                <Label htmlFor="username" className="text-sm font-medium">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                  placeholder="请输入用户名"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="请输入密码"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary bg-gradient-animate hover:shadow-lg transition-all" 
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p>
              还没有账号？ <Link to="/register" className="text-blue-600 hover:underline font-medium">注册</Link>
            </p>
          </CardFooter>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <div className="flex justify-center gap-3 items-center mb-1">
            <span>管理员账号: <span className="font-medium">admin</span></span>
            <span>密码: <span className="font-medium">000000</span></span>
          </div>
          <p>您可以使用以上管理员账号登录体验完整功能</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login; 