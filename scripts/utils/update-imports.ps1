# 导入路径更新脚本
# 将旧架构的导入路径更新为新的领域驱动设计架构路径

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "import_update_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

$rootDir = "src"
$importMapping = @(
    # 讨论领域导入路径映射
    @{
        Pattern     = 'from\s+["'']@/features/discussion/([^"'']+)["'']'
        Replacement = 'from "@/domains/discussions$1"'
        Description = "Features Discussion -> Domains Discussions"
    },
    @{
        Pattern     = 'from\s+["'']@/features/discussions/([^"'']+)["'']'
        Replacement = 'from "@/domains/discussions$1"'
        Description = "Features Discussions -> Domains Discussions"
    },
    # 材料领域导入路径映射
    @{
        Pattern     = 'from\s+["'']@/features/materials/([^"'']+)["'']'
        Replacement = 'from "@/domains/materials$1"'
        Description = "Features Materials -> Domains Materials"
    },
    @{
        Pattern     = 'from\s+["'']@/modules/materials/([^"'']+)["'']'
        Replacement = 'from "@/domains/materials$1"'
        Description = "Modules Materials -> Domains Materials"
    },
    # 材料搜索领域导入路径映射
    @{
        Pattern     = 'from\s+["'']@/features/material-search/([^"'']+)["'']'
        Replacement = 'from "@/domains/material-search$1"'
        Description = "Features Material-Search -> Domains Material-Search"
    },
    @{
        Pattern     = 'from\s+["'']@/components/material-search/([^"'']+)["'']'
        Replacement = 'from "@/domains/material-search/external/ui$1"'
        Description = "Components Material-Search -> Domains Material-Search External UI"
    },
    # Components UI组件导入路径映射
    @{
        Pattern     = 'from\s+["'']@/components/shared/([^"'']+)["'']'
        Replacement = 'from "@/shared/components$1"'
        Description = "Components Shared -> Shared Components"
    }
)

# 需要扫描的文件类型
$fileExtensions = @("*.tsx", "*.ts", "*.jsx", "*.js")

# 找出所有需要处理的文件
$files = Get-ChildItem -Path $rootDir -Include $fileExtensions -Recurse -File

Write-Host "=== 开始更新导入路径 ===" -ForegroundColor Cyan
Write-Host "总文件数: $($files.Count)" -ForegroundColor Cyan

$updatedCount = 0
$filesWithChanges = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    $hasChanges = $false
    
    foreach ($mapping in $importMapping) {
        $pattern = $mapping.Pattern
        $replacement = $mapping.Replacement
        $description = $mapping.Description
        
        if ($content -match $pattern) {
            $content = [regex]::Replace($content, $pattern, $replacement)
            $hasChanges = $true
            $updatedCount++
            Write-Host "  - Updated: $description in $($file.FullName)" -ForegroundColor Green
        }
    }
    
    if ($hasChanges) {
        $filesWithChanges++
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "`n=== 导入路径更新完成 ===" -ForegroundColor Cyan
Write-Host "更新路径总数: $updatedCount" -ForegroundColor Green
Write-Host "修改文件总数: $filesWithChanges" -ForegroundColor Green

# 创建标记文件，表示后续需要删除的冗余目录
$removableDirectories = @(
    "src\features",
    "src\modules",
    "src\components\material-search",
    "src\components\shared"
)

$markFile = "directories-to-remove.txt"
Set-Content -Path $markFile -Value $removableDirectories

Write-Host "`n已创建可移除目录标记文件: $markFile" -ForegroundColor Yellow
Write-Host "请在测试完成后手动删除这些目录" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n日志已保存到: $logFile" -ForegroundColor Green
