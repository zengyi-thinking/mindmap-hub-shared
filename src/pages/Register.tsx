import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { motion } from 'framer-motion';
import { Brain, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !passwordConfirm) {
      setError('请填写所有必填字段');
      return;
    }
    
    if (password !== passwordConfirm) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少为6个字符');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await register(username, email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('用户名已存在，请使用其他用户名');
      }
    } catch (err) {
      setError('注册时发生错误，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* 背景渐变效果 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-accent opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-info opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
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
              <div className="h-14 w-14 rounded-full bg-gradient-accent bg-gradient-animate text-white flex items-center justify-center">
                <UserPlus className="h-7 w-7" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">注册</CardTitle>
            <CardDescription className="text-center">
              创建您的思维导图共享平台账户
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
              
              <div className="space-y-4">
                <div>
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
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">电子邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    placeholder="请输入电子邮箱"
                  />
                </div>
                
                <div>
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
                
                <div>
                  <Label htmlFor="passwordConfirm" className="text-sm font-medium">确认密码</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="mt-1"
                    placeholder="请再次输入密码"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-gradient-accent bg-gradient-animate hover:shadow-lg transition-all" 
                disabled={loading}
              >
                {loading ? '注册中...' : '注册'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p>
              已有账号？ <Link to="/login" className="text-blue-600 hover:underline font-medium">登录</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register; 