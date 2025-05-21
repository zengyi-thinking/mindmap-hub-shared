# 配置文件整合脚本
# 用于整合项目根目录下的配置文件，并移动到config目录

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "config_organization_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义配置目录
$configDir = "config"

Write-Host "=== 开始整合配置文件 ===" -ForegroundColor Cyan

# 创建配置目录
if (-not (Test-Path $configDir)) {
    New-Item -Path $configDir -ItemType Directory -Force | Out-Null
    Write-Host "创建配置目录: $configDir" -ForegroundColor Green
}

# 定义需要移动和合并的配置文件组
$configGroups = @{
    # Tailwind配置文件
    "tailwind"   = @{
        "files"         = @("tailwind.config.js", "tailwind.config.ts")
        "targetFile"    = "tailwind.config.ts"
        "mergeStrategy" = "preferTs"  # 优先使用TypeScript版本
    }
    
    # TypeScript配置文件
    "typescript" = @{
        "files"         = @("tsconfig.json", "tsconfig.app.json", "tsconfig.node.json")
        "targetFile"    = "tsconfig.json"
        "mergeStrategy" = "createReferences"  # 创建引用关系
    }
    
    # PostCSS配置文件
    "postcss"    = @{
        "files"         = @("postcss.config.js")
        "targetFile"    = "postcss.config.js"
        "mergeStrategy" = "move"  # 仅移动
    }
    
    # ESLint配置文件
    "eslint"     = @{
        "files"         = @("eslint.config.js")
        "targetFile"    = "eslint.config.js"
        "mergeStrategy" = "move"  # 仅移动
    }
    
    # UI组件配置文件
    "components" = @{
        "files"         = @("components.json")
        "targetFile"    = "components.json"
        "mergeStrategy" = "move"  # 仅移动
    }
}

# 移动和合并配置文件
foreach ($group in $configGroups.Keys) {
    $files = $configGroups[$group].files
    $targetFile = $configGroups[$group].targetFile
    $strategy = $configGroups[$group].mergeStrategy
    
    Write-Host "`n处理 $group 配置文件:" -ForegroundColor Cyan
    
    # 检查文件是否存在
    $existingFiles = @()
    foreach ($file in $files) {
        if (Test-Path $file) {
            $existingFiles += $file
            Write-Host "  找到文件: $file" -ForegroundColor Green
        }
    }
    
    if ($existingFiles.Count -eq 0) {
        Write-Host "  × 未找到任何 $group 相关的配置文件" -ForegroundColor Yellow
        continue
    }
    
    # 根据合并策略处理配置文件
    $targetPath = Join-Path $configDir $targetFile
    
    switch ($strategy) {
        "preferTs" {
            # 优先使用TypeScript版本的配置文件
            if ($existingFiles -contains "tailwind.config.ts") {
                Copy-Item -Path "tailwind.config.ts" -Destination $targetPath -Force
                Write-Host "  ✓ 已复制 tailwind.config.ts -> $targetPath" -ForegroundColor Green
                
                # 创建引用
                $referenceContent = @"
/**
 * Tailwind CSS配置文件
 * 此文件用于引用config目录中的主配置文件
 */

// 使用配置目录中的配置
module.exports = require('./config/tailwind.config');
"@
                Set-Content -Path "tailwind.config.js" -Value $referenceContent
                Write-Host "  ✓ 已创建引用文件: tailwind.config.js" -ForegroundColor Green
            }
            else {
                # 如果没有TS版本，就使用JS版本并创建引用
                Copy-Item -Path "tailwind.config.js" -Destination $targetPath -Force
                Write-Host "  ✓ 已复制 tailwind.config.js -> $targetPath" -ForegroundColor Green
                
                # 创建引用
                $referenceContent = @"
/**
 * Tailwind CSS配置文件
 * 此文件用于引用config目录中的主配置文件
 */

// 使用配置目录中的配置
module.exports = require('./config/tailwind.config');
"@
                Set-Content -Path "tailwind.config.js" -Value $referenceContent
                Write-Host "  ✓ 已创建引用文件: tailwind.config.js" -ForegroundColor Green
            }
        }
        
        "createReferences" {
            # 处理TypeScript配置文件
            # 1. 复制主配置文件
            if ($existingFiles -contains "tsconfig.json") {
                Copy-Item -Path "tsconfig.json" -Destination $targetPath -Force
                Write-Host "  ✓ 已复制 tsconfig.json -> $targetPath" -ForegroundColor Green
                
                # 创建根目录引用
                $mainContent = @"
{
  "extends": "./config/tsconfig.json",
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "./config/tsconfig.app.json" },
    { "path": "./config/tsconfig.node.json" }
  ]
}
"@
                Set-Content -Path "tsconfig.json" -Value $mainContent
                Write-Host "  ✓ 已创建引用文件: tsconfig.json" -ForegroundColor Green
            }
            
            # 2. 处理app配置文件
            if ($existingFiles -contains "tsconfig.app.json") {
                $appTargetPath = Join-Path $configDir "tsconfig.app.json"
                Copy-Item -Path "tsconfig.app.json" -Destination $appTargetPath -Force
                Write-Host "  ✓ 已复制 tsconfig.app.json -> $appTargetPath" -ForegroundColor Green
            }
            
            # 3. 处理node配置文件
            if ($existingFiles -contains "tsconfig.node.json") {
                $nodeTargetPath = Join-Path $configDir "tsconfig.node.json"
                Copy-Item -Path "tsconfig.node.json" -Destination $nodeTargetPath -Force
                Write-Host "  ✓ 已复制 tsconfig.node.json -> $nodeTargetPath" -ForegroundColor Green
            }
        }
        
        "move" {
            # 简单移动文件
            if ($existingFiles.Count -gt 0) {
                Copy-Item -Path $existingFiles[0] -Destination $targetPath -Force
                Write-Host "  ✓ 已复制 $($existingFiles[0]) -> $targetPath" -ForegroundColor Green
                
                # 创建引用
                $extension = [System.IO.Path]::GetExtension($existingFiles[0])
                $baseName = [System.IO.Path]::GetFileNameWithoutExtension($existingFiles[0])
                
                if ($extension -eq ".js") {
                    $referenceContent = @"
/**
 * $baseName 配置文件
 * 此文件用于引用config目录中的主配置文件
 */

// 使用配置目录中的配置
module.exports = require('./config/$baseName');
"@
                    Set-Content -Path $existingFiles[0] -Value $referenceContent
                    Write-Host "  ✓ 已创建引用文件: $($existingFiles[0])" -ForegroundColor Green
                }
                elseif ($extension -eq ".json") {
                    # 对于JSON文件，我们创建一个注释文件
                    $referenceFile = "$baseName.js"
                    $referenceContent = @"
/**
 * $baseName 配置文件
 * 此文件用于引用config目录中的主配置文件
 */

// 配置已移至config/$($existingFiles[0])
// 此文件仅作为说明保留
module.exports = require('./config/$($existingFiles[0])');
"@
                    Set-Content -Path $referenceFile -Value $referenceContent
                    Write-Host "  ✓ 已创建引用文件: $referenceFile" -ForegroundColor Green
                    
                    # 复制原始JSON文件内容
                    Copy-Item -Path $existingFiles[0] -Destination (Join-Path $configDir $existingFiles[0]) -Force
                }
            }
        }
    }
}

# 创建配置目录的README文件
$readmeContent = @"
# 项目配置文件

本目录包含项目的各种配置文件。

## 配置文件列表

- **tailwind.config.ts** - Tailwind CSS 配置
- **tsconfig.json** - TypeScript 主配置
- **tsconfig.app.json** - TypeScript 应用配置
- **tsconfig.node.json** - TypeScript Node.js 配置
- **postcss.config.js** - PostCSS 配置
- **eslint.config.js** - ESLint 配置
- **components.json** - UI 组件库配置

## 使用说明

这些配置文件已经通过根目录的引用文件关联到项目中，无需手动导入。

如需修改配置，请直接编辑本目录中的文件，而不是根目录的引用文件。
"@

$readmePath = Join-Path $configDir "README.md"
Set-Content -Path $readmePath -Value $readmeContent
Write-Host "`n已创建配置目录说明文件: $readmePath" -ForegroundColor Green

# 创建根目录配置文件说明
$rootReadmeContent = @"
# 配置文件说明

本项目的配置文件已经整合到 `config` 目录中。

根目录中的配置文件现在只是引用配置目录中的实际配置，这样做有以下好处：

1. 保持工具的兼容性 - 大多数工具默认在根目录查找配置
2. 减少配置文件冗余 - 相关配置集中管理
3. 提高项目结构清晰度 - 配置与代码分离

## 配置文件位置

所有配置文件的实际内容现在位于 `./config/` 目录中。

请在该目录中进行配置修改，而不是修改根目录中的引用文件。
"@

$rootReadmePath = "CONFIG_README.md"
Set-Content -Path $rootReadmePath -Value $rootReadmeContent
Write-Host "已创建根目录配置说明文件: $rootReadmePath" -ForegroundColor Green

Write-Host "`n=== 配置文件整合完成 ===" -ForegroundColor Cyan
Write-Host "配置文件已整合到 $configDir 目录" -ForegroundColor Green
Write-Host "`n您可能需要重启IDE或开发服务器以应用新的配置结构" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n整理日志已保存到: $logFile" -ForegroundColor Green 