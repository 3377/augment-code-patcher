# 🛡️ Augment Code 拦截器

风控太严了，本工具已失效，不推荐使用。

## 🚀 项目简介

本项目旨在解决 Augment Code VS Code 插件的隐私和数据收集问题。

##  快速开始

### 方法1：下载预构建版本

1. **前往 Releases 页面**：点击本仓库主页右侧的 [**Releases**](https://github.com/cylind/augment-code-patcher/releases) 链接
2. **下载最新版补丁**: 找到顶部的最新版本，下载 `.vsix` 文件
3. **在 VS Code 中安装**:
   - 打开 VS Code，进入"扩展"侧边栏 (`Ctrl+Shift+X`)
   - 点击右上角的 `...` 更多操作菜单
   - 选择 **"从 VSIX 安装... (Install from VSIX...)"**
   - 选择你刚刚下载的 `.vsix` 文件
4. **完成！** 重启 VS Code 后即可享受隐私保护

### 方法2：手动安装拦截器

#### 步骤1: 找到Augment Code插件目录

**Windows:**
```
C:\Users\{你的用户名}\.vscode\extensions\augment.vscode-augment-*\
```

**macOS/Linux:**
```
~/.vscode/extensions/augment.vscode-augment-*/
```

#### 步骤2: 复制拦截器文件

将 `augment-interceptor.js` 复制到插件目录中（通常是 `out/`）。

#### 步骤3: 注入拦截器代码

找到插件的主入口文件（通常是 `out/extension.js`），在文件**最开头**添加：

```javascript
require('./augment-interceptor.js');
```

#### 步骤4: 重启VSCode

重启VSCode让修改后的插件生效。

## 🔍 验证安装

### 查看拦截器日志

重启VSCode后，按 `Ctrl+Shift+I` 打开开发者工具，在Console中查看是否有拦截器启动日志：

```
[Extension Host] 🚀 正在加载 Augment Code Extension 完整拦截器 ...
[Extension Host] 🛡️ [拦截器管理] 完整拦截器初始化完成
```

### 观察拦截日志

使用Augment Code功能时，应该能看到拦截日志：

```
[Extension Host] ✅ [网络请求] POST https://api.augmentcode.com/... - 必要功能已放行
[Extension Host] 🚫 [网络请求] POST https://api.segment.io/... - 遥测数据已拦截
[Extension Host] 🔄 [系统信息] hostname() 调用 - 伪造: DESKTOP-abc123
```

## 🎉 享受安全的编程体验！

安装完成后，你可以：

- ✅ 安全使用Augment Code的所有功能
- ✅ 完全保护个人隐私和系统信息  
- ✅ 避免账号封禁和身份追踪

拦截器会自动工作，无需额外配置。如有问题，请查看开发者控制台的详细日志信息。

## ⚠️ 免责声明

- 本项目提供的 `.vsix` 文件是基于官方插件修改的 **非官方构建版本**
- 本项目仅用于技术学习和研究，旨在提高用户对个人数据和隐私的控制能力
- 请自行承担使用本项目产出的插件可能带来的任何风险
