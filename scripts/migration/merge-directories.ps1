# 目录合并脚本
# 此脚本将合并冗余目录结构，实现向领域驱动设计架构的迁移

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "directory_merge_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

$rootDir = "src"

# 确保目标目录存在
function Ensure-DirectoryExists {
    param (
        [string]$path
    )
    
    if (-not (Test-Path $path)) {
        New-Item -Path $path -ItemType Directory -Force | Out-Null
        Write-Host "  - 创建目录: $path" -ForegroundColor Green
    }
}

# 安全复制文件，避免重复
function Copy-FileSafely {
    param (
        [string]$source,
        [string]$destination
    )
    
    # 如果目标文件已存在，添加后缀
    if (Test-Path $destination) {
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($destination)
        $extension = [System.IO.Path]::GetExtension($destination)
        $directory = [System.IO.Path]::GetDirectoryName($destination)
        $newFileName = "${fileName}_migrated${extension}"
        $destination = Join-Path $directory $newFileName
    }
    
    Copy-Item -Path $source -Destination $destination -Force
    return $destination
}

# 合并目录内容
function Merge-Directories {
    param (
        [string]$sourceDir,
        [string]$targetDir,
        [string]$description
    )
    
    if (-not (Test-Path $sourceDir)) {
        Write-Host "  - 源目录不存在，跳过: $sourceDir" -ForegroundColor Yellow
        return 0
    }
    
    Ensure-DirectoryExists $targetDir
    
    $filesCopied = 0
    $files = Get-ChildItem -Path $sourceDir -Recurse -File
    
    Write-Host "`n=== 开始合并: $description ===" -ForegroundColor Cyan
    Write-Host "  - 源目录: $sourceDir" -ForegroundColor Cyan
    Write-Host "  - 目标目录: $targetDir" -ForegroundColor Cyan
    Write-Host "  - 文件数量: $($files.Count)" -ForegroundColor Cyan
    
    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring($sourceDir.Length + 1)
        $targetPath = Join-Path $targetDir $relativePath
        $targetDir = [System.IO.Path]::GetDirectoryName($targetPath)
        
        Ensure-DirectoryExists $targetDir
        
        $newPath = Copy-FileSafely -source $file.FullName -destination $targetPath
        Write-Host "  - 复制: $($file.FullName) -> $newPath" -ForegroundColor Green
        $filesCopied++
    }
    
    Write-Host "  - 已复制 $filesCopied 个文件" -ForegroundColor Green
    return $filesCopied
}

# 开始合并目录
Write-Host "=== 开始目录合并 ===" -ForegroundColor Cyan

# 1. 合并讨论领域
$totalFiles = 0
$totalFiles += Merge-Directories -sourceDir "$rootDir\features\discussions" -targetDir "$rootDir\domains\discussions" -description "Features Discussions -> Domains Discussions"
$totalFiles += Merge-Directories -sourceDir "$rootDir\features\discussion" -targetDir "$rootDir\domains\discussions" -description "Features Discussion -> Domains Discussions"

# 2. 合并材料领域
$totalFiles += Merge-Directories -sourceDir "$rootDir\features\materials" -targetDir "$rootDir\domains\materials" -description "Features Materials -> Domains Materials"
$totalFiles += Merge-Directories -sourceDir "$rootDir\modules\materials" -targetDir "$rootDir\domains\materials" -description "Modules Materials -> Domains Materials"

# 3. 合并材料搜索领域
$totalFiles += Merge-Directories -sourceDir "$rootDir\features\material-search" -targetDir "$rootDir\domains\material-search" -description "Features Material-Search -> Domains Material-Search"

# 创建外部UI目录用于存放组件
Ensure-DirectoryExists "$rootDir\domains\material-search\external\ui"
$totalFiles += Merge-Directories -sourceDir "$rootDir\components\material-search" -targetDir "$rootDir\domains\material-search\external\ui" -description "Components Material-Search -> Material-Search External UI"

# 4. 合并共享组件
$totalFiles += Merge-Directories -sourceDir "$rootDir\components\shared" -targetDir "$rootDir\shared\components" -description "Components Shared -> Shared Components"

Write-Host "`n=== 目录合并完成 ===" -ForegroundColor Cyan
Write-Host "总计复制文件: $totalFiles" -ForegroundColor Green
Write-Host "`n下一步:" -ForegroundColor Yellow
Write-Host "1. 运行 update-imports.ps1 脚本更新导入路径" -ForegroundColor Yellow
Write-Host "2. 手动测试应用功能" -ForegroundColor Yellow
Write-Host "3. 如果一切正常，移除冗余目录" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n日志已保存到: $logFile" -ForegroundColor Green 