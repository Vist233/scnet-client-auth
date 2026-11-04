# 超算互联网「计算服务」· Magpie 插件

把 Windows「计算服务」客户端（SCNet Client）已经登录的模型接入 [Magpie](https://usemagpie.ai)。

- 复用客户端自己的登录凭据，不需要重新扫码/输密码
- 读取客户端的 `models.json`，带出 **30 个模型**、1M 上下文、128k 输出、视觉与工具调用
- 只把请求发往 `https://api.scnet.cn/api/llm/v1/chat/completions`
- 支持流式输出和工具调用

> 这是社区插件，不是 SCNet 或 Magpie 官方插件。  
> 也**不是** Token Plan 插件：Token Plan 用的是 `sk-tp-` Key，本插件用的是「计算服务」客户端里的普通 `sk-` Key。

## 已验证（2026-11-04，本地 WSL）

- `magpie plugin login scnet-client` 自动读取 `%USERPROFILE%\.sclaw\agent` 成功
- 30 个模型全部暴露到 Magpie（`magpie provider models scnet-client <30 个 ID>`）
- `SCNet-Max` 非流式、流式（SSE，含 `reasoning_content` + `content`）均通过
- 当前这份 key 对其他模型返回 `Insufficient Balance`：实测 `DeepSeek-V4.1-Flash-1017`、`Qwen3.8-Flash`、`GLM-5.3-Flash` 都一样。**免费额度目前只覆盖 `SCNet-Max`**；其他模型要等账户有余额或在 App 里确认套餐。
- 账号密码登录：已验证，登录后 Key 与客户端 `.sclaw` 一致。
- 手机号验证码登录：已验证（手机号 → 短信码两步），登录后 Key 与账号密码/客户端 `.sclaw` 一致。
- 客户端读取、账号密码、手机号三条路径拿到的都是同一把 `sk-` Key（`sk-…`，43 位）。
- `scripts/check-cookie.mjs` 可对比网页 Cookie 与客户端 `config.json` 里的账号是否一致。

## 它从哪里读登录

客户端把数据放在：

```text
Windows:  %USERPROFILE%\.sclaw\agent\
Linux:    ~/.sclaw/agent\
```

```text
scnet-credentials\<hash>.json   {"scnet":{"type":"api_key","key":"sk-..."}}
models.json                     30 个模型、上下文、maxTokens、能力
settings.json                   defaultProvider / defaultModel
```

插件按以下顺序找：

1. `SCNET_SCLAW_DIR`（容器/远程最常用，例如 `/sclaw/agent`）
2. `SCNET_AGENT_DIR`
3. `~/.sclaw/agent`
4. `%USERPROFILE%\.sclaw\agent`
5. WSL 下的 `/mnt/c/Users/*/.sclaw/agent`

多个凭据文件按 mtime 取最新一份。

## 安装

```sh
# GitHub
magpie plugin add github:<owner>/scnet-client-auth

# 本地开发
magpie plugin add ./scnet-client-auth
```

## 本地开发运行（WSL）

Magpie 的插件宿主需要 Bun。没有系统 Bun 时，可以单独放一份：

```sh
export HOME=$PWD/.runtime/home
export XDG_CONFIG_HOME=$PWD/.runtime/config
export XDG_CACHE_HOME=$PWD/.runtime/cache
export XDG_DATA_HOME=$PWD/.runtime/data
export XDG_STATE_HOME=$PWD/.runtime/state
export SCNET_SCLAW_DIR=/mnt/c/Users/<you>/.sclaw/agent
export MAGPIE_BUN=/path/to/bun

./magpie plugin add .
./magpie plugin login scnet-client      # 选 1：读取计算服务客户端的登录
./magpie web --addr 0.0.0.0:3430 --no-open
```

`magpie web` 会打印一个带 `k=` 的本地 URL；打开后即可在浏览器里看到插件、账号和模型。

## 登录

### 同机（Windows / WSL / 本机 Magpie）

打开 Magpie → 供应商 → 添加供应商 → 来自插件 → **超算互联网 · 计算服务**，选择：

- **读取计算服务客户端的登录（本机）**：自动读取 `.sclaw`，无需输入
- 或 **手动填写计算服务 API Key**：粘贴 `sk-` Key

CLI：

```sh
magpie plugin login scnet-client
```

除了自动读取和手动 Key，插件还提供两种在线登录：

- **账号密码登录**：用户名 + 密码；如果 SCNet 要求图形验证码，会返回验证码图片并让你输入。
- **手机号验证码登录**：输入手机号 → 收到短信 → 在 Magpie 里输入验证码。输入框只显示本地号码；请求时自动补 `+86`，界面上不显示国家码。

登录成功后插件会自动调用 `POST /acx/llm/api-key/createActivityApiKey` 获取/创建 `sk-` Key，并保存到 Magpie；不需要再手动复制 Key。

### 网页 Cookie 与客户端账号是否同一个

`www.scnet.cn` 的网页登录用的是控制台 Cookie，计算服务用的是 `sk-` 推理 Key，两者不是同一种凭据；它们可能属于同一个账号。用这个脚本可以对比：

```sh
# 从浏览器 DevTools → Network → 任意请求 → Request Headers 复制 Cookie 的值
SCNET_COOKIE='Token=...; ...' node scripts/check-cookie.mjs
```

脚本只把 Cookie 发给 `www.scnet.cn`，不会打印 Cookie；它会显示网页账号和客户端 `config.json` 里的 `userInfo`（id / userName / 姓名 / 手机号掩码），并给出是否同一个账号的结论。

实测（2026-11-04）：chatbot 的 Cookie 与客户端账号一致，但用它访问 `/acx/user/users/cluster-user-detail` 返回 401。也就是说 **chatbot 的 Token 只能读用户信息，不能管理计算服务 Key**；要拿 `sk-` Key 还是走账号密码/短信登录，或直接复用客户端的 `.sclaw`。

### Docker / 远程 Magpie

容器里读不到 Windows 的 `.sclaw`，把目录挂进去：

```sh
docker run -d --name magpie \
  -p 3425:3425 -p 3430:3430 \
  -v magpie-config:/config \
  -v 'C:\Users\<you>\.sclaw:/sclaw:ro' \
  -e SCNET_SCLAW_DIR=/sclaw/agent \
  ghcr.io/yetone/magpie:stable web --addr 0.0.0.0:3430 --no-open
```

或者不挂载，使用**手动填写 API Key**，Key 从 `%USERPROFILE%\.sclaw\agent\scnet-credentials\*.json` 里取。

## 使用

```sh
magpie models | grep scnet-client
magpie provider test scnet-client SCNet-Max
```

在 Agent 里选择：

```text
scnet-client/SCNet-Max
scnet-client/DeepSeek-V4.1-Flash-1017
scnet-client/DeepSeek-V4.1-Flash
scnet-client/Kimi-K3
...
```

30 个模型全部来自客户端的 `models.json`，包括：

| 模型 | 上下文 | 输出 | 能力 |
|---|---|---|---|
| `SCNet-Max` | 1,048,576 | 131,072 | 推理 + 视觉 |
| `DeepSeek-V4.1-Flash-1017` | 1,048,576 | 131,072 | 文本 |
| `DeepSeek-V4.1-Flash` | 1,048,576 | 131,072 | 推理 + 视觉 |
| `DeepSeek-V4-Pro-0813` | 1,048,576 | 131,072 | 推理 |
| `Kimi-K3` | 1,024,000 | 131,072 | 推理 + 视觉 |
| `GLM-5.3-Flash` | 1,048,576 | 131,072 | 推理 + 视觉 |
| `Qwen3.8-Flash` | 1,048,576 | 131,072 | 视觉 |
| `Qwen3.8-Max` | 1,048,576 | 131,072 | 视觉 |

完整列表见 `models.mjs`（由客户端 `models.json` 生成）。

## Agent 为主

- 登录页：`bash scripts/open-login.sh`（Agent 可直接执行，自动在 Windows 打开浏览器）
- 登录状态：`bash scripts/status-local.sh`
- 账号密码：一步完成；手机号：先输手机号 → 发短信 → 同一个弹窗里出现 **Code** 输入框，两步完成
- 登录后 Agent 走网关：

  ```text
  base_url  http://127.0.0.1:3425/v1
  model     scnet-client/SCNet-Max
  api_key   magpie
  ```

- 如果 Magpie 和 Agent 在同一个配置里，也可以用 `magpie <agent> scnet-client/SCNet-Max` 直接改 Agent 的模型
- 手机号输入框只显示本地号码；`+86` 只在请求内部自动补，不会显示在前端

## 额度显示

暂未实现。客户端的 `sk-` Key 本身不返回余额；客户端界面里的额度走的是官网控制台会话（Cookie），不是推理 API Key。后续如果要显示，需要：

1. 从客户端 Electron 会话里读控制台 Cookie，或
2. 让用户手动粘贴控制台 Cookie，再查询 `www.scnet.cn` 的余额接口。

不影响模型调用。

## 安全

- Key 只在请求时读取，不写日志、不进错误信息
- `fetch` 只允许 `https://api.scnet.cn/api/llm/v1/chat/completions`
- 强制删除 `authorization` / `x-api-key` / `x-goog-api-key` / `cookie` / `proxy-authorization`
- 设置 `redirect: "error"`，不跟随重定向
- 不缓冲、不解析上游响应，流式与工具调用原样透传

## 注意

- 「计算服务」客户端目前是 Windows 应用；远程 Linux Magpie 需要挂载 `.sclaw` 或手动填 Key。
- 模型的 `contextWindow` / `maxTokens` 来自客户端目录；SCNet 官方没有单独公布这些数值。
- 请遵守 SCNet 的使用条款。这个插件只是复用你本机客户端的登录，不绕过登录或验证码。

## License

MIT
