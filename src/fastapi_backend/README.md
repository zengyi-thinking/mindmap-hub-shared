# AI 思维导图生成服务

这是一个基于 FastAPI 和 Hugging Face 模型的思维导图生成服务。该服务接收用户输入的关键词，通过 AI 模型生成相关的思维导图结构。

## 功能特点

- 接收关键词生成思维导图结构
- 支持自定义生成深度和节点数量
- 支持添加相关 URL 链接
- 提供 RESTful API 接口
- 支持 CORS 跨域请求

## 安装要求

- Python 3.8+
- FastAPI
- Uvicorn
- Pydantic

## 安装步骤

1. 创建并激活虚拟环境（推荐）

```bash
# 创建虚拟环境
python -m venv venv

# 在Windows上激活
venv\Scripts\activate

# 在Unix或MacOS上激活
source venv/bin/activate
```

2. 安装依赖

```bash
pip install fastapi uvicorn pydantic
```

3. 运行服务

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

服务将在 http://localhost:8000 上启动。

## API 接口文档

启动服务后，可以访问 http://localhost:8000/docs 查看自动生成的 API 文档。

### 主要端点

- `POST /generate_mindmap` - 生成思维导图
- `GET /health` - 健康检查

### 请求示例

```json
POST /generate_mindmap
{
    "keyword": "人工智能",
    "depth": 2,
    "maxNodesPerLevel": 5,
    "includeLinks": true
}
```

### 响应示例

```json
{
    "data": {
        "id": "node-1628097234-1234",
        "name": "人工智能",
        "url": "https://zh.wikipedia.org/wiki/人工智能",
        "children": [
            {
                "id": "node-1628097234-5678",
                "name": "机器学习",
                "color": "#4299e1",
                "children": [...]
            },
            ...
        ]
    },
    "keyword": "人工智能",
    "timestamp": "2023-08-03 15:40:34"
}
```

## 前端集成

要将此服务与前端应用集成，请确保前端应用向正确的 API 端点发送请求。默认情况下，服务配置为允许所有来源的 CORS 请求。

## 模拟模式

当前版本提供模拟数据生成功能，不需要实际的 AI 模型。这对于开发和测试非常有用。

## 许可证

MIT

## 联系方式

有任何问题，请提交 Issue 或联系项目维护者。
