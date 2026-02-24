<div align="center">

# 🔍 Truth Hunter

### **AI-Powered Fact-Checking Tool / 基于 AI 的真实信息验证工具**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF)](https://vitejs.dev/)

**智能验证网络信息的真实性，多维度分析让你看清真相**

[English](#english) | [中文](#中文)

</div>

---

## 中文

### ✨ 功能特点

Truth Hunter 是一个强大的 AI 驱动的事实核查工具，帮助你快速验证网络信息的真实性。

#### 🎯 核心功能

- **📝 文本验证**：输入任何文本内容，AI 自动分析其真实性
- **🖼️ 图片 URL 验证**：提供图片链接，智能识别图片内容并验证
- **📊 多维度分析**：
  - **真实性评分**：AI 判断信息的可信度
  - **时间线分析**：追踪信息的历史演变
  - **来源溯源**：查找信息的原始出处
  - **影响评估**：分析信息的传播影响

- **💾 智能历史记录**：自动保存验证历史，支持快速回顾
- **🎨 精美可视化**：直观的矩阵图表和评级徽章
- **⚡ 响应式设计**：完美适配桌面和移动设备

#### 🛡️ 安全特性

- **多层速率限制**：防止 API 滥用
  - 短期保护：1 分钟最多 5 次请求
  - 中期保护：15 分钟最多 15 次请求
  - 长期保护：1 小时最多 50 次请求
- **本地化部署**：数据不上传第三方服务器，保护隐私
- **环境变量隔离**：API 密钥安全存储

---

### 🚀 快速开始

#### 前置要求

- **Node.js** >= 18.x
- **npm** 或 **yarn**

#### 1️⃣ 克隆仓库

\`\`\`bash
git clone https://github.com/ren1003497048-del/truth-hunter.git
cd truth-hunter
\`\`\`

#### 2️⃣ 安装依赖

\`\`\`bash
npm install
\`\`\`

#### 3️⃣ 配置 API 密钥

创建 \`.env\` 文件（参考 \`.env.example\`）：

\`\`\`bash
# Gemini API Key（从 https://ai.google.dev 获取）
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily Search API Key（从 https://tavily.com 获取，免费 1000 次/月）
TAVILY_API_KEY=your_tavily_api_key_here

# 后端服务器端口
PORT=3003

# 前端 API 地址（开发环境）
VITE_API_URL=http://localhost:3003

# CORS 允许的来源
ALLOWED_ORIGINS=http://localhost:5173
\`\`\`

**获取 API 密钥**：

- **Gemini API**：访问 https://ai.google.dev ，免费获取
- **Tavily API**：访问 https://tavily.com ，注册后免费 1000 次/月

#### 4️⃣ 启动应用

\`\`\`bash
# 启动前后端（开发模式）
npm run dev

# 前端将运行在 http://localhost:5173
# 后端将运行在 http://localhost:3003
\`\`\`

#### 5️⃣ 开始使用

打开浏览器访问 http://localhost:5173，即可开始使用！

---

### 🏗️ 技术栈

#### 前端
- **React 19.2.4** - UI 框架
- **TypeScript 5.8.2** - 类型安全
- **Vite 6.2.0** - 构建工具
- **DOMPurify** - XSS 防护
- **html-to-image** - 截图功能

#### 后端
- **Express 5.2.1** - Web 框架
- **Node.js** - 运行时环境
- **express-rate-limit** - 速率限制
- **cors** - 跨域支持

#### AI 服务
- **Google Gemini API** - 内容分析和生成
- **Tavily Search API** - 网络搜索和来源溯源

---

### 🌟 项目优势

#### 为什么选择 Truth Hunter？

1. **🔍 多维度验证**
   - 不仅判断真假，还分析时间线、来源、影响
   - 提供全面的背景信息

2. **🤖 双 AI 引擎**
   - Gemini API：强大的内容理解和生成
   - Tavily API：实时网络搜索和来源验证

3. **🎯 用户友好**
   - 简洁直观的界面
   - 智能的历史记录
   - 移动端适配

4. **🔒 隐私安全**
   - 本地部署，数据不上传第三方
   - API 密钥安全存储
   - XSS 防护

5. **⚡ 高性能**
   - 多层速率限制保护
   - 智能缓存机制
   - 快速响应

6. **🛠️ 易于定制**
   - 模块化架构
   - 清晰的代码结构
   - 完整的 TypeScript 类型

---

### 🔧 开发指南

#### 可用脚本

\`\`\`bash
# 开发模式（启动前后端）
npm run dev

# 仅启动前端
npm run dev:client

# 仅启动后端
npm run dev:server

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
\`\`\`

#### 配置说明

所有配置集中在 \`config/constants.ts\`：

- 图片处理参数（最大宽度、质量、大小限制）
- API 超时和重试次数
- 历史记录限制
- 速率限制规则
- 名言轮播间隔

---

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

#### 开发流程

1. Fork 本仓库
2. 创建特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 开启 Pull Request

---

### 📝 许可证

本项目基于 **MIT License** 开源。

---

### 📮 联系方式

- **作者**：Hortun Ren
- **GitHub**：[@ren1003497048-del](https://github.com/ren1003497048-del)
- **邮箱**：ren1003497048@gmail.com

---

### 🙏 致谢

- [Google Gemini API](https://ai.google.dev) - 提供强大的 AI 分析能力
- [Tavily Search API](https://tavily.com) - 提供实时搜索和来源验证
- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 极速开发工具

---

### ⭐ 如果这个项目对你有帮助，请给个 Star！

<div align="center">

**Made with ❤️ by [Hortun Ren](https://github.com/ren1003497048-del)**

</div>

---

## English

### ✨ Features

Truth Hunter is a powerful AI-driven fact-checking tool that helps you quickly verify the authenticity of online information.

#### 🎯 Core Features

- **📝 Text Verification**: Input any text content, AI automatically analyzes its authenticity
- **🖼️ Image URL Verification**: Provide image links, intelligently recognize content and verify
- **📊 Multi-dimensional Analysis**:
  - **Authenticity Score**: AI determines the credibility of information
  - **Timeline Analysis**: Track the historical evolution of information
  - **Source Tracing**: Find the original source of information
  - **Impact Assessment**: Analyze the spread and impact

- **💾 Smart History**: Automatically save verification history for quick review
- **🎨 Beautiful Visualization**: Intuitive matrix charts and rating badges
- **⚡ Responsive Design**: Perfect for desktop and mobile devices

#### 🛡️ Security Features

- **Multi-tier Rate Limiting**: Prevent API abuse
  - Short-term: Max 5 requests per minute
  - Medium-term: Max 15 requests per 15 minutes
  - Long-term: Max 50 requests per hour
- **Local Deployment**: Data not uploaded to third-party servers
- **Environment Variable Isolation**: Secure API key storage

---

### 🚀 Quick Start

#### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**

#### 1️⃣ Clone the Repository

\`\`\`bash
git clone https://github.com/ren1003497048-del/truth-hunter.git
cd truth-hunter
\`\`\`

#### 2️⃣ Install Dependencies

\`\`\`bash
npm install
\`\`\`

#### 3️⃣ Configure API Keys

Create \`.env\` file (refer to \`.env.example\`)：

\`\`\`bash
# Gemini API Key (Get from https://ai.google.dev)
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily Search API Key (Get from https://tavily.com, free 1000 times/month)
TAVILY_API_KEY=your_tavily_api_key_here

# Backend server port
PORT=3003

# Frontend API URL (for development)
VITE_API_URL=http://localhost:3003

# CORS allowed origins
ALLOWED_ORIGINS=http://localhost:5173
\`\`\`

**Get API Keys**:

- **Gemini API**: Visit https://ai.google.dev, free to get
- **Tavily API**: Visit https://tavily.com, free 1000 times/month after registration

#### 4️⃣ Start the Application

\`\`\`bash
# Start frontend and backend (development mode)
npm run dev

# Frontend will run on http://localhost:5173
# Backend will run on http://localhost:3003
\`\`\`

#### 5️⃣ Start Using

Open your browser and visit http://localhost:5173 to start using!

---

### 🏗️ Tech Stack

#### Frontend
- **React 19.2.4** - UI Framework
- **TypeScript 5.8.2** - Type Safety
- **Vite 6.2.0** - Build Tool
- **DOMPurify** - XSS Protection
- **html-to-image** - Screenshot functionality

#### Backend
- **Express 5.2.1** - Web Framework
- **Node.js** - Runtime Environment
- **express-rate-limit** - Rate Limiting
- **cors** - CORS Support

#### AI Services
- **Google Gemini API** - Content analysis and generation
- **Tavily Search API** - Web search and source tracing

---

### 🌟 Why Truth Hunter?

1. **🔍 Multi-dimensional Verification**
   - Not just true/false, but also timeline, sources, impact
   - Comprehensive background information

2. **🤖 Dual AI Engine**
   - Gemini API: Powerful content understanding
   - Tavily API: Real-time web search

3. **🎯 User-Friendly**
   - Clean and intuitive interface
   - Smart history tracking
   - Mobile-responsive

4. **🔒 Privacy & Security**
   - Local deployment
   - Secure API key storage
   - XSS protection

5. **⚡ High Performance**
   - Multi-tier rate limiting
   - Smart caching
   - Fast response

6. **🛠️ Easy to Customize**
   - Modular architecture
   - Clear code structure
   - Complete TypeScript types

---

### 🤝 Contributing

Issues and Pull Requests are welcome!

---

### 📝 License

This project is licensed under the **MIT License**.

---

### 📮 Contact

- **Author**: Hortun Ren
- **GitHub**: [@ren1003497048-del](https://github.com/ren1003497048-del)
- **Email**: ren1003497048@gmail.com

---

### ⭐ If this project helps you, please give it a Star!

<div align="center">

**Made with ❤️ by [Hortun Ren](https://github.com/ren1003497048-del)**

</div>
