# 小学生数学乘法竖式练习工具

这是一个专为小学生设计的三位数与两位数乘法竖式计算练习工具，基于北师版数学四年级第三单元内容开发。

## 功能特点

- 自动生成三位数×两位数的乘法竖式练习题
- 支持自定义输入被乘数和乘数
- 实时反馈用户输入的正确性（绿色表示正确，红色表示错误，黑色表示此格不用填写）
- 提供"检查答案"功能验证所有输入
- 提供"显示答案"功能，帮助学习正确解法
- 支持深色/浅色主题切换
- 包含详细的学习提示和指导

## 部署指南

### 下载和上传代码到GitHub

1. 从提供的链接下载ZIP文件并解压
2. 在GitHub上创建一个新的仓库
3. 上传以下文件和文件夹到您的GitHub仓库：
   - 所有根目录文件（package.json, .gitignore, index.html等）
   - src/ 文件夹（包含所有源代码）
   - 配置文件（tailwind.config.js, vite.config.ts等）
   - **注意：不要上传node_modules和dist文件夹**

### 使用GitHub Pages部署

1. 确保您的仓库中有.gitignore文件，排除node_modules和dist等不必要的文件
2. 将代码推送到GitHub仓库
3. 安装依赖并构建项目：
   ```bash
   npm install
   npm run build
   ```
4. 部署到GitHub Pages：
   ```bash
   npm run deploy
   ```
5. 在GitHub仓库的Settings > Pages中，确认部署源设置正确
6. 等待几分钟，您的网站将会在`https://[您的用户名].github.io/[仓库名]/`上可用

## 本地开发

如果您想在本地开发或修改此项目：

1. 克隆仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```
4. 打开浏览器访问 http://localhost:5173

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Sonner (Toast通知)

## 版权信息

© 2025 小学生数学学习工具 - 仅供教育使用