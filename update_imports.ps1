# 更新各个移动后的文件中的导入路径

# 更新auth文件夹中的文件
(Get-Content -Path src\pages\auth\Login.tsx) -replace 'from ''\.\.\/lib', 'from ''\.\.\/\.\.\/lib' -replace 'from ''\.\.\/components', 'from ''\.\.\/\.\.\/components' | Set-Content -Path src\pages\auth\Login.tsx
(Get-Content -Path src\pages\auth\Register.tsx) -replace 'from ''\.\.\/lib', 'from ''\.\.\/\.\.\/lib' -replace 'from ''\.\.\/components', 'from ''\.\.\/\.\.\/components' | Set-Content -Path src\pages\auth\Register.tsx

# 更新discussions文件夹中的文件
(Get-Content -Path src\pages\discussions\DiscussionCenter.tsx) -replace 'import styles from ''\.\/DiscussionCenter\.module\.css''', 'import styles from ''\.\/DiscussionCenter\.module\.css''' | Set-Content -Path src\pages\discussions\DiscussionCenter.tsx

# 更新dashboard文件夹中的文件
# dashboard文件已经使用@/路径，不需要更新

# 更新mindmap文件夹中的文件
(Get-Content -Path src\pages\mindmap\MyMindMaps.tsx) -replace 'import styles from ''\.\/MyMindMaps\.module\.css''', 'import styles from ''\.\/MyMindMaps\.module\.css''' | Set-Content -Path src\pages\mindmap\MyMindMaps.tsx

# 更新material文件夹中的文件
# material文件已经使用@/路径，不需要更新

# 更新material-search文件夹中的文件
(Get-Content -Path src\pages\material-search\MaterialSearch.tsx) -replace 'import styles from ''\.\/MaterialSearch\.module\.css''', 'import styles from ''\.\/MaterialSearch\.module\.css''' | Set-Content -Path src\pages\material-search\MaterialSearch.tsx

# 更新profile文件夹中的文件
(Get-Content -Path src\pages\profile\PersonalCenter.tsx) -replace 'import styles from ''\.\/PersonalCenter\.module\.css''', 'import styles from ''\.\/PersonalCenter\.module\.css''' | Set-Content -Path src\pages\profile\PersonalCenter.tsx

# 更新home文件夹中的文件
# home文件已经使用@/路径，不需要更新

# 更新error文件夹中的文件
# error文件已经使用@/路径，不需要更新

# 更新admin文件夹中的文件
# admin文件已经使用@/路径，不需要更新

Write-Host "已成功更新所有文件的导入路径！" -ForegroundColor Green 

# 导入路径更新脚本
# 执行脚本: .\update_imports.ps1

# 定义需要处理的目录和扩展名
$directories = @("src")
$extensions = @("*.ts", "*.tsx")

# 定义路径映射规则 - 从旧路径到新路径
$pathMappings = @{
    # 组件映射
    "@/components/mindmap/"         = "@/modules/mindmap/components/"
    "@/components/materials/"       = "@/modules/materials/components/"
    "@/components/discussions/"     = "@/modules/discussions/components/"
    
    # 类型映射
    "@/types/mindmap"               = "@/modules/mindmap/types/mindmap"
    "@/types/materials"             = "@/modules/materials/types/materials"
    "@/types/discussions"           = "@/modules/discussions/types/discussions"
    
    # 服务映射
    "@/services/mindmapService"     = "@/modules/mindmap/services/mindmapService"
    "@/services/materialsService"   = "@/modules/materials/services/materialsService"
    "@/services/discussionsService" = "@/modules/discussions/services/discussionsService"
    
    # Hooks映射
    "@/hooks/useMindMap"            = "@/modules/mindmap/hooks/useMindMap"
    "@/hooks/useMindMapNodes"       = "@/modules/mindmap/hooks/useMindMapNodes" 
    "@/hooks/useMindMapNodeEdit"    = "@/modules/mindmap/hooks/useMindMapNodeEdit"
    "@/hooks/useMindMapEditor"      = "@/modules/mindmap/hooks/useMindMapEditor"
    "@/hooks/useMindMapConnections" = "@/modules/mindmap/hooks/useMindMapConnections"
    "@/hooks/useMindMapLayout"      = "@/modules/mindmap/hooks/useMindMapLayout"
    "@/hooks/useMyMindMaps"         = "@/modules/mindmap/hooks/useMyMindMaps"
    
    "@/hooks/useMaterialSearch"     = "@/modules/materials/hooks/useMaterialSearch"
    "@/hooks/useMaterialUpload"     = "@/modules/materials/hooks/useMaterialUpload"
    "@/hooks/useMaterialPreview"    = "@/modules/materials/hooks/useMaterialPreview"
    "@/hooks/useMaterialMindMap"    = "@/modules/materials/hooks/useMaterialMindMap"
}

# 找出所有文件
$files = Get-ChildItem -Path $directories -Include $extensions -Recurse

# 计数器
$totalFiles = $files.Count
$processedFiles = 0
$modifiedFiles = 0

Write-Host "开始处理 $totalFiles 个文件的导入路径更新..." -ForegroundColor Cyan

foreach ($file in $files) {
    $processedFiles++
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $modified = $false
    
    # 打印进度
    if ($processedFiles % 10 -eq 0 -or $processedFiles -eq $totalFiles) {
        Write-Host "处理进度: $processedFiles / $totalFiles" -ForegroundColor Yellow
    }
    
    # 应用所有映射规则
    foreach ($oldPath in $pathMappings.Keys) {
        $newPath = $pathMappings[$oldPath]
        if ($content -match [regex]::Escape($oldPath)) {
            $content = $content -replace [regex]::Escape($oldPath), $newPath
            $modified = $true
        }
    }
    
    # 如果内容被修改，则写回文件
    if ($modified) {
        $modifiedFiles++
        Set-Content -Path $file.FullName -Value $content
        Write-Host "已更新: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "导入路径更新完成!" -ForegroundColor Green
Write-Host "处理了 $totalFiles 个文件，其中 $modifiedFiles 个文件被修改。" -ForegroundColor Cyan
Write-Host "注意: 由于导入路径的复杂性，可能有些路径没有被正确更新。请检查应用是否正常运行，并手动修复任何问题。" -ForegroundColor Yellow

# 创建更新App.tsx文件的脚本
Write-Host "创建更新App.tsx的建议..." -ForegroundColor Cyan

@"
// 建议的App.tsx组织方式

// 基础UI组件
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// 第三方依赖
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// 服务和工具
import { AuthProvider } from "./lib/auth";
import { initializeStorage } from "./lib/storage";
import { initializeMindMapStorage } from "./lib/mindmapStorage";

// 主题和样式
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeRoot from "./components/theme/ThemeRoot";
import "./styles/theme.css";

// 布局和路由组件
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// 页面组件
import Index from "./pages/home/Index";
import Dashboard from "./pages/dashboard/Dashboard";
import MyMindMaps from "./pages/mindmap/MyMindMaps";
import MaterialUpload from "./pages/material/MaterialUpload";
import MaterialSearch from "./pages/material-search/MaterialSearch";
import MaterialDetail from "./pages/material/MaterialDetail";
import DiscussionCenter from "./pages/discussions/DiscussionCenter";
import PersonalCenter from "./pages/profile/PersonalCenter";
import MaterialManagement from "./pages/material/MaterialManagement";
import UserManagement from "./pages/admin/UserManagement";
import NotFound from "./pages/error/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MindMapEditor from './pages/mindmap/MindMapEditor';
import MindMapView from './pages/mindmap/MindMapView';
import MindMapMaterials from './pages/mindmap/MindMapMaterials';
import GlobalMaterialMap from './pages/material-search/GlobalMaterialMap';

// 全局组件
import ActivityTracker from './components/global/ActivityTracker';
import AiAssistant from './components/ai/AiAssistant';

const queryClient = new QueryClient();

// 为GitHub Pages部署添加baseName
const baseName = import.meta.env.BASE_URL;

function App() {
  useEffect(() => {
    // 初始化本地存储
    initializeStorage();
    // 初始化思维导图存储
    initializeMindMapStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeRoot />
        <BrowserRouter basename={baseName}>
          <TooltipProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/my-mindmaps" element={<MyMindMaps />} />
                  <Route path="/material-upload" element={<MaterialUpload />} />
                  <Route path="/material-search" element={<MaterialSearch />} />
                  <Route path="/material/:id" element={<MaterialDetail />} />
                  <Route path="/discussion" element={<DiscussionCenter />} />
                  <Route path="/personal" element={<PersonalCenter />} />
                  <Route path="/material-management" element={<MaterialManagement />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/mindmap/:id/edit" element={<MindMapEditor />} />
                  <Route path="/mindmap/:id/view" element={<MindMapView />} />
                  <Route path="/mindmap/:id/materials" element={<MindMapMaterials />} />
                  <Route path="/global-material-map" element={<GlobalMaterialMap />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </TooltipProvider>
        </BrowserRouter>
        <Toaster />
        <Sonner />
        <ActivityTracker />
        <AiAssistant />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
"@ | Out-File -FilePath "updated_App.txt" -Encoding utf8
Write-Host "已创建App.tsx的建议组织方式，保存在 updated_App.txt 文件中" -ForegroundColor Green 