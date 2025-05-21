# 脚本文件整理工具
# 用于将根目录下的PowerShell脚本文件(.ps1)整理到scripts目录，并统一命名风格

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "script_organization_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义脚本分类映射
$scriptCategories = @{
    # 迁移相关脚本
    "migration" = @(
        "migrate-mindmap.ps1",
        "migrate-hooks.ps1",
        "migrate-to-ddd.ps1",
        "merge-directories.ps1"
    )
    
    # 清理相关脚本
    "cleanup"   = @(
        "cleanup-mindmap.ps1", 
        "cleanup-empty-dirs.ps1", 
        "cleanup-directories.ps1", 
        "final-cleanup.ps1", 
        "remove-original-files.ps1"
    )
    
    # 工具类脚本
    "utils"     = @(
        "update-imports.ps1", 
        "update_imports.ps1", 
        "update-material-search-imports.ps1",
        "verify-migration.ps1", 
        "organize-mindmap.ps1"
    )
}

# 命名规范化映射
$namingMap = @{
    "update_imports.ps1" = "update-imports-legacy.ps1"  # 重命名以避免冲突并遵循连字符规范
}

Write-Host "=== 开始整理脚本文件 ===" -ForegroundColor Cyan

# 确保脚本目录存在
foreach ($category in $scriptCategories.Keys) {
    $dirPath = "scripts\$category"
    if (-not (Test-Path $dirPath)) {
        New-Item -Path $dirPath -ItemType Directory -Force | Out-Null
        Write-Host "创建目录: $dirPath" -ForegroundColor Green
    }
    else {
        Write-Host "目录已存在: $dirPath" -ForegroundColor Green
    }
}

# 复制并整理脚本文件
$totalMoved = 0
$scriptsCopied = @() # 用来跟踪已复制的脚本文件名

foreach ($category in $scriptCategories.Keys) {
    $targetDir = "scripts\$category"
    $scripts = $scriptCategories[$category]
    
    Write-Host "`n整理 $category 类别的脚本:" -ForegroundColor Cyan
    
    foreach ($script in $scripts) {
        if (Test-Path $script) {
            # 检查是否需要重命名
            $newName = $script
            if ($namingMap.ContainsKey($script)) {
                $newName = $namingMap[$script]
            }
            
            $destination = Join-Path $targetDir (Split-Path $newName -Leaf)
            
            # 复制文件
            Copy-Item -Path $script -Destination $destination -Force
            Write-Host "✓ 已复制: $script -> $destination" -ForegroundColor Green
            
            $scriptsCopied += $script
            $totalMoved++
        }
        else {
            Write-Host "× 文件不存在: $script" -ForegroundColor Yellow
        }
    }
}

# 查找并处理潜在遗漏的脚本
$allScripts = Get-ChildItem -Path "." -Filter "*.ps1" -File | Where-Object { $_.Name -ne "organize-scripts.ps1" }
$missedScripts = $allScripts | Where-Object { $_.Name -notin $scriptsCopied }

if ($missedScripts.Count -gt 0) {
    Write-Host "`n以下脚本未被分类:" -ForegroundColor Yellow
    
    foreach ($script in $missedScripts) {
        $destination = Join-Path "scripts\utils" $script.Name
        Copy-Item -Path $script.FullName -Destination $destination -Force
        Write-Host "✓ 已复制到utils目录: $($script.Name)" -ForegroundColor Green
        $totalMoved++
    }
}

Write-Host "`n=== 脚本整理完成 ===" -ForegroundColor Cyan
Write-Host "总共整理了 $totalMoved 个脚本文件" -ForegroundColor Green
Write-Host "`n注意: 原始脚本文件仍保留在根目录中" -ForegroundColor Yellow
Write-Host "在确认新脚本运行正常后，可以安全删除根目录中的原始脚本" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n整理日志已保存到: $logFile" -ForegroundColor Green 