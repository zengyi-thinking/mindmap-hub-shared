# 领域目录结构创建脚本
# 用于创建领域驱动设计架构的目录结构

# 创建日志文件
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "domain_structure_log_${timestamp}.txt"
Start-Transcript -Path $logFile -Append

# 定义领域列表
$domains = @(
    "discussions",
    "materials",
    "mindmap",
    "material-search",
    "ai-tools",
    "users",
    "auth"
)

# 定义领域子目录结构
$subDirectories = @(
    "entities",
    "use-cases",
    "adapters/controllers",
    "adapters/gateways",
    "external/ui",
    "external/api",
    "external/utils"
)

# 定义基础目录
$baseDir = "src\domains"

Write-Host "=== 开始创建领域目录结构 ===" -ForegroundColor Cyan

# 创建基础目录
if (-not (Test-Path $baseDir)) {
    New-Item -Path $baseDir -ItemType Directory -Force | Out-Null
    Write-Host "创建基础目录: $baseDir" -ForegroundColor Green
}

# 为每个领域创建目录结构
foreach ($domain in $domains) {
    $domainDir = Join-Path $baseDir $domain
    
    if (-not (Test-Path $domainDir)) {
        New-Item -Path $domainDir -ItemType Directory -Force | Out-Null
        Write-Host "创建领域目录: $domainDir" -ForegroundColor Green
        
        # 创建子目录
        foreach ($subDir in $subDirectories) {
            $subDirPath = Join-Path $domainDir $subDir
            New-Item -Path $subDirPath -ItemType Directory -Force | Out-Null
            Write-Host "  创建子目录: $subDirPath" -ForegroundColor Green
        }
        
        # 创建索引文件
        $indexPath = Join-Path $domainDir "index.ts"
        $indexContent = @"
/**
 * $domain 领域模块
 * 
 * 这是一个基于领域驱动设计的领域模块，包含：
 * - 实体（entities）: 领域内的核心数据结构和业务规则
 * - 用例（use-cases）: 领域内的业务逻辑实现
 * - 适配器（adapters）: 连接领域与外部系统的接口
 * - 外部接口（external）: 与外部系统交互的具体实现
 */

// 导出领域实体
export * from './entities';

// 导出领域用例
export * from './use-cases';

// 导出领域类型
export * from './types';

// 导出UI组件
export * from './external/ui';

// 导出API接口
export * from './external/api';

// 导出工具函数
export * from './external/utils';
"@
        Set-Content -Path $indexPath -Value $indexContent
        Write-Host "  创建索引文件: $indexPath" -ForegroundColor Green
        
        # 创建实体索引文件
        $entitiesIndexPath = Join-Path $domainDir "entities\index.ts"
        $entitiesIndexContent = @"
/**
 * $domain 领域实体
 */

// TODO: 导出领域实体
// export * from './EntityName';
"@
        Set-Content -Path $entitiesIndexPath -Value $entitiesIndexContent
        Write-Host "  创建实体索引文件: $entitiesIndexPath" -ForegroundColor Green
        
        # 创建用例索引文件
        $useCasesIndexPath = Join-Path $domainDir "use-cases\index.ts"
        $useCasesIndexContent = @"
/**
 * $domain 领域用例
 */

// TODO: 导出领域用例
// export * from './UseCase';
"@
        Set-Content -Path $useCasesIndexPath -Value $useCasesIndexContent
        Write-Host "  创建用例索引文件: $useCasesIndexPath" -ForegroundColor Green
        
        # 创建UI索引文件
        $uiIndexPath = Join-Path $domainDir "external\ui\index.ts"
        $uiIndexContent = @"
/**
 * $domain 领域UI组件
 */

// TODO: 导出UI组件
// export * from './ComponentName';
"@
        Set-Content -Path $uiIndexPath -Value $uiIndexContent
        Write-Host "  创建UI索引文件: $uiIndexPath" -ForegroundColor Green
        
        # 创建API索引文件
        $apiIndexPath = Join-Path $domainDir "external\api\index.ts"
        $apiIndexContent = @"
/**
 * $domain 领域API接口
 */

// TODO: 导出API接口
// export * from './ApiService';
"@
        Set-Content -Path $apiIndexPath -Value $apiIndexContent
        Write-Host "  创建API索引文件: $apiIndexPath" -ForegroundColor Green
        
        # 创建工具函数索引文件
        $utilsIndexPath = Join-Path $domainDir "external\utils\index.ts"
        $utilsIndexContent = @"
/**
 * $domain 领域工具函数
 */

// TODO: 导出工具函数
// export * from './utilityName';
"@
        Set-Content -Path $utilsIndexPath -Value $utilsIndexContent
        Write-Host "  创建工具函数索引文件: $utilsIndexPath" -ForegroundColor Green
        
        # 创建适配器控制器索引文件
        $controllersIndexPath = Join-Path $domainDir "adapters\controllers\index.ts"
        $controllersIndexContent = @"
/**
 * $domain 领域控制器
 */

// TODO: 导出控制器
// export * from './Controller';
"@
        Set-Content -Path $controllersIndexPath -Value $controllersIndexContent
        Write-Host "  创建控制器索引文件: $controllersIndexPath" -ForegroundColor Green
        
        # 创建适配器网关索引文件
        $gatewaysIndexPath = Join-Path $domainDir "adapters\gateways\index.ts"
        $gatewaysIndexContent = @"
/**
 * $domain 领域网关
 */

// TODO: 导出网关
// export * from './Gateway';
"@
        Set-Content -Path $gatewaysIndexPath -Value $gatewaysIndexContent
        Write-Host "  创建网关索引文件: $gatewaysIndexPath" -ForegroundColor Green
        
        # 创建README文件
        $readmePath = Join-Path $domainDir "README.md"
        $readmeContent = @"
# $domain 领域

## 领域职责

描述此领域的主要职责和功能范围。

## 领域结构

- **entities/**：领域实体与值对象
- **use-cases/**：领域用例实现
- **adapters/**：
  - **controllers/**：控制层实现
  - **gateways/**：数据层接口与实现
- **external/**：
  - **ui/**：UI组件实现
  - **api/**：外部API接口
  - **utils/**：领域相关工具函数

## 领域间依赖关系

描述此领域与其他领域的依赖关系。

## 迁移说明

如果此领域是从旧目录结构迁移而来，在此处说明原始位置和迁移计划。
"@
        Set-Content -Path $readmePath -Value $readmeContent
        Write-Host "  创建README文件: $readmePath" -ForegroundColor Green
    }
    else {
        Write-Host "领域目录已存在: $domainDir" -ForegroundColor Yellow
    }
}

# 创建领域索引文件
$domainsIndexPath = Join-Path $baseDir "index.ts"
$domainsIndexContent = @"
/**
 * 领域模块索引
 * 
 * 这个文件导出所有领域模块，方便统一导入
 */

// 导出讨论领域
export * as discussions from './discussions';

// 导出材料领域
export * as materials from './materials';

// 导出思维导图领域
export * as mindmap from './mindmap';

// 导出材料搜索领域
export * as materialSearch from './material-search';

// 导出AI工具领域
export * as aiTools from './ai-tools';

// 导出用户领域
export * as users from './users';

// 导出认证领域
export * as auth from './auth';
"@
Set-Content -Path $domainsIndexPath -Value $domainsIndexContent
Write-Host "`n创建领域索引文件: $domainsIndexPath" -ForegroundColor Green

# 创建领域README文件
$domainsReadmePath = Join-Path $baseDir "README.md"
$domainsReadmeContent = @"
# 领域驱动设计架构

本目录实现了基于领域驱动设计(DDD)的架构，将系统按业务领域划分为多个相对独立的模块。

## 领域划分

- **discussions**：讨论领域，负责用户交流和评论相关功能
- **materials**：材料领域，负责学习资料的管理和组织
- **mindmap**：思维导图领域，负责思维导图的创建和展示
- **material-search**：材料搜索领域，负责资料检索和查询
- **ai-tools**：AI工具领域，负责智能辅助功能
- **users**：用户领域，负责用户信息和权限管理
- **auth**：认证领域，负责用户认证和授权

## 架构原则

1. **领域隔离**：每个领域都有明确的边界，减少跨领域依赖
2. **依赖倒置**：核心业务逻辑不依赖于外部框架和技术实现
3. **领域语言**：使用通用语言表达业务概念，减少翻译成本
4. **分层架构**：每个领域内部采用分层架构，提高可测试性和可维护性

## 领域内部结构

每个领域遵循以下内部结构：

- **entities/**：领域实体和值对象，包含业务规则
- **use-cases/**：领域用例，实现业务逻辑
- **adapters/**：连接领域与外部系统的适配器
  - **controllers/**：处理用户请求的控制器
  - **gateways/**：访问外部资源的网关
- **external/**：与外部系统交互的具体实现
  - **ui/**：用户界面组件
  - **api/**：外部API接口
  - **utils/**：工具函数

## 迁移路线图

详见 [架构实施路线图](../../docs/architecture-roadmap.md)
"@
Set-Content -Path $domainsReadmePath -Value $domainsReadmeContent
Write-Host "创建领域README文件: $domainsReadmePath" -ForegroundColor Green

Write-Host "`n=== 领域目录结构创建完成 ===" -ForegroundColor Cyan

Stop-Transcript
Write-Host "`n创建日志已保存到: $logFile" -ForegroundColor Green 