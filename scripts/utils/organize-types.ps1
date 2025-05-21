# 类型定义优化脚本
# 用于将集中在src/types目录的类型定义按领域重新组织

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "types_organization_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义领域列表及其对应的类型
$domainTypes = @{
    "mindmap"     = @("MindMapTypes", "MindmapNode", "MindMapConfig")
    "materials"   = @("Material", "MaterialType", "MaterialStatus")
    "discussions" = @("Discussion", "DiscussionTopic", "Comment")
    "users"       = @("User", "UserRole", "UserPreference")
}

# 源类型目录和基础目录
$srcTypesDir = "src\types"
$srcDir = "src"

Write-Host "=== 开始优化类型定义 ===" -ForegroundColor Cyan

# 检查类型目录是否存在
if (-not (Test-Path $srcTypesDir)) {
    Write-Host "错误: 源类型目录不存在: $srcTypesDir" -ForegroundColor Red
    Stop-Transcript
    exit 1
}

# 步骤1: 分析当前类型文件
$typeFiles = Get-ChildItem -Path $srcTypesDir -Filter "*.ts" -File

Write-Host "`n找到以下类型定义文件:" -ForegroundColor Cyan
foreach ($file in $typeFiles) {
    Write-Host "- $($file.Name)" -ForegroundColor White
}

# 步骤2: 为每个领域创建types.ts文件
foreach ($domain in $domainTypes.Keys) {
    $domainDir = Join-Path $srcDir "domains\$domain"
    
    # 检查领域目录是否存在，如果不存在则创建
    if (-not (Test-Path $domainDir)) {
        New-Item -Path $domainDir -ItemType Directory -Force | Out-Null
        Write-Host "`n创建领域目录: $domainDir" -ForegroundColor Green
    }
    
    $targetTypesFile = Join-Path $domainDir "types.ts"
    $typesToMove = $domainTypes[$domain]
    
    Write-Host "`n处理 $domain 领域的类型:" -ForegroundColor Cyan
    
    # 读取所有类型文件内容，寻找匹配的类型定义
    $domainTypeContent = @()
    $domainTypeContent += "// $domain 领域类型定义"
    $domainTypeContent += "// 从全局类型目录迁移而来"
    $domainTypeContent += ""
    
    $foundTypes = $false
    
    foreach ($file in $typeFiles) {
        $content = Get-Content -Path $file.FullName -Raw
        
        foreach ($typeName in $typesToMove) {
            # 简单的正则匹配，实际项目可能需要更复杂的解析
            if ($content -match "(?:interface|type|class|enum)\s+$typeName\b") {
                Write-Host "  在 $($file.Name) 中找到类型 $typeName" -ForegroundColor Green
                
                # 提取类型定义及其注释
                $pattern = "(?ms)(?://.*?\r?\n)*(?:export\s+)?(?:interface|type|class|enum)\s+$typeName\b.*?(?:(?=export)|$)"
                if ($content -match $pattern) {
                    $typeDefinition = $matches[0]
                    $domainTypeContent += $typeDefinition
                    $domainTypeContent += ""
                    $foundTypes = $true
                }
            }
        }
    }
    
    # 只有在找到类型定义时才创建文件
    if ($foundTypes) {
        # 如果目标文件已存在，则添加到现有文件末尾
        if (Test-Path $targetTypesFile) {
            $existingContent = Get-Content -Path $targetTypesFile -Raw
            $domainTypeContent = @("$existingContent", "") + $domainTypeContent
        }
        
        # 写入文件
        $domainTypeContent | Out-File -FilePath $targetTypesFile -Encoding utf8
        Write-Host "  ✓ 已创建或更新类型文件: $targetTypesFile" -ForegroundColor Green
    }
    else {
        Write-Host "  × 未找到匹配的类型定义" -ForegroundColor Yellow
    }
}

# 步骤3: 创建清理脚本，用于稍后手动执行
$cleanupScript = @"
# 类型定义清理脚本
# 在确认所有类型已成功迁移后运行此脚本

# 重要：此脚本会移除src/types目录中已迁移到领域目录的类型定义
# 运行前请确保所有导入路径已更新，且应用能正常运行

# 定义已迁移的类型
`$migratedTypes = @(
$(foreach ($domain in $domainTypes.Keys) {
    foreach ($type in $domainTypes[$domain]) {
        "    `"$type`","
    }
})
)

# 备份types目录
`$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
`$backupDir = "src/types_backup_`${timestamp}"
Copy-Item -Path "src/types" -Destination `$backupDir -Recurse -Force

# 从types文件中移除已迁移的类型定义
`$typeFiles = Get-ChildItem -Path "src/types" -Filter "*.ts" -File

foreach (`$file in `$typeFiles) {
    `$content = Get-Content -Path `$file.FullName -Raw
    `$modified = `$false
    
    foreach (`$typeName in `$migratedTypes) {
        `$pattern = "(?ms)(?://.*?\r?\n)*(?:export\s+)?(?:interface|type|class|enum)\s+`$typeName\b.*?(?:(?=export)|`$)"
        if (`$content -match `$pattern) {
            Write-Host "在 `$(`$file.Name) 中移除类型 `$typeName"
            `$content = `$content -replace `$pattern, ""
            `$modified = `$true
        }
    }
    
    if (`$modified) {
        # 移除多余的空行
        `$content = `$content -replace "`r`n`r`n`r`n+", "`r`n`r`n"
        Set-Content -Path `$file.FullName -Value `$content
    }
}

Write-Host "类型清理完成。原始文件已备份到 `$backupDir"
"@

$cleanupScriptPath = "scripts\utils\cleanup-types.ps1"
$cleanupScript | Out-File -FilePath $cleanupScriptPath -Encoding utf8
Write-Host "`n已创建类型清理脚本: $cleanupScriptPath" -ForegroundColor Green
Write-Host "请在确认迁移成功后手动运行此脚本" -ForegroundColor Yellow

Write-Host "`n=== 类型定义优化完成 ===" -ForegroundColor Cyan
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 更新导入路径以使用新的领域特定类型文件" -ForegroundColor Yellow
Write-Host "2. 测试应用功能" -ForegroundColor Yellow
Write-Host "3. 运行清理脚本移除冗余类型定义" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n优化日志已保存到: $logFile" -ForegroundColor Green 