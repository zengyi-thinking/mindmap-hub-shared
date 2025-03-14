
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Shield, Mail, User, Key, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usernameOrEmail || !password) {
      setError('请输入用户名/邮箱和密码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(usernameOrEmail, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('用户名/邮箱或密码错误');
      }
    } catch (err) {
      setError('登录时发生错误，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-t-lg border-b border-primary/10">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">账户登录</CardTitle>
              <CardDescription className="text-center">
                登录到思维导图共享平台
              </CardDescription>
            </CardHeader>
            
            {/* 数据隔离提示 */}
            <div className="bg-green-50 dark:bg-green-900/20 px-6 py-3 border-b border-green-100 dark:border-green-900">
              <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                <Shield className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                <span>个人数据安全隔离 - 您的资料仅您可见</span>
              </div>
            </div>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="mb-4">
                  <Label htmlFor="usernameOrEmail">用户名 / 邮箱</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="usernameOrEmail"
                      type="text"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      className="pl-10"
                      placeholder="请输入用户名或邮箱"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Key className="h-4 w-4" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="请输入密码"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2" 
                  disabled={loading}
                >
                  {loading ? '登录中...' : (
                    <>
                      <Lock className="h-4 w-4" />
                      安全登录
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-b-lg border-t border-primary/10 py-4">
              <p className="text-center">
                还没有账号？ <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">注册</Link>
              </p>
              
              <div className="text-xs text-center text-muted-foreground">
                登录即表示您同意我们的服务条款和隐私政策
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
