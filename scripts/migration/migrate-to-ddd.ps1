# 领域驱动设计架构迁移主脚本
# 此脚本将执行整个迁移过程，包括目录合并、导入路径更新和验证

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "migration_master_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义颜色函数
function Write-Step {
    param (
        [string]$message,
        [int]$stepNumber
    )
    
    Write-Host "`n=======================================================" -ForegroundColor Cyan
    Write-Host " 步骤 $stepNumber - $message" -ForegroundColor Cyan
    Write-Host "=======================================================" -ForegroundColor Cyan
}

function Pause-ForConfirmation {
    param (
        [string]$message = "按任意键继续..."
    )
    
    Write-Host "`n$message" -ForegroundColor Yellow
    $null = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# 检查所有迁移脚本是否存在
$requiredScripts = @(
    "merge-directories.ps1",
    "update-imports.ps1",
    "verify-migration.ps1",
    "cleanup-directories.ps1"
)

$missingScripts = @()
foreach ($script in $requiredScripts) {
    if (-not (Test-Path $script)) {
        $missingScripts += $script
    }
}

if ($missingScripts.Count -gt 0) {
    Write-Host "错误: 以下必要脚本缺失:" -ForegroundColor Red
    foreach ($script in $missingScripts) {
        Write-Host "- $script" -ForegroundColor Red
    }
    Write-Host "`n请确保所有必要脚本都在当前目录中" -ForegroundColor Yellow
    Stop-Transcript
    exit 1
}

# 显示欢迎消息
Write-Host "`n+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+" -ForegroundColor Green
Write-Host "+         领域驱动设计架构迁移向导                      +" -ForegroundColor Green
Write-Host "+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+" -ForegroundColor Green

Write-Host "`n此脚本将引导您完成以下迁移步骤:" -ForegroundColor White
Write-Host "1. 合并目录 - 将旧架构目录合并到新的领域驱动设计结构" -ForegroundColor White
Write-Host "2. 更新导入路径 - 更新代码中的导入语句以使用新路径" -ForegroundColor White
Write-Host "3. 验证迁移 - 检查迁移结果是否正确" -ForegroundColor White
Write-Host "4. 清理冗余目录 - 在确认一切正常后删除旧目录" -ForegroundColor White

Write-Host "`n警告: 建议在执行此脚本前备份您的项目!" -ForegroundColor Red
$confirmation = Read-Host "`n准备好开始迁移过程了吗? (输入 'yes' 继续)"

if ($confirmation -ne "yes") {
    Write-Host "操作已取消" -ForegroundColor Yellow
    Stop-Transcript
    exit 0
}

# 步骤1: 合并目录
Write-Step -stepNumber 1 -message "合并目录"
Write-Host "正在将旧架构目录合并到新的领域驱动设计结构..."

try {
    & .\merge-directories.ps1
    if ($LASTEXITCODE -ne 0) { throw "目录合并失败，退出代码: $LASTEXITCODE" }
}
catch {
    Write-Host "错误: 目录合并过程中出现问题:" -ForegroundColor Red
    Write-Host "  $_" -ForegroundColor Red
    Pause-ForConfirmation "按任意键退出..."
    Stop-Transcript
    exit 1
}

Pause-ForConfirmation

# 步骤2: 更新导入路径
Write-Step -stepNumber 2 -message "更新导入路径"
Write-Host "正在更新所有文件中的导入路径..."

try {
    & .\update-imports.ps1
    if ($LASTEXITCODE -ne 0) { throw "导入路径更新失败，退出代码: $LASTEXITCODE" }
}
catch {
    Write-Host "错误: 更新导入路径过程中出现问题:" -ForegroundColor Red
    Write-Host "  $_" -ForegroundColor Red
    Pause-ForConfirmation "按任意键退出..."
    Stop-Transcript
    exit 1
}

Pause-ForConfirmation

# 步骤3: 验证迁移
Write-Step -stepNumber 3 -message "验证迁移"
Write-Host "正在验证迁移结果..."

try {
    & .\verify-migration.ps1
    if ($LASTEXITCODE -ne 0) { throw "迁移验证失败，退出代码: $LASTEXITCODE" }
}
catch {
    Write-Host "错误: 验证迁移过程中出现问题:" -ForegroundColor Red
    Write-Host "  $_" -ForegroundColor Red
    Pause-ForConfirmation "验证失败。建议手动检查问题，按任意键退出..."
    Stop-Transcript
    exit 1
}

Write-Host "`n迁移验证完成。如果发现任何问题，建议在继续前修复这些问题。" -ForegroundColor Yellow
$cleanupConfirmation = Read-Host "是否继续执行清理步骤删除冗余目录? (输入 'yes' 继续)"

if ($cleanupConfirmation -ne "yes") {
    Write-Host "跳过清理步骤" -ForegroundColor Yellow
    Write-Host "`n迁移主要步骤已完成，但未执行清理。您可以稍后手动运行 cleanup-directories.ps1" -ForegroundColor Green
    Stop-Transcript
    exit 0
}

# 步骤4: 清理冗余目录
Write-Step -stepNumber 4 -message "清理冗余目录"
Write-Host "正在删除冗余目录..."

try {
    & .\cleanup-directories.ps1
    if ($LASTEXITCODE -ne 0) { throw "清理目录失败，退出代码: $LASTEXITCODE" }
}
catch {
    Write-Host "错误: 清理目录过程中出现问题:" -ForegroundColor Red
    Write-Host "  $_" -ForegroundColor Red
    Pause-ForConfirmation "按任意键退出..."
    Stop-Transcript
    exit 1
}

# 完成
Write-Host "`n+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+" -ForegroundColor Green
Write-Host "+            迁移过程已成功完成!                        +" -ForegroundColor Green
Write-Host "+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+" -ForegroundColor Green

Write-Host "`n恭喜! 您的项目已成功迁移到领域驱动设计架构" -ForegroundColor Green
Write-Host "建议您现在启动应用并测试所有功能，确保一切正常工作" -ForegroundColor Yellow

Stop-Transcript
Write-Host "`n迁移主日志已保存到: $logFile" -ForegroundColor Green 