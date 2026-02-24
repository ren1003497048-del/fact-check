# Tavily Search 集成指南

## ✅ 已完成的集成

### 1. 创建了 Tavily 搜索服务 (`services/tavilyService.ts`)
- 调用 Tavily API 进行实时网络搜索
- 返回结构化的搜索结果
- 格式化结果供 LLM 使用

### 2. 更新了 DeepSeek Adapter (`services/deepseekAdapter.ts`)
- 集成 Tavily 搜索
- 先搜索，再将结果传给 DeepSeek
- 提示 LLM 优先使用搜索结果

### 3. 更新了服务器配置 (`server.ts`)
- 验证 `TAVILY_API_KEY` 环境变量
- 传递 API 密钥给服务

---

## 🔑 获取 Tavily API Key

### 步骤：

1. **访问 Tavily 官网**: https://tavily.com

2. **注册账号**:
   - 点击 "Sign Up" 或 "Get Started"
   - 使用 Google/GitHub 账号或邮箱注册
   - 免费额度：**1000 次/月**

3. **获取 API Key**:
   - 登录后进入 Dashboard
   - 找到 "API Key" 部分
   - 复制您的 API Key（格式：`tvly-xxxxxxxxxxxxx`）

4. **配置到项目**:
   ```bash
   # 编辑 .env 文件
   TAVILY_API_KEY=tvly-你的实际密钥
   ```

5. **重启服务器**:
   ```bash
   # 如果服务正在运行，nodemon 会自动重启
   # 或者手动重启：
   npm run dev:server
   ```

---

## 🎯 功能说明

### 工作流程

```
用户输入文本
    ↓
Tavily 搜索网络（获取实时信息）
    ↓
DeepSeek 分析（基于搜索结果）
    ↓
返回核查报告
```

### 搜索参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `search_depth` | `basic` | 快速搜索（可选 `advanced`） |
| `max_results` | 10 | 返回结果数量 |
| `topic` | `general` | 通用搜索（可选 `news`） |
| `days` | 3 | 如果是 news，最近 3 天 |

### 优势

- ✅ **实时信息**: 获取最新新闻和资讯
- ✅ **真实来源**: 搜索结果包含真实 URL
- ✅ **多源验证**: 交叉验证不同来源
- ✅ **AI 友好**: 专门为 LLM 设计的 API

---

## 💰 成本说明

### Tavily 定价（2025）

| 计划 | 价格 | 额度 |
|------|------|------|
| **Free** | $0 | 1,000 次/月 |
| **Basic** | $20/月 | 15,000 次/月 |
| **Pro** | $100/月 | 150,000 次/月 |

> 原型阶段使用 Free 计划完全足够！

---

## 🧪 测试方法

### 1. 启动服务器
```bash
npm run dev
```

### 2. 测试搜索功能
在浏览器打开 http://localhost:5173

输入一些**最近的新闻**进行测试，例如：
- "2025年1月美国发生了什么大事"
- "最新的人工智能进展"
- "SpaceX 最新发射任务"

### 3. 查看日志
搜索时会在终端看到：
```
[Tavily] Searching web for fact-checking...
[Tavily] Retrieved 10 search results
[DeepSeek] Fact check completed with search-enhanced analysis
```

---

## ❓ 常见问题

### Q: 如果没有 Tavily API Key 会怎样？
A: 服务器启动时会报错并提示缺失配置。

### Q: 搜索失败会怎样？
A: 会降级到仅使用 DeepSeek（基于训练数据），不会完全失败。

### Q: 可以使用其他搜索 API 吗？
A: 可以！可以替换 Tavily 为：
- Bing Search API
- Google Search API
- Serper API
- 自建爬虫

### Q: 中文搜索效果如何？
A: Tavily 支持中文搜索，效果良好。

---

## 📚 相关资源

- Tavily 官网: https://tavily.com
- Tavily 文档: https://docs.tavily.com
- API 示例: https://docs.tavily.com/docs/rest-api/api-key

---

## 🚀 下一步优化建议

1. **缓存搜索结果** - 避免重复查询
2. **智能查询生成** - 提取关键词进行搜索
3. **来源可信度评分** - 评估搜索结果来源
4. **搜索结果过滤** - 排除低质量来源
