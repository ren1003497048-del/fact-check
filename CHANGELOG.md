# Truth Hunter - 升级复盘

**日期**: 2026-01-31
**版本**: v0.1.0 (Architecture Upgrade)

---

## 📋 本次升级内容

### 1. API 安全升级 - 后端代理架构

**问题**：API Key 暴露在前端代码中，任何人打开浏览器开发者工具都能看到。

**解决方案**：添加 Express 后端代理服务器，API Key 仅存储在服务器端环境变量中。

**架构变更**：

```
【不安全 - 之前】
浏览器 → 直接调用 Gemini API（API Key 暴露）

【安全 - 现在】
浏览器 → Express 后端 (隐藏 API Key) → Gemini API
```

---

### 2. 模型升级 - gemini-3-pro

**变更**: `gemini-2.0-flash` → `gemini-3-pro`

**预期提升**：
- 更强的事实核查准确性
- 更好的多模态理解
- 更深入的推理能力

---

## 📁 新增文件

| 文件 | 说明 |
|------|------|
| `server.ts` | Express 后端服务器，代理 Gemini API 调用 |
| `services/apiClient.ts` | 前端 API 客户端，通过 HTTP 调用后端 |
| `nodemon.json` | nodemon 配置，监控 server.ts 变化 |
| `.env.example` | 环境变量模板（不含真实 Key） |

---

## 🔄 修改文件

| 文件 | 变更内容 |
|------|----------|
| `package.json` | 添加后端依赖，更新 npm scripts |
| `App.tsx` | 导入从 `geminiService` 改为 `apiClient` |
| `vite.config.ts` | 移除 API Key 的 define 配置 |
| `.gitignore` | 添加 `.env` 相关文件忽略 |

---

## 🚀 使用方式

### 首次设置

1. **配置环境变量**：
   ```bash
   # 复制模板
   cp .env.example .env

   # 编辑 .env，填入你的 Gemini API Key
   # GEMINI_API_KEY=your_actual_key_here
   ```

2. **安装依赖**（已完成）：
   ```bash
   npm install
   ```

3. **启动开发服务器**：
   ```bash
   npm run dev
   ```
   - 前端：http://localhost:3000
   - 后端：http://localhost:3001

### 新的 NPM Scripts

| 命令 | 说明 |
|------|------|
| `npm run dev` | 同时启动前端 + 后端（推荐） |
| `npm run dev:client` | 仅启动前端 |
| `npm run dev:server` | 仅启动后端 |
| `npm run build` | 构建前端生产版本 |

---

## ⚠️ 注意事项

### 环境变量安全

- ✅ **正确**：`.env` 文件已加入 `.gitignore`，不会提交到 Git
- ✅ **正确**：`.env.example` 只含模板，不含真实 Key
- ⚠️ **重要**：**不要**将 `.env` 文件提交到代码仓库

### 生产环境部署

部署到生产环境时，需要在平台的环境变量配置中设置：
- `GEMINI_API_KEY`
- `PORT`（默认 3001）
- `VITE_API_URL`（前端需指向生产后端地址）

### API Key 获取

从 https://ai.google.dev 获取 Gemini API Key

---

## 🔍 验证结果

### 后端健康检查

```bash
$ curl http://localhost:3001/api/health
{"status":"ok","message":"Truth Hunter API is running"}
```

### 功能验证

- ✅ 后端服务器正常启动
- ✅ Health 端点响应正常
- ✅ 环境变量正确加载
- ✅ CORS 配置允许前端访问
- ⏳ 完整核查流程（需前端启动后测试）

---

## 📚 相关概念

### API 代理服务器

一种中间层服务器，位于前端应用和外部 API 之间，用于：
- 隐藏敏感信息（API Key）
- 添加访问控制（限流、认证）
- 统一错误处理
- 日志监控

### 环境变量

存储敏感配置的机制，不在代码中硬编码：
- `.env` - 真实配置（不提交）
- `.env.example` - 模板（可提交）

### CORS (Cross-Origin Resource Sharing)

允许前端（端口 3000）访问后端（端口 3001）的机制。

---

## 🎯 下一步计划

基于审计报告，后续优化方向：

### Phase 1: 架构优化
- [ ] 拆分 App.tsx 组件
- [ ] 提取 Icons 到单独文件
- [ ] 移动 image processing 到 utils

### Phase 2: 输入验证
- [ ] 添加文件大小限制
- [ ] 添加输入长度限制
- [ ] 添加超时配置

### Phase 3: 功能增强
- [ ] 添加结果导出功能
- [ ] 添加历史记录
- [ ] 优化错误处理

### Phase 4: Prompt 优化
- [ ] 添加偏见检测
- [ ] 添加深度伪造检测
- [ ] 优化中英文混合处理

---

## 📝 技术栈更新

### 新增依赖

```json
{
  "dependencies": {
    "express": "^5.2.1",      // Web 服务器框架
    "cors": "^2.8.6",         // CORS 中间件
    "dotenv": "^17.2.3"       // 环境变量管理
  },
  "devDependencies": {
    "@types/express": "^5.0.6",   // Express 类型定义
    "@types/cors": "^2.8.19",     // CORS 类型定义
    "ts-node": "^10.9.2",         // TypeScript 运行时
    "nodemon": "^3.1.11",         // 文件监控 + 自动重启
    "concurrently": "^9.2.1"      // 同时运行多个命令
  }
}
```

---

**升级完成！** 🎉

如有问题，请检查：
1. `.env` 文件中的 `GEMINI_API_KEY` 是否正确
2. 后端端口 3001 是否被占用
3. 前端 `VITE_API_URL` 是否指向正确的后端地址
