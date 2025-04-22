# 清理旧文件脚本
# 执行脚本: .\cleanup_files.ps1

# 创建日志函数
function Log-Message {
    param (
        [string]$Message,
        [string]$Type = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    switch ($Type) {
        "INFO" { 
            Write-Host "[$timestamp] [INFO] $Message" -ForegroundColor Cyan
        }
        "SUCCESS" { 
            Write-Host "[$timestamp] [SUCCESS] $Message" -ForegroundColor Green
        }
        "WARNING" { 
            Write-Host "[$timestamp] [WARNING] $Message" -ForegroundColor Yellow
        }
        "ERROR" { 
            Write-Host "[$timestamp] [ERROR] $Message" -ForegroundColor Red
        }
    }
}

# 旧文件列表 - 这些文件已经被迁移到新位置
$oldFiles = @(
    # 思维导图相关
    "src/components/mindmap",
    "src/types/mindmap.ts",
    "src/services/mindmapService.ts",
    "src/hooks/useMindMap.ts",
    "src/hooks/useMindMapNodes.ts",
    "src/hooks/useMindMapNodeEdit.ts",
    "src/hooks/useMindMapEditor.ts",
    "src/hooks/useMindMapConnections.ts",
    "src/hooks/useMindMapLayout.ts",
    "src/hooks/useMyMindMaps.ts",
    
    # 材料相关
    "src/components/materials",
    "src/types/materials.ts",
    "src/services/materialsService.ts",
    "src/hooks/useMaterialSearch.ts",
    "src/hooks/useMaterialUpload.ts",
    "src/hooks/useMaterialPreview.ts",
    "src/hooks/useMaterialMindMap.ts",
    
    # 讨论相关
    "src/components/discussions",
    "src/types/discussions.ts",
    "src/services/discussionsService.ts"
)

Log-Message "开始清理旧文件..." "INFO"

# 创建备份目录
$backupDir = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
Log-Message "创建备份目录: $backupDir" "INFO"

# 遍历旧文件列表
foreach ($file in $oldFiles) {
    if (Test-Path $file) {
        # 确定备份路径
        $relativePath = $file -replace "^src/", ""
        $backupPath = Join-Path -Path $backupDir -ChildPath $relativePath
        
        # 创建备份目录结构
        $backupFolder = Split-Path -Path $backupPath -Parent
        if (-not (Test-Path $backupFolder)) {
            New-Item -Path $backupFolder -ItemType Directory -Force | Out-Null
        }
        
        # 复制到备份
        if (Test-Path $file -PathType Container) {
            # 如果是目录
            Copy-Item -Path $file -Destination $backupFolder -Recurse -Force
            Log-Message "已备份目录: $file -> $backupFolder" "SUCCESS"
        }
        else {
            # 如果是文件
            Copy-Item -Path $file -Destination $backupPath -Force
            Log-Message "已备份文件: $file -> $backupPath" "SUCCESS"
        }
        
        # 提示用户删除
        $confirmation = Read-Host "是否要删除 $file? (Y/N)"
        if ($confirmation -eq 'Y' -or $confirmation -eq 'y') {
            if (Test-Path $file -PathType Container) {
                Remove-Item -Path $file -Recurse -Force
            }
            else {
                Remove-Item -Path $file -Force
            }
            Log-Message "已删除: $file" "SUCCESS"
        }
        else {
            Log-Message "保留: $file" "WARNING"
        }
    }
    else {
        Log-Message "文件不存在: $file" "WARNING"
    }
}

Log-Message "清理过程完成!" "SUCCESS"
Log-Message "所有备份文件已保存在 $backupDir 目录中" "INFO"
Log-Message "如果有任何问题，可以从备份恢复文件" "INFO" 