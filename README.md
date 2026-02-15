# 网页截图 MCP

[OneAPI截图API](https://oneapi.coderbox.cn/doc/2256230520358145) 的MPC适配。

需提前获取 `ACCESS_TOKEN`

使用方式：

**Linux/MacOS:**
```json
{
  "mcpServers": {
    "oneapi-screenshot-mcp": {
      "command": "npx",
      "args": [
        "oneapi-screenshot-mcp"
      ],
      "env": {
        "ACCESS_TOKEN": "<ACCESS_TOKEN>"
      }
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "oneapi-screenshot-mcp": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "oneapi-screenshot-mcp"
      ],
      "env": {
        "ACCESS_TOKEN": "<ACCESS_TOKEN>"
      }
    }
  }
}
```

**示例提示词：**
```text
1. 帮我截取百度首页图片。
2. 帮我截取百度首页图片，长1920px，宽1080px。
3. 帮我截取百度首页图片，手机端的。
```