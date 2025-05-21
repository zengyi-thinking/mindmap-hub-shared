# 项目结构优化主脚本
# 整合所有优化脚本，实现一站式项目优化

param(
    [switch]$skipBackupCleanup = $false,
    [switch]$skipScriptOrganization = $false,
    [switch]$skipTypeOptimization = $false,
    [switch]$skipResourceOrganization = $false,
    [switch]$skipConfigConsolidation = $false,
    [switch]$skipDomainCreation = $false,
    [switch]$skipDirectoryMerge = $false,
    [switch]$skipImportUpdate = $false,
    [switch]$forceExecution = $false
)

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "project_organization_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

Write-Host "===== 开始项目结构优化 $(Get-Date) =====" -ForegroundColor Cyan
Write-Host "本脚本将整合执行所有项目优化操作，包括：" -ForegroundColor Yellow
Write-Host "1. 脚本文件组织" -ForegroundColor Yellow
Write-Host "2. 备份目录清理" -ForegroundColor Yellow
Write-Host "3. 类型定义优化" -ForegroundColor Yellow
Write-Host "4. 资源文件组织" -ForegroundColor Yellow
Write-Host "5. 配置文件整合" -ForegroundColor Yellow
Write-Host "6. 领域目录结构创建" -ForegroundColor Yellow
Write-Host "7. 目录合并" -ForegroundColor Yellow
Write-Host "8. 导入路径更新" -ForegroundColor Yellow

if (-not $forceExecution) {
    Write-Host "`n警告：这些操作将修改项目结构，建议在执行前进行备份。" -ForegroundColor Red
    $confirmation = Read-Host "是否继续？(Y/N)"
    if ($confirmation -ne "Y" -and $confirmation -ne "y") {
        Write-Host "操作已取消" -ForegroundColor Yellow
        Stop-Transcript
        return
    }
}

# 检查脚本是否存在，如果不存在则跳过
function Test-ScriptExists {
    param(
        [string]$scriptPath,
        [string]$scriptName
    )
    
    if (-not (Test-Path $scriptPath)) {
        Write-Host "警告：$scriptName 脚本不存在，将跳过此步骤" -ForegroundColor Yellow
        return $false
    }
    return $true
}

# 1. 脚本文件组织
if (-not $skipScriptOrganization) {
    Write-Host "`n>> 正在执行脚本文件组织..." -ForegroundColor Cyan
    $scriptPath = ".\scripts\utils\organize-scripts.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "脚本文件组织") {
        try {
            & $scriptPath
            Write-Host "脚本文件组织完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行脚本文件组织时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 2. 备份目录清理
if (-not $skipBackupCleanup) {
    Write-Host "`n>> 正在执行备份目录清理..." -ForegroundColor Cyan
    $scriptPath = ".\scripts\cleanup\cleanup-backups.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "备份目录清理") {
        try {
            & $scriptPath -archiveMode
            Write-Host "备份目录清理完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行备份目录清理时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 3. 类型定义优化
if (-not $skipTypeOptimization) {
    Write-Host "`n>> 正在执行类型定义优化..." -ForegroundColor Cyan
    
    # 初始化领域类型
    $scriptPath = ".\scripts\utils\initialize-domains-types.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "领域类型初始化") {
        try {
            & $scriptPath
            Write-Host "领域类型初始化完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行领域类型初始化时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # 类型组织
    $scriptPath = ".\scripts\utils\organize-types.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "类型组织") {
        try {
            & $scriptPath
            Write-Host "类型组织完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行类型组织时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 4. 资源文件组织
if (-not $skipResourceOrganization) {
    Write-Host "`n>> 正在执行资源文件组织..." -ForegroundColor Cyan
    $scriptPath = ".\scripts\utils\organize-assets.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "资源文件组织") {
        try {
            & $scriptPath
            Write-Host "资源文件组织完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行资源文件组织时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 5. 配置文件整合
if (-not $skipConfigConsolidation) {
    Write-Host "`n>> 正在执行配置文件整合..." -ForegroundColor Cyan
    $scriptPath = ".\scripts\utils\organize-configs.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "配置文件整合") {
        try {
            & $scriptPath
            Write-Host "配置文件整合完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行配置文件整合时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 6. 领域目录结构创建
if (-not $skipDomainCreation) {
    Write-Host "`n>> 正在执行领域目录结构创建..." -ForegroundColor Cyan
    $scriptPath = ".\scripts\migration\create-domain-structure.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "领域目录结构创建") {
        try {
            & $scriptPath
            Write-Host "领域目录结构创建完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行领域目录结构创建时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 7. 目录合并
if (-not $skipDirectoryMerge) {
    Write-Host "`n>> 正在执行目录合并..." -ForegroundColor Cyan
    $scriptPath = ".\scripts\migration\merge-directories.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "目录合并") {
        try {
            & $scriptPath
            Write-Host "目录合并完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行目录合并时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 8. 导入路径更新
if (-not $skipImportUpdate) {
    Write-Host "`n>> 正在执行导入路径更新..." -ForegroundColor Cyan
    $scriptPath = ".\scripts\migration\update-imports.ps1"
    if (Test-ScriptExists -scriptPath $scriptPath -scriptName "导入路径更新") {
        try {
            & $scriptPath
            Write-Host "导入路径更新完成" -ForegroundColor Green
        }
        catch {
            Write-Host "执行导入路径更新时出错：$($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n===== 项目结构优化完成 $(Get-Date) =====" -ForegroundColor Cyan
Write-Host "请查看日志文件了解详细信息：$logFile" -ForegroundColor Green

Stop-Transcript

# 使用说明
function Show-Usage {
    Write-Host "`n使用说明：" -ForegroundColor Cyan
    Write-Host ".\organize-project.ps1 [参数]" -ForegroundColor White
    Write-Host "`n可用参数：" -ForegroundColor Yellow
    Write-Host "  -skipBackupCleanup         跳过备份目录清理" -ForegroundColor White
    Write-Host "  -skipScriptOrganization    跳过脚本文件组织" -ForegroundColor White
    Write-Host "  -skipTypeOptimization      跳过类型定义优化" -ForegroundColor White
    Write-Host "  -skipResourceOrganization  跳过资源文件组织" -ForegroundColor White
    Write-Host "  -skipConfigConsolidation   跳过配置文件整合" -ForegroundColor White
    Write-Host "  -skipDomainCreation        跳过领域目录结构创建" -ForegroundColor White
    Write-Host "  -skipDirectoryMerge        跳过目录合并" -ForegroundColor White
    Write-Host "  -skipImportUpdate          跳过导入路径更新" -ForegroundColor White
    Write-Host "  -forceExecution            强制执行所有步骤，不进行确认提示" -ForegroundColor White
    Write-Host "`n示例：" -ForegroundColor Yellow
    Write-Host "  .\organize-project.ps1 -skipBackupCleanup -skipImportUpdate" -ForegroundColor White
    Write-Host "  .\organize-project.ps1 -forceExecution" -ForegroundColor White
}

# 显示使用说明
Show-Usage 