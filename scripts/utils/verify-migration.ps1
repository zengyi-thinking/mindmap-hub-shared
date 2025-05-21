# 迁移验证脚本
# 此脚本用于检查目录合并和导入路径更新的结果

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "migration_verification_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义一个函数检查目录是否存在
function Check-DirectoryExists {
    param (
        [string]$path,
        [string]$description
    )
    
    if (Test-Path $path) {
        Write-Host "✓ $description 目录存在: $path" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "✗ $description 目录不存在: $path" -ForegroundColor Red
        return $false
    }
}

# 定义一个函数检查文件是否存在
function Check-FilesExist {
    param (
        [string]$directory,
        [string]$filePattern,
        [string]$description
    )
    
    if (-not (Test-Path $directory)) {
        Write-Host "✗ 无法检查 $description - 目录不存在 $directory" -ForegroundColor Red
        return 0
    }
    
    $files = Get-ChildItem -Path $directory -Filter $filePattern -Recurse -File
    $count = $files.Count
    
    if ($count -gt 0) {
        Write-Host "✓ 找到 $count 个 $description 文件" -ForegroundColor Green
    }
    else {
        Write-Host "✗ 未找到 $description 文件" -ForegroundColor Red
    }
    
    return $count
}

# 定义一个函数搜索不正确的导入路径
function Find-InvalidImports {
    param (
        [string]$pattern,
        [string]$description
    )
    
    $files = Get-ChildItem -Path "src" -Include "*.tsx", "*.ts", "*.jsx", "*.js" -Recurse -File
    $invalidImports = @()
    
    foreach ($file in $files) {
        $content = Get-Content -Path $file.FullName -Raw
        if ($content -match $pattern) {
            $invalidImports += $file.FullName
        }
    }
    
    $count = $invalidImports.Count
    
    if ($count -eq 0) {
        Write-Host "✓ 未找到 $description" -ForegroundColor Green
    }
    else {
        Write-Host "✗ 找到 $count 个文件包含 $description" -ForegroundColor Red
        foreach ($file in $invalidImports) {
            Write-Host "  - $file" -ForegroundColor Yellow
        }
    }
    
    return $count
}

Write-Host "=== 开始验证迁移结果 ===" -ForegroundColor Cyan

# 1. 验证新领域目录结构
Write-Host "`n验证新领域目录结构:" -ForegroundColor Cyan
$domainsValid = $true

$domainsValid = $domainsValid -and (Check-DirectoryExists "src\domains\discussions" "讨论领域")
$domainsValid = $domainsValid -and (Check-DirectoryExists "src\domains\materials" "材料领域")
$domainsValid = $domainsValid -and (Check-DirectoryExists "src\domains\material-search" "材料搜索领域")
$domainsValid = $domainsValid -and (Check-DirectoryExists "src\domains\material-search\external\ui" "材料搜索UI组件")
$domainsValid = $domainsValid -and (Check-DirectoryExists "src\shared\components" "共享组件")

# 2. 验证关键文件迁移
Write-Host "`n验证关键文件迁移:" -ForegroundColor Cyan
$filesValid = $true

$discussionsFiles = Check-FilesExist "src\domains\discussions" "*.tsx" "讨论领域"
$materialsFiles = Check-FilesExist "src\domains\materials" "*.tsx" "材料领域"
$materialSearchFiles = Check-FilesExist "src\domains\material-search" "*.tsx" "材料搜索领域"
$sharedComponentsFiles = Check-FilesExist "src\shared\components" "*.tsx" "共享组件"

$filesValid = ($discussionsFiles -gt 0) -and ($materialsFiles -gt 0) -and ($materialSearchFiles -gt 0) -and ($sharedComponentsFiles -gt 0)

# 3. 验证导入路径
Write-Host "`n验证导入路径更新:" -ForegroundColor Cyan
$importsValid = $true

# 检查旧的导入路径是否仍然存在
$oldFeatureDiscussionImports = Find-InvalidImports 'from\s+["'']@/features/discussion(s)?/' "旧讨论领域导入"
$oldFeatureMaterialsImports = Find-InvalidImports 'from\s+["'']@/features/materials/' "旧材料领域导入"
$oldModulesMaterialsImports = Find-InvalidImports 'from\s+["'']@/modules/materials/' "旧模块材料导入"
$oldFeatureMaterialSearchImports = Find-InvalidImports 'from\s+["'']@/features/material-search/' "旧材料搜索导入"
$oldComponentsMaterialSearchImports = Find-InvalidImports 'from\s+["'']@/components/material-search/' "旧材料搜索组件导入"
$oldComponentsSharedImports = Find-InvalidImports 'from\s+["'']@/components/shared/' "旧共享组件导入"

$importsValid = ($oldFeatureDiscussionImports -eq 0) -and 
                ($oldFeatureMaterialsImports -eq 0) -and 
                ($oldModulesMaterialsImports -eq 0) -and 
                ($oldFeatureMaterialSearchImports -eq 0) -and 
                ($oldComponentsMaterialSearchImports -eq 0) -and 
                ($oldComponentsSharedImports -eq 0)

# 检查新的导入路径是否存在
$newDiscussionsImports = Find-InvalidImports 'from\s+["'']@/domains/discussions/' "新讨论领域导入" -not
$newMaterialsImports = Find-InvalidImports 'from\s+["'']@/domains/materials/' "新材料领域导入" -not
$newMaterialSearchImports = Find-InvalidImports 'from\s+["'']@/domains/material-search/' "新材料搜索导入" -not
$newSharedComponentsImports = Find-InvalidImports 'from\s+["'']@/shared/components/' "新共享组件导入" -not

$importsValid = $importsValid -and 
                ($newDiscussionsImports -gt 0) -and 
                ($newMaterialsImports -gt 0) -and 
                ($newMaterialSearchImports -gt 0) -and 
                ($newSharedComponentsImports -gt 0)

# 4. 生成总体报告
Write-Host "`n=== 验证结果摘要 ===" -ForegroundColor Cyan

if ($domainsValid) {
    Write-Host "✓ 领域目录结构验证通过" -ForegroundColor Green
}
else {
    Write-Host "✗ 领域目录结构验证失败" -ForegroundColor Red
}

if ($filesValid) {
    Write-Host "✓ 关键文件迁移验证通过" -ForegroundColor Green
}
else {
    Write-Host "✗ 关键文件迁移验证失败" -ForegroundColor Red
}

if ($importsValid) {
    Write-Host "✓ 导入路径更新验证通过" -ForegroundColor Green
}
else {
    Write-Host "✗ 导入路径更新验证失败" -ForegroundColor Red
}

if ($domainsValid -and $filesValid -and $importsValid) {
    Write-Host "`n总体结果: 迁移验证通过! ✓" -ForegroundColor Green
    Write-Host "你可以安全地删除冗余目录，迁移已完成。" -ForegroundColor Green
}
else {
    Write-Host "`n总体结果: 迁移验证失败 ✗" -ForegroundColor Red
    Write-Host "请检查日志文件并解决问题后再继续。" -ForegroundColor Yellow
}

Stop-Transcript
Write-Host "`n验证日志已保存到: $logFile" -ForegroundColor Green 