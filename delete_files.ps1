# 删除思维导图相关钩子文件
Remove-Item -Path "src\hooks\useMindMap.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMindMapConnections.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMindMapData.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMindMapEditor.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMindMapLayout.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMindMapNodeEdit.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMindMapNodes.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMyMindMaps.ts" -Force -ErrorAction SilentlyContinue

# 删除材料管理相关钩子文件
Remove-Item -Path "src\hooks\useMaterialMindMap.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMaterialPreview.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMaterialPreview.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMaterialSearch.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useMaterialUpload.ts" -Force -ErrorAction SilentlyContinue

# 删除共享钩子文件
Remove-Item -Path "src\hooks\use-toast.ts" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\use-mobile.tsx" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src\hooks\useFileTracker.ts" -Force -ErrorAction SilentlyContinue

Write-Host "所有文件已成功删除！" -ForegroundColor Green 