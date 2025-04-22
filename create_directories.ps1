# 创建优化的目录结构
# 执行脚本: .\create_directories.ps1

# 创建资源目录
New-Item -Path "src/assets" -ItemType Directory -Force
New-Item -Path "src/assets/icons" -ItemType Directory -Force
New-Item -Path "src/assets/images" -ItemType Directory -Force
New-Item -Path "src/assets/fonts" -ItemType Directory -Force

# 组织组件目录
New-Item -Path "src/components/layout" -ItemType Directory -Force
# UI组件已存在于 src/components/ui

# 创建配置目录
New-Item -Path "src/config" -ItemType Directory -Force

# 特性模块
New-Item -Path "src/features/authentication" -ItemType Directory -Force
New-Item -Path "src/features/notifications" -ItemType Directory -Force
New-Item -Path "src/features/search" -ItemType Directory -Force

# 确保模块目录结构完整
# 思维导图模块
New-Item -Path "src/modules/mindmap/components" -ItemType Directory -Force
New-Item -Path "src/modules/mindmap/services" -ItemType Directory -Force
New-Item -Path "src/modules/mindmap/types" -ItemType Directory -Force

# 材料模块
New-Item -Path "src/modules/materials/components" -ItemType Directory -Force
New-Item -Path "src/modules/materials/services" -ItemType Directory -Force
New-Item -Path "src/modules/materials/types" -ItemType Directory -Force

# 讨论模块
New-Item -Path "src/modules/discussions/components" -ItemType Directory -Force
New-Item -Path "src/modules/discussions/hooks" -ItemType Directory -Force
New-Item -Path "src/modules/discussions/services" -ItemType Directory -Force
New-Item -Path "src/modules/discussions/types" -ItemType Directory -Force

# 全局服务目录
New-Item -Path "src/services/api" -ItemType Directory -Force

Write-Host "目录结构创建完成!" -ForegroundColor Green 