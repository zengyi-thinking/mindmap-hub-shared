# 更新Material Search页面的导入路径
# 该脚本将更新所有引用旧MaterialMermaidMindMap组件的文件，改为使用新的组件路径

# 定义需要更新的文件
$filesToUpdate = @(
    "src/pages/material-search/MaterialSearch.tsx",
    "src/pages/material-search/MermaidMapTest.tsx"
)

Write-Host "开始更新MaterialSearch导入路径..." -ForegroundColor Cyan

foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "正在处理: $file" -ForegroundColor Yellow
        
        # 读取文件内容
        $content = Get-Content $file -Raw
        
        # 更新导入路径
        $updatedContent = $content -replace "import MaterialMermaidMindMap from '@/features/material-search/MaterialMermaidMindMap';", "import { MaterialMermaidMindMap } from '@/domains/mindmap';"
        
        # 如果有内容变化，保存文件
        if ($updatedContent -ne $content) {
            Set-Content -Path $file -Value $updatedContent -NoNewline
            Write-Host "已更新导入路径: $file" -ForegroundColor Green
        }
        else {
            Write-Host "文件无需更新: $file" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "文件不存在: $file" -ForegroundColor Red
    }
}

# 检查并删除冗余的桥接文件
$redundantFiles = @(
    "src/features/material-search/MaterialMermaidMindMap.tsx"
)

foreach ($file in $redundantFiles) {
    if (Test-Path $file) {
        Write-Host "正在删除冗余文件: $file" -ForegroundColor Yellow
        Remove-Item $file -Force
        Write-Host "已删除: $file" -ForegroundColor Green
    }
    else {
        Write-Host "文件不存在或已删除: $file" -ForegroundColor Gray
    }
}

Write-Host "导入路径更新完成!" -ForegroundColor Cyan 