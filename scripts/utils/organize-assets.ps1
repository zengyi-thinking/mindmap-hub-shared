# 资源文件组织脚本
# 用于将src/assets目录下的文件按类型分类到相应子目录

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "assets_organization_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义资源目录路径
$assetsDir = "src\assets"

# 检查资源目录是否存在
if (-not (Test-Path $assetsDir)) {
    Write-Host "错误: 资源目录不存在: $assetsDir" -ForegroundColor Red
    Stop-Transcript
    exit 1
}

Write-Host "=== 开始整理资源文件 ===" -ForegroundColor Cyan

# 定义资源类型及其对应的文件扩展名
$assetTypes = @{
    "images" = @("*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.webp")
    "icons"  = @("*.ico", "*-icon.svg", "*-icon.png")
    "fonts"  = @("*.ttf", "*.woff", "*.woff2", "*.eot")
    "styles" = @("*.css", "*.scss", "*.sass", "*.less")
    "data"   = @("*.json", "*.xml", "*.csv")
    "misc"   = @("*.*") # 用于捕获其他文件类型
}

# 创建子目录
foreach ($type in $assetTypes.Keys) {
    $typeDir = Join-Path $assetsDir $type
    
    if (-not (Test-Path $typeDir)) {
        New-Item -Path $typeDir -ItemType Directory -Force | Out-Null
        Write-Host "创建目录: $typeDir" -ForegroundColor Green
    }
}

# 处理资源文件
$processedFiles = @()
$totalMoved = 0

# 第一轮：处理除misc之外的所有类型
foreach ($type in $assetTypes.Keys | Where-Object { $_ -ne "misc" }) {
    $extensions = $assetTypes[$type]
    $typeDir = Join-Path $assetsDir $type
    
    Write-Host "`n处理 $type 类型的资源文件:" -ForegroundColor Cyan
    
    foreach ($ext in $extensions) {
        $files = Get-ChildItem -Path $assetsDir -Filter $ext -File | Where-Object { $_.DirectoryName -eq (Resolve-Path $assetsDir).Path }
        
        foreach ($file in $files) {
            # 特殊处理图标文件
            if ($type -eq "icons" -and $ext -like "*-icon.*" -and -not ($file.Name -like "*-icon.*")) {
                continue
            }
            
            # 构建目标路径
            $targetPath = Join-Path $typeDir $file.Name
            
            # 检查文件是否已存在
            if (Test-Path $targetPath) {
                $fileName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
                $extension = [System.IO.Path]::GetExtension($file.Name)
                $targetPath = Join-Path $typeDir "$fileName`_$(Get-Date -Format 'yyyyMMddHHmmss')$extension"
            }
            
            # 移动文件
            Move-Item -Path $file.FullName -Destination $targetPath
            Write-Host "  ✓ 已移动: $($file.Name) -> $targetPath" -ForegroundColor Green
            $processedFiles += $file.Name
            $totalMoved++
        }
    }
}

# 第二轮：处理剩余的文件（misc类型）
$miscDir = Join-Path $assetsDir "misc"
$remainingFiles = Get-ChildItem -Path $assetsDir -File | Where-Object { $_.DirectoryName -eq (Resolve-Path $assetsDir).Path -and $_.Name -notin $processedFiles }

Write-Host "`n处理剩余的资源文件:" -ForegroundColor Cyan

foreach ($file in $remainingFiles) {
    # 构建目标路径
    $targetPath = Join-Path $miscDir $file.Name
    
    # 检查文件是否已存在
    if (Test-Path $targetPath) {
        $fileName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $extension = [System.IO.Path]::GetExtension($file.Name)
        $targetPath = Join-Path $miscDir "$fileName`_$(Get-Date -Format 'yyyyMMddHHmmss')$extension"
    }
    
    # 移动文件
    Move-Item -Path $file.FullName -Destination $targetPath
    Write-Host "  ✓ 已移动: $($file.Name) -> $targetPath" -ForegroundColor Green
    $totalMoved++
}

# 清理空目录
if ((Get-ChildItem -Path $miscDir).Count -eq 0) {
    Remove-Item -Path $miscDir -Force
    Write-Host "`n移除空目录: $miscDir" -ForegroundColor Yellow
}

Write-Host "`n=== 资源文件整理完成 ===" -ForegroundColor Cyan
Write-Host "总共整理了 $totalMoved 个资源文件" -ForegroundColor Green

# 创建导入助手文件
$indexPath = Join-Path $assetsDir "index.ts"
$indexContent = @"
/**
 * 资源文件导入助手
 * 提供更简洁的资源导入路径，例如：
 * import { logo } from '@/assets';  // 自动从正确子目录导入
 */

// 导出图片资源
export * from './images';

// 导出图标资源
export * from './icons';

// 导出字体资源
export * from './fonts';

// 导出样式资源
export * from './styles';

// 导出数据资源
export * from './data';

// 导出其他资源
export * from './misc';
"@

Set-Content -Path $indexPath -Value $indexContent
Write-Host "`n已创建资源导入助手文件: $indexPath" -ForegroundColor Green

# 为每个资源类型目录创建索引文件
foreach ($type in $assetTypes.Keys) {
    $typeDir = Join-Path $assetsDir $type
    
    if (Test-Path $typeDir) {
        $typeIndexPath = Join-Path $typeDir "index.ts"
        $typeIndexContent = @"
/**
 * $type 资源导出文件
 */

// 在此处添加资源导出
// 示例: export { default as logo } from './logo.png';

"@
        
        Set-Content -Path $typeIndexPath -Value $typeIndexContent
        Write-Host "已创建 $type 资源索引文件: $typeIndexPath" -ForegroundColor Green
    }
}

Write-Host "`n提示: 请手动更新各资源类型目录下的index.ts文件，添加具体资源导出" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n整理日志已保存到: $logFile" -ForegroundColor Green 