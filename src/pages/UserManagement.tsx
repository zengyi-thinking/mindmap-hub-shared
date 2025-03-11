import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MoreHorizontal, 
  UserX, 
  UserCheck, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  registeredAt: string;
  lastLogin: string;
  uploads: number;
  downloads: number;
  active: boolean;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
      status: 'active',
      registeredAt: '2023-01-10',
      lastLogin: '2023-06-15',
      uploads: 45,
      downloads: 120,
      active: true
    },
    {
      id: 2,
      username: '李四',
      email: 'lisi@example.com',
      role: 'user',
      status: 'active',
      registeredAt: '2023-02-15',
      lastLogin: '2023-06-14',
      uploads: 23,
      downloads: 78,
      active: true
    },
    {
      id: 3,
      username: '王五',
      email: 'wangwu@example.com',
      role: 'moderator',
      status: 'active',
      registeredAt: '2023-03-21',
      lastLogin: '2023-06-12',
      uploads: 32,
      downloads: 96,
      active: true
    },
    {
      id: 4,
      username: '赵六',
      email: 'zhaoliu@example.com',
      role: 'user',
      status: 'suspended',
      registeredAt: '2023-04-05',
      lastLogin: '2023-05-30',
      uploads: 12,
      downloads: 45,
      active: false
    },
    {
      id: 5,
      username: '钱七',
      email: 'qianqi@example.com',
      role: 'user',
      status: 'pending',
      registeredAt: '2023-06-01',
      lastLogin: '2023-06-01',
      uploads: 0,
      downloads: 3,
      active: false
    }
  ]);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  
  // 根据搜索条件和筛选器过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // 切换用户状态（激活/禁用）
  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active, status: user.active ? 'suspended' : 'active' } : user
    ));
  };
  
  // 打开修改角色对话框
  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };
  
  // 打开用户详情
  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };
  
  // 更新用户角色
  const updateUserRole = () => {
    if (!selectedUser || !newRole) return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, role: newRole as 'user' | 'admin' | 'moderator' } : user
    ));
    
    setRoleDialogOpen(false);
  };
  
  // 重置用户密码
  const resetUserPassword = (userId: number) => {
    // 实际应用中，这里应该调用API重置用户密码
    alert(`已为ID为${userId}的用户发送密码重置邮件`);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
          <p className="text-muted-foreground">管理平台用户和权限</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge>管理员专用</Badge>
          <Badge variant="outline">共 {users.length} 个用户</Badge>
        </div>
      </motion.div>
      
      <Card>
        <CardHeader>
          <CardTitle>用户管理控制台</CardTitle>
          <CardDescription>查看和管理系统中的所有用户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="搜索用户名或邮箱..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="all" onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有角色</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                  <SelectItem value="moderator">版主</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all" onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="active">已激活</SelectItem>
                  <SelectItem value="suspended">已禁用</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>最后登录</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role === 'admin' && (
                          <Badge className="bg-red-500">管理员</Badge>
                        )}
                        {user.role === 'moderator' && (
                          <Badge className="bg-yellow-500">版主</Badge>
                        )}
                        {user.role === 'user' && (
                          <Badge className="bg-blue-500">普通用户</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.status === 'active' && (
                            <>
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span>已激活</span>
                            </>
                          )}
                          {user.status === 'suspended' && (
                            <>
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>已禁用</span>
                            </>
                          )}
                          {user.status === 'pending' && (
                            <>
                              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                              <span>待审核</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.registeredAt}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">打开菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openUserDetails(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                              <Shield className="h-4 w-4 mr-2" />
                              修改角色
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                              {user.active ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2 text-red-500" />
                                  <span className="text-red-500">禁用账户</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-green-500">激活账户</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => resetUserPassword(user.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              重置密码
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      没有找到匹配的用户
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* 修改角色对话框 */}
      {selectedUser && (
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>修改用户角色</DialogTitle>
              <DialogDescription>
                为用户 "{selectedUser.username}" 分配新的角色
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>当前角色</Label>
                <div>
                  {selectedUser.role === 'admin' && (
                    <Badge className="bg-red-500">管理员</Badge>
                  )}
                  {selectedUser.role === 'moderator' && (
                    <Badge className="bg-yellow-500">版主</Badge>
                  )}
                  {selectedUser.role === 'user' && (
                    <Badge className="bg-blue-500">普通用户</Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>选择新角色</Label>
                <Select defaultValue={selectedUser.role} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">普通用户</SelectItem>
                    <SelectItem value="moderator">版主</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>取消</Button>
              <Button onClick={updateUserRole}>确认修改</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* 用户详情对话框 */}
      {selectedUser && (
        <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>用户详情</DialogTitle>
              <DialogDescription>
                查看用户的详细信息和活动数据
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">{selectedUser.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.username}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">角色</p>
                  <div>
                    {selectedUser.role === 'admin' && (
                      <Badge className="bg-red-500">管理员</Badge>
                    )}
                    {selectedUser.role === 'moderator' && (
                      <Badge className="bg-yellow-500">版主</Badge>
                    )}
                    {selectedUser.role === 'user' && (
                      <Badge className="bg-blue-500">普通用户</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">状态</p>
                  <div className="flex items-center gap-2">
                    {selectedUser.status === 'active' && (
                      <>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>已激活</span>
                      </>
                    )}
                    {selectedUser.status === 'suspended' && (
                      <>
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <span>已禁用</span>
                      </>
                    )}
                    {selectedUser.status === 'pending' && (
                      <>
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <span>待审核</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">注册时间</p>
                  <p className="font-medium">{selectedUser.registeredAt}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">最后登录</p>
                  <p className="font-medium">{selectedUser.lastLogin}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">上传资料</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedUser.uploads}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">下载数量</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedUser.downloads}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
