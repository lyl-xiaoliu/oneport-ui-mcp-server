# oneport-ui-mcp-server

A minimal [Model Context Protocol (MCP)](https://modelcontextprotocol.org/) server for Cursor integration, designed to fetch and serve component source code, demo code, and metadata from the oneport-ui (shadcn-ui) repository.

---

## Features

- List all UI components in the remote registry
- Fetch component source code (from shadcn-ui registry, decoded)
- Fetch and extract demo code snippets for each component
- Provide component metadata (name, path, dependencies, etc.)
- Expose all features as MCP tools, auto-discoverable by Cursor

---

## Dependencies

- `@modelcontextprotocol/sdk`
- `axios`
- `zod`
- `joi`
- Dev: `@types/node`, `typescript`

---

## Getting Started

### 1. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 2. 构建项目

```bash
pnpm build
# 或
npm run build
```

### 3. 启动 MCP Server

```bash
pnpm start
# 或
node build/index.js
```

你应该会看到日志输出 `Server started successfully`。

---

## MCP 工具用法

### 1. 通过脚本直接调用

- 获取组件源码：

  ```bash
  pnpm tsx test-get-button.ts
  ```

- 获取组件 demo 示例：

  ```bash
  pnpm tsx test-get-button-demo.ts
  ```

### 2. 通过 Cursor 调用

- 确保 `.cursor/mcp.json` 配置了本地 MCP server（见下方配置示例）。
- 在 Cursor 命令面板输入 `/get_component button` 或 `/oneport-ui button的组件源码`，即可获取源码。
- 输入 `/get_component_demo button` 获取 demo 示例。

---

## MCP 配置示例

在 `~/.cursor/mcp.json` 或项目根目录 `.cursor/mcp.json` 添加：

```json
{
  "mcpServers": {
    "oneport-ui": {
      "command": "node",
      "args": ["build/index.js"]
    }
  }
}
```

---

## 目录结构

- `src/tools/components/` MCP 工具实现
- `src/utils/axios.ts` 远程拉取 shadcn-ui 组件源码和 demo
- `test-get-button.ts`、`test-get-button-demo.ts` 脚本测试工具功能
- `build/` 目录为编译后产物

---

## 常见问题

- **工具无法调用？**  
  检查 MCP Server 是否已启动，Cursor 的 MCP 配置是否正确。
- **拉取源码失败？**  
  检查网络连接，GitHub API 是否可访问。
- **Cursor 无法发现工具？**  
  检查 MCP Server 日志，确认工具已注册。

---

## TODO

- [ ] 支持更多组件元数据
- [ ] 更丰富的错误处理和日志
- [ ] 支持自定义组件仓库
- [ ] 完善 API 文档

---

如需详细开发文档或遇到问题，请查阅源码或联系维护者。
