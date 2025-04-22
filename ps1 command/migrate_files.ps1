# 文件迁移脚本
# 执行脚本: .\migrate_files.ps1

# 创建日志函数
function Log-Message {
    param (
        [string]$Message,
        [string]$Type = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    switch ($Type) {
        "INFO" { 
            Write-Host "[$timestamp] [INFO] $Message" -ForegroundColor Cyan
        }
        "SUCCESS" { 
            Write-Host "[$timestamp] [SUCCESS] $Message" -ForegroundColor Green
        }
        "WARNING" { 
            Write-Host "[$timestamp] [WARNING] $Message" -ForegroundColor Yellow
        }
        "ERROR" { 
            Write-Host "[$timestamp] [ERROR] $Message" -ForegroundColor Red
        }
    }
}

# 创建迁移函数
function Move-Files {
    param (
        [string]$SourcePath,
        [string]$DestinationPath,
        [string]$Pattern = "*"
    )
    
    if (-not (Test-Path $SourcePath)) {
        Log-Message "源路径不存在: $SourcePath" "WARNING"
        return
    }
    
    if (-not (Test-Path $DestinationPath)) {
        Log-Message "目标路径不存在，创建目录: $DestinationPath" "INFO"
        New-Item -Path $DestinationPath -ItemType Directory -Force | Out-Null
    }
    
    $files = Get-ChildItem -Path $SourcePath -Filter $Pattern
    
    if ($files.Count -eq 0) {
        Log-Message "没有找到符合条件的文件: $SourcePath\$Pattern" "WARNING"
        return
    }
    
    foreach ($file in $files) {
        $destinationFile = Join-Path -Path $DestinationPath -ChildPath $file.Name
        
        # 检查目标文件是否已存在
        if (Test-Path $destinationFile) {
            Log-Message "目标文件已存在，将覆盖: $destinationFile" "WARNING"
        }
        
        # 复制文件
        Copy-Item -Path $file.FullName -Destination $destinationFile -Force
        Log-Message "已复制文件: $($file.Name) -> $DestinationPath" "SUCCESS"
    }
}

# ==================================
# 开始迁移过程
# ==================================

Log-Message "开始文件迁移过程..." "INFO"

# 1. 迁移思维导图组件
Log-Message "迁移思维导图组件..." "INFO"
Move-Files -SourcePath "src/components/mindmap" -DestinationPath "src/modules/mindmap/components" -Pattern "*.tsx"
Move-Files -SourcePath "src/components/mindmap" -DestinationPath "src/modules/mindmap/components" -Pattern "*.ts"

# 2. 迁移材料组件
Log-Message "迁移材料组件..." "INFO"
Move-Files -SourcePath "src/components/materials" -DestinationPath "src/modules/materials/components" -Pattern "*.tsx"
Move-Files -SourcePath "src/components/materials" -DestinationPath "src/modules/materials/components" -Pattern "*.ts"

# 3. 迁移讨论组件
Log-Message "迁移讨论组件..." "INFO"
Move-Files -SourcePath "src/components/discussions" -DestinationPath "src/modules/discussions/components" -Pattern "*.tsx"
Move-Files -SourcePath "src/components/discussions" -DestinationPath "src/modules/discussions/components" -Pattern "*.ts"

# 4. 迁移布局组件
Log-Message "迁移布局组件..." "INFO"
Move-Files -SourcePath "src/components" -DestinationPath "src/components/layout" -Pattern "*Layout*.tsx"
Move-Files -SourcePath "src/components" -DestinationPath "src/components/layout" -Pattern "*Layout*.ts"

# 5. 迁移类型定义
Log-Message "迁移类型定义..." "INFO"
Move-Files -SourcePath "src/types" -DestinationPath "src/modules/mindmap/types" -Pattern "mindmap*.ts"
Move-Files -SourcePath "src/types" -DestinationPath "src/modules/materials/types" -Pattern "material*.ts"
Move-Files -SourcePath "src/types" -DestinationPath "src/modules/discussions/types" -Pattern "discussion*.ts"

# 6. 迁移服务
Log-Message "迁移服务..." "INFO"
Move-Files -SourcePath "src/services" -DestinationPath "src/modules/mindmap/services" -Pattern "*mindmap*.ts"
Move-Files -SourcePath "src/services" -DestinationPath "src/modules/materials/services" -Pattern "*material*.ts"
Move-Files -SourcePath "src/services" -DestinationPath "src/modules/discussions/services" -Pattern "*discussion*.ts"

# 7. 创建路由配置
Log-Message "创建路由配置..." "INFO"
if (-not (Test-Path "src/config/routes.ts")) {
    Log-Message "创建路由配置文件..." "INFO"
    @"
// 应用路由配置
import { lazy } from 'react';

const routes = [
  {
    path: '/',
    element: import('../pages/home/Index'),
    public: true,
  },
  {
    path: '/login',
    element: import('../pages/auth/Login'),
    public: true,
  },
  {
    path: '/register',
    element: import('../pages/auth/Register'),
    public: true,
  },
  {
    path: '/dashboard',
    element: import('../pages/dashboard/Dashboard'),
    protected: true,
  },
  {
    path: '/my-mindmaps',
    element: import('../pages/mindmap/MyMindMaps'),
    protected: true,
  },
  {
    path: '/material-upload',
    element: import('../pages/material/MaterialUpload'),
    protected: true,
  },
  {
    path: '/material-search',
    element: import('../pages/material-search/MaterialSearch'),
    protected: true,
  },
  {
    path: '/material/:id',
    element: import('../pages/material/MaterialDetail'),
    protected: true,
  },
  {
    path: '/discussion',
    element: import('../pages/discussions/DiscussionCenter'),
    protected: true,
  },
  {
    path: '/personal',
    element: import('../pages/profile/PersonalCenter'),
    protected: true,
  },
  {
    path: '/material-management',
    element: import('../pages/material/MaterialManagement'),
    protected: true,
    admin: true,
  },
  {
    path: '/user-management',
    element: import('../pages/admin/UserManagement'),
    protected: true,
    admin: true,
  },
  {
    path: '/mindmap/:id/edit',
    element: import('../pages/mindmap/MindMapEditor'),
    protected: true,
  },
  {
    path: '/mindmap/:id/view',
    element: import('../pages/mindmap/MindMapView'),
    protected: true,
  },
  {
    path: '/mindmap/:id/materials',
    element: import('../pages/mindmap/MindMapMaterials'),
    protected: true,
  },
  {
    path: '/global-material-map',
    element: import('../pages/material-search/GlobalMaterialMap'),
    protected: true,
  },
  {
    path: '*',
    element: import('../pages/error/NotFound'),
    public: true,
  },
];

export default routes;
"@ | Out-File -FilePath "src/config/routes.ts" -Encoding utf8
    Log-Message "路由配置文件创建成功" "SUCCESS"
}

Log-Message "文件迁移完成!" "SUCCESS"
Log-Message "注意: 仅复制了文件，原始文件仍然保留在原位置。请检查迁移后的文件是否正确，然后手动删除原始文件。" "WARNING"
Log-Message "下一步: 使用 update_imports.ps1 脚本来更新导入路径" "INFO" 