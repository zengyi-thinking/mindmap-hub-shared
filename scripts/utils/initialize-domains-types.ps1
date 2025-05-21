# 领域类型初始化脚本
# 为各个领域目录创建初始的types.ts文件模板

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "domain_types_init_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义领域列表
$domains = @(
    "mindmap",
    "materials",
    "discussions",
    "users",
    "auth",
    "material-search"
)

Write-Host "=== 开始初始化领域类型定义文件 ===" -ForegroundColor Cyan

# 为每个领域创建types.ts模板
foreach ($domain in $domains) {
    $domainDir = "src\domains\$domain"
    $typesFile = "$domainDir\types.ts"
    
    # 检查领域目录是否存在
    if (-not (Test-Path $domainDir)) {
        New-Item -Path $domainDir -ItemType Directory -Force | Out-Null
        Write-Host "创建领域目录: $domainDir" -ForegroundColor Green
    }
    
    # 检查类型文件是否已存在
    if (Test-Path $typesFile) {
        Write-Host "类型文件已存在: $typesFile" -ForegroundColor Yellow
        continue
    }
    
    # 创建类型文件模板
    $content = @"
/**
 * $domain 领域类型定义
 * 
 * 此文件包含与 $domain 领域相关的所有类型定义
 */

// 从全局类型中迁移的类型
// TODO: 在此处添加从src/types目录迁移的类型定义

// $domain 领域特定类型
// TODO: 在此处添加此领域特有的类型定义

"@

    # 写入文件
    Set-Content -Path $typesFile -Value $content
    Write-Host "✓ 已创建类型文件模板: $typesFile" -ForegroundColor Green
}

# 创建转换说明文件
$typesReadmeFile = "src\types\README.md"
$readmeContent = @"
# 类型定义说明

## 类型定义迁移说明

本项目正在将类型定义从全局 `src/types` 目录迁移至各个领域目录的 `types.ts` 文件中。

### 迁移原则

1. 领域特定的类型应位于各自的领域目录下的 `types.ts` 文件中
2. 跨领域共享的类型可以保留在全局 `src/types` 目录中
3. 迁移过程中会逐步更新导入路径

### 领域类型文件位置

- 思维导图领域: `src/domains/mindmap/types.ts`
- 材料领域: `src/domains/materials/types.ts`
- 讨论领域: `src/domains/discussions/types.ts`
- 用户领域: `src/domains/users/types.ts`
- 认证领域: `src/domains/auth/types.ts`
- 材料搜索领域: `src/domains/material-search/types.ts`

### 迁移进度

- [ ] 思维导图类型
- [ ] 材料类型
- [ ] 讨论类型
- [ ] 用户类型
- [ ] 认证类型
- [ ] 材料搜索类型

"@

# 写入类型说明文件
if (-not (Test-Path "src\types")) {
    New-Item -Path "src\types" -ItemType Directory -Force | Out-Null
}

Set-Content -Path $typesReadmeFile -Value $readmeContent
Write-Host "✓ 已创建类型定义说明文件: $typesReadmeFile" -ForegroundColor Green

Write-Host "`n=== 领域类型初始化完成 ===" -ForegroundColor Cyan
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 参考 organize-types.ps1 脚本，将类型定义迁移到各自的领域" -ForegroundColor Yellow
Write-Host "2. 更新导入路径" -ForegroundColor Yellow
Write-Host "3. 完成后在 src/types/README.md 中更新迁移进度" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n初始化日志已保存到: $logFile" -ForegroundColor Green 