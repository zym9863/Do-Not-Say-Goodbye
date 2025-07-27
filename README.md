# 不说再见 (Do Not Say Goodbye)

中文版 | [English](README_EN.md)

一个帮助你封存美好回忆，寻找新地平线的应用。

## 项目简介

"不说再见"是一个基于 Nuxt 3 和 Supabase 构建的情感记录应用，旨在帮助用户以积极的方式处理离别和回忆。应用包含两个核心功能：

### 🎭 瞬间胶囊 (Moment Capsule)
- 封存美好瞬间，上传照片、记录文字、关联音乐
- 创建专属的回忆时间线
- 支持胶囊封存和定时开启功能
- 私密的个人回忆空间

### 🌅 地平线回响 (Horizon Echo)
- 通过启发性问题引导自我对话
- 记录心情评分和成长轨迹
- 帮助用户从"不说再见"到"寻找新地平线"的心理跨越

## 技术栈

- **前端框架**: Nuxt 3
- **样式**: Tailwind CSS
- **UI组件**: Headless UI + Heroicons
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **包管理器**: pnpm

## 环境要求

- Node.js 18+
- pnpm 8+

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/zym9863/Do-Not-Say-Goodbye.git
cd Do-Not-Say-Goodbye
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

创建 `.env` 文件并配置 Supabase 连接信息：

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 启动开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动。

## 数据库设置

项目已包含完整的数据库迁移脚本，包括：

- 用户认证表
- 瞬间胶囊表 (`moment_capsules`)
- 时间线表 (`timelines`)
- 用户回响表 (`user_echoes`)
- 启发性问题表 (`inspiration_questions`)
- 成长里程碑表 (`growth_milestones`)

所有表都已配置 RLS (Row Level Security) 策略确保数据安全。

## 功能特性

### 🔐 用户认证
- 邮箱注册/登录
- 安全的会话管理
- 受保护的路由

### 📸 瞬间胶囊
- 多媒体内容支持（照片、文字、音乐）
- 标签系统
- 胶囊封存/开启机制
- 时间线展示

### 💭 地平线回响
- 分类启发性问题
- 心情评分系统
- 标签和分类
- 成长轨迹可视化

### 🎨 用户体验
- 响应式设计
- 流畅的动画效果
- 直观的导航
- 优雅的错误处理

## 部署

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 项目结构

```
├── assets/          # 静态资源
├── components/      # Vue 组件
├── composables/     # 组合式函数
├── layouts/         # 布局组件
├── middleware/      # 中间件
├── pages/           # 页面组件
├── public/          # 公共静态文件
└── server/          # 服务端代码
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过 Issues 联系我们。
