# 贡献指南 / Contributing to Fact Check

感谢你有兴趣为 Fact Check 项目做出贡献！

## 如何贡献 / How to Contribute

### 报告 Bug / Reporting Bugs

1. 使用 [Bug Report 模板](https://github.com/ren1003497048-del/fact-check/issues/new?template=bug_report.md)
2. 提供详细的重现步骤
3. 包含环境信息和截图

### 提出新功能 / Suggesting Features

1. 使用 [Feature Request 模板](https://github.com/ren1003497048-del/fact-check/issues/new?template=feature_request.md)
2. 清楚地描述功能需求
3. 说明使用场景和价值

### 提交代码 / Submitting Code

#### 开发流程 / Development Workflow

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fact-check.git
   cd fact-check
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **进行更改**
   - 遵循现有代码风格
   - 添加必要的注释
   - 确保代码通过 TypeScript 检查

5. **测试更改**
   ```bash
   npm install
   npm run dev
   ```

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **推送到你的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建 Pull Request**
   - 访问原始仓库
   - 点击 "New Pull Request"
   - 提供清晰的 PR 描述

---

## 代码规范 / Code Style

### TypeScript/JavaScript

- 使用 TypeScript 编写新代码
- 遵循现有项目的代码结构
- 使用有意义的变量和函数名
- 添加适当的注释

### 提交消息规范 / Commit Message Convention

```
<type>(<scope>): <subject>

类型 / Type:
- feat: 新功能
- fix: 修复 Bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构代码
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具相关

示例 / Examples:
- feat: add dark mode support
- fix: resolve API timeout issue
- docs: update README with new features
```

---

## 项目结构 / Project Structure

```
fact-check/
├── components/          # React 组件
├── services/           # API 服务
├── hooks/              # 自定义 Hooks
├── config/             # 配置文件
├── utils/              # 工具函数
├── server.ts           # Express 服务器
└── App.tsx             # 主应用组件
```

---

## 开发指南 / Development Guide

### 安装依赖 / Install Dependencies

```bash
npm install
```

### 运行开发服务器 / Run Development Server

```bash
npm run dev
# 前端: http://localhost:5173
# 后端: http://localhost:3003
```

### 构建生产版本 / Build for Production

```bash
npm run build
```

### 运行测试 / Run Tests

```bash
npm test
```

---

## 代码审查流程 / Code Review Process

1. 所有 PR 需要至少一位维护者审查
2. 确保所有检查通过（CI/CD）
3. 解决审查中的所有请求更改
4. PR 被批准后合并到主分支

---

## 行为准则 / Code of Conduct

- 尊重所有贡献者
- 欢迎不同观点和建设性反馈
- 专注于对项目最有利的事情
- 对社区友好和包容

---

## 获取帮助 / Getting Help

- 📧 邮件: ren1003497048@gmail.com
- 🐛 Issues: https://github.com/ren1003497048-del/fact-check/issues
- 💬 Discussions: https://github.com/ren1003497048-del/fact-check/discussions

---

**再次感谢你的贡献！** / **Thank you for contributing!**
