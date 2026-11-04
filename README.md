# 超算互联网「计算服务」客户端 · Magpie 插件

把 **超算互联网「计算服务」客户端**（`scnet-client` / `计算服务.exe`）的登录接入 Magpie，反向代理它的 30 个模型（SCNet-Max、DeepSeek、Kimi、GLM、Qwen 等）。

> **不是 SCNet Token Plan。**  
> Token Plan 使用 `sk-tp-` Key，能在控制台查看 Credits；本插件反代的是「计算服务」客户端，使用它的 `sk-` Key，**不支持查看额度**。需要 Token Plan 请用 [`bbingz/scnet-auth`](https://github.com/bbingz/scnet-auth)。

## 安装

**Magpie GUI**：

插件 → 已安装 → 在 “Have one in mind? / 有想装的插件？” 输入：

```text
github:Vist233/scnet-client-auth
```

点安装。

**命令行**：

```sh
magpie plugin add github:Vist233/scnet-client-auth
```

## 一句话让 AI 安装并登录

> 安装 github:Vist233/scnet-client-auth，然后用我的 SCNet 账号密码登录。

AI 会安装插件，并让你提供账号密码或手机号；登录后自动写入 Key。

## 账号密码

对 AI 说“用账号密码登录”，然后给出用户名和密码。

## 手机号

对 AI 说“手机号登录”，给出手机号；收到短信后把验证码发给 AI。

## 不想在聊天里发凭据

对 AI 说“打开登录页”，在 Magpie 里自己输入：

Magpie → 供应商 → 超算互联网 · 计算服务 → 登录

## 使用

- 模型：`scnet-client/SCNet-Max`
- 当前 Key 只有 `SCNet-Max` 免费可用；其他模型可能返回 `Insufficient Balance`
- Agent 脚本说明见 [AGENTS.md](AGENTS.md)

## 为什么有这个插件

- Token Plan 插件不覆盖「计算服务」客户端；两者是不同的产品、Key 类型和额度体系。
- 本插件只复用「计算服务」客户端的登录和模型，不读取额度，也不走 Token Plan。

## License

MIT
