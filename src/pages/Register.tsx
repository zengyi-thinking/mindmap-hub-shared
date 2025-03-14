
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Shield, Mail, User, Key, Phone, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      const success = await register(username, email, password, phone);
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
              <CardTitle className="text-2xl text-center">创建账户</CardTitle>
              <CardDescription className="text-center">
                注册思维导图共享平台账户
              </CardDescription>
            </CardHeader>
            
            {/* 数据隔离提示 */}
            <div className="bg-green-50 dark:bg-green-900/20 px-6 py-3 border-b border-green-100 dark:border-green-900">
              <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                <Shield className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                <span>注册即享受数据隔离保护，确保您的资料安全</span>
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
                  <Label htmlFor="username">用户名</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      placeholder="请输入用户名"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="email">电子邮箱</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="请输入电子邮箱"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="phone">手机号码 (选填)</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      placeholder="请输入手机号码(选填)"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
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
                
                <div className="mb-6">
                  <Label htmlFor="passwordConfirm">确认密码</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Key className="h-4 w-4" />
                    </div>
                    <Input
                      id="passwordConfirm"
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="pl-10"
                      placeholder="请再次输入密码"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2" 
                  disabled={loading}
                >
                  {loading ? '注册中...' : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      创建账户
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-b-lg border-t border-primary/10 py-4">
              <p className="text-center">
                已有账号？ <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">登录</Link>
              </p>
              
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-700 dark:text-green-300">数据隔离保护</span>
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  注册即表示您同意我们的服务条款和隐私政策
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
