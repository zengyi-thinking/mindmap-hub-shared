import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, User, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PersonalInfo: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
  });

  React.useEffect(() => {
    // 从本地存储加载用户信息
    const storedData = localStorage.getItem('userProfileData');
    if (storedData) {
      try {
        setFormData(JSON.parse(storedData));
      } catch (e) {
        console.error('加载个人信息失败:', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userProfileData', JSON.stringify(formData));
    toast({
      title: "个人信息已更新",
      description: "您的个人资料已成功保存",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">个人资料</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>更新您的个人基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  姓名
                </div>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="输入您的姓名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  电子邮箱
                </div>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="输入您的邮箱地址"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  电话号码
                </div>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="输入您的电话号码"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  所在地区
                </div>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="输入您的所在地区"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="简单介绍一下您自己"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                保存信息
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default PersonalInfo; 