// Generated from the SCNet 计算服务 app's models.json.
// Source: /mnt/c/Users/86138/.sclaw/agent/models.json

export const SCNET_PROVIDER = {
  "name": "超算互联网",
  "baseUrl": "https://api.scnet.cn/api/llm/v1",
  "api": "openai-completions",
  "authMode": "api-key",
  "modelListMode": "automatic"
}

export const SCNET_MODELS = [
  {
    "id": "DeepSeek-V4.1-Flash-1017",
    "name": "DeepSeek-V4.1-Flash-1017",
    "description": "DeepSeek-V4.1-Flash-1017 是 DeepSeek V4.1 Flash 系列的最新迭代版本，采用 552B 总参数 MoE 架构，输入/输出激活参数分别为 8B/16B，支持 百万 Token 上下文、原生图像理解、思考与非思考模式及工具调用。模型兼顾推理能力与运行效率，适用于智能问答、长文档分析、代码开发和智能体任务。",
    "tags": [
      "文本生成",
      "深度思考",
      "视觉理解"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "MiniMax-M3.1-Flash",
    "name": "MiniMax-M3.1-Flash",
    "description": "MiniMax-M3.1-Flash 是 MiniMax 面向代码开发与智能体任务推出的原生多模态模型，支持百万Token上下文、文本/图像/视频输入与可调思考深度，具备工具调用、长链路任务规划和视觉理解能力。适用于代码生成与修复、长文档及代码库分析、企业办公自动化和跨应用工作流，在任务能力与推理效率之间兼顾表现与成本。",
    "tags": [
      "文本生成",
      "深度思考",
      "视觉理解"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "DeepSeek-V4.1-Flash",
    "name": "DeepSeek-V4.1-Flash",
    "description": "【暂不支持闲忙时定价】2026年9月10日发布的高效轻量化MoE模型，原生支持百万超长上下文能力。推理速度快、延迟低、调用成本低廉，综合能力均衡，主打高并发、轻量化任务，适合日常对话、内容创作、基础 RAG、批量文案处理等普惠刚需场景。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": "off",
      "minimal": null,
      "low": "low",
      "medium": null,
      "high": "high",
      "xhigh": null,
      "max": "max"
    },
    "defaultThinkingLevel": "high",
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "Kimi-K3",
    "name": "Kimi-K3",
    "description": "Kimi K3 拥有 2.8 万亿参数，基于 KDA 混合线性注意力机制和注意力残差技术构建，原生支持视觉理解，并拥有 100 万 token 上下文窗口。它是全球首个开源的 3 万亿级别模型，面向长程编程、知识工作和推理等前沿智能场景而设计。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": null,
      "minimal": null,
      "low": "low",
      "medium": null,
      "high": "high",
      "xhigh": null,
      "max": "max"
    },
    "defaultThinkingLevel": "max",
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1024000,
    "maxTokens": 131072
  },
  {
    "id": "GLM-5.3-Flash",
    "name": "GLM-5.3-Flash",
    "description": "2026年8月26日发布的GLM-5.3-Flash 是 GLM-5 系列首个原生多模态模型，总参数量 320B、激活参数量 18B，是首个采用稀疏注意力与线性注意力混合架构的开源前沿模型。",
    "tags": [
      "文本生成",
      "深度思考",
      "视觉理解"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": null,
      "minimal": null,
      "low": "low",
      "medium": null,
      "high": "high",
      "xhigh": null,
      "max": "max"
    },
    "defaultThinkingLevel": "max",
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.8-Flash",
    "name": "Qwen3.8-Flash",
    "description": "2026年8月27日发布的多模态大模型，兼具强大的理解与生成能力和出色的响应速度，在编程辅助、智能体协作、图文理解等场景中表现尤为出色，是开发者和企业在 AI 应用中兼顾效果与效率的理想选择。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "GLM-5.3",
    "name": "GLM-5.3",
    "description": "2026年8月19日发布的GLM-5.3 是智谱迄今能力最强的开源模型，支持真正可用的 1M 上下文，并在长程任务中继续保持领先，适用于复杂工程任务、长程交互、代码生成、企业应用等场景。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": null,
      "minimal": null,
      "low": "low",
      "medium": null,
      "high": "high",
      "xhigh": null,
      "max": "max"
    },
    "defaultThinkingLevel": "max",
    "input": [
      "text"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "MiniMax-M3",
    "name": "MiniMax-M3",
    "description": "MiniMax M3 凭借业界领先的 Coding 与 Agentic 能力、1M 超长上下文窗口以及原生多模态特性，可出色胜任企业级长文档理解、高质量内容生成、代码编写、Bug 修复及原生应用构建等任务；强大的 Agentic 能力端到端贯通工作流，原生多模态更带来流畅自然的图文混合交互体验。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 1024000,
    "maxTokens": 131072
  },
  {
    "id": "DeepSeek-V4-Pro-0813",
    "name": "DeepSeek-V4-Pro-0813",
    "description": "【暂不支持闲忙时定价】【RPM预设为50】2026年8月13日更新的旗舰级 MoE 大模型，总参1.6T、激活 49B，原生支持百万级超长上下文，支持文本生成、深度思考，适配高阶科研、复杂办公、深度智能代理等高难度场景。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": "off",
      "minimal": null,
      "low": "low",
      "medium": null,
      "high": "high",
      "xhigh": null,
      "max": "max"
    },
    "defaultThinkingLevel": "high",
    "input": [
      "text"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.8-Max",
    "name": "Qwen3.8-Max",
    "description": "2026年8月发布的2.4万亿参数MoE旗舰模型，支持文字、图片、视频输入，文本输出。原生视觉理解能力贯穿规划、执行与验证全流程，支持超长文档与长视频的深度语义解析。",
    "tags": [
      "文本生成",
      "深度思考",
      "视觉理解"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "DeepSeek-V4-Flash-0731",
    "name": "DeepSeek-V4-Flash-0731",
    "description": "【暂不支持闲忙时定价】2026年7月31日发布的高效轻量化MoE模型，总参284B，激活13B，原生支持百万超长上下文能力。推理速度快、延迟低、调用成本低廉，综合能力均衡，主打高并发、轻量化任务，适合日常对话、内容创作、基础 RAG、批量文案处理等普惠刚需场景。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": "off",
      "minimal": null,
      "low": "low",
      "medium": null,
      "high": "high",
      "xhigh": null,
      "max": "max"
    },
    "defaultThinkingLevel": "high",
    "input": [
      "text"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "GLM-5.2",
    "name": "GLM-5.2",
    "description": "GLM-5.2是智谱AI面向长程任务（Long Horizon Task）设计的新一代开源旗舰模型，支持1M无损超长上下文。具备卓越的编程与工程能力，可自主完成任务拆解、架构设计、前后端开发、联调测试到多端部署的完整链路，适用于复杂工程任务、长程交互、代码生成、企业应用等场景。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": "off",
      "minimal": null,
      "low": null,
      "medium": null,
      "high": "high",
      "xhigh": null,
      "max": "max"
    },
    "defaultThinkingLevel": "max",
    "input": [
      "text"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "Spark-X2.5",
    "name": "Spark-X2.5",
    "description": "【暂不支持Responses协议】Spark-X2.5是2026年9月7日发布的星火旗舰模型，基于全国产平台训练，采用MoE框架，模型参数293B-A30，支持256K上下文，全面提升复杂项目级代码生成和智能体工作任务能力，同时覆盖 200 余种语言，在语言理解、答题、推理等通用任务上保持优异的效果。可适配 Claude Code、Codex 、Openclaw、hermes 等通用智能体脚手架。",
    "tags": [
      "文本生成"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 262144,
    "maxTokens": 131072
  },
  {
    "id": "GLM-5.1",
    "name": "GLM-5.1",
    "description": "GLM-5.1是智谱AI推出的面向长程任务（Long Horizon Task）设计的模型，总参数744B，支持200K超长上下文，最大输出 128K tokens。拥有强大逻辑推理、长文本理解与代码生成能力、兼顾性能与推理效率；在多任务基准中表现优异，适用于智能交互、企业应用、开发辅助等场景。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 206848,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.7-Max",
    "name": "Qwen3.7-Max",
    "description": "Qwen3.7系列中规模最大、综合能力最强的Max模型，当前开放纯文本模型能力供体验。Qwen3.7是面向智能体时代的新一代旗舰模型，核心优势在于智能体能力的广度与深度：在编程、办公与生产力、长周期自主执行方面均能出色胜任各项任务。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 1014784,
    "maxTokens": 131072
  },
  {
    "id": "Kimi-K2.7-Code",
    "name": "Kimi-K2.7-Code",
    "description": "kimi-k2.7-code是 kimi 迄今最智能的coding模型，在长上下文中更可靠地遵循指令，能以更高的成功率完成编程任务，同时支持文本、图片与视频输入，思考模式，对话与 Agent 任务。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 262144,
    "maxTokens": 131072
  },
  {
    "id": "Kimi-K2.6",
    "name": "Kimi-K2.6",
    "description": "【弹性扩容】Kimi-K2.6 是专为开发者优化的通用大模型，在长上下文、代码生成与多轮推理上表现卓越。它原生支持全模态输入，提供思考模式切换，兼顾深度逻辑与响应速度。凭借强大的指令遵循与 Agent 适配能力，它是构建下一代智能应用的高性能核心底座。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 262144,
    "maxTokens": 131072
  },
  {
    "id": "Kimi-K2.5",
    "name": "Kimi-K2.5",
    "description": "Kimi K2.5 在 Agent、代码、视觉理解及一系列通用智能任务上取得开源 SoTA 表现。同时 Kimi K2.5 也是 Kimi 迄今最全能的模型，原生的多模态架构设计，同时支持视觉与文本输入、思考与非思考模式、对话与 Agent 任务。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 262144,
    "maxTokens": 131072
  },
  {
    "id": "GLM-5",
    "name": "GLM-5",
    "description": "智谱新一代旗舰基座,面向AgenticEngineering,实现从代码到工程的范式跃迁,擅长复杂系统工程与长程Agent任务。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 204800,
    "maxTokens": 131072
  },
  {
    "id": "MiniMax-M2.7",
    "name": "MiniMax-M2.7",
    "description": "MiniMax 2.7 为旗舰智能体大模型，拥有强大代码工程、长文本理解与创作能力，支持多智能体协同、复杂任务自主规划执行，交互流畅，综合推理与实用落地表现突出。能够自行构建复杂 Agent Harness，并基于 Agent Teams、复杂 Skills、Tool Search tool 等能力，完成高度复杂的生产力任务。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 204800,
    "maxTokens": 131072
  },
  {
    "id": "MiniMax-M2.5",
    "name": "MiniMax-M2.5",
    "description": "MiniMax-M2.5 是编码与智能体领域的 SOTA 模型，专为 Agent Universe 设计，MiniMax-M2.5 是一款在编程、工具调用、搜索及办公等多个生产力场景中达到了行业领先水平。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 204800,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.7-Plus",
    "name": "Qwen3.7-Plus",
    "description": "Qwen3.7系列中高性价比Plus模型，在强大文本能力的基础上全面升级了视觉-语言能力，同时保持了在编码、工具使用和生产力工作流方面的完整智能体能力。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1014784,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.6-Plus",
    "name": "Qwen3.6-Plus",
    "description": "Qwen3.6原生视觉语言系列Plus模型，展现出与当前顶尖前沿模型相媲美的卓越性能，模型效果相较3.5系列显著提升。模型在Agentic coding、前端编程、Vibe coding等代码能力、多模态万物识别、OCR、物体定位等能力上显著增强。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 512000,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.6-Flash",
    "name": "Qwen3.6-Flash",
    "description": "Qwen3.6原生视觉语言系列Flash模型，模型效果相较3.5-Flash显著提升。本模型重点提升agentic coding能力（在多项代码智能体基准上大幅超越前代）、数学推理和代码推理能力；视觉方面在空间智能能力上显著增强，物体定位与目标检测提升尤为突出。",
    "tags": [
      "文本生成",
      "深度思考",
      "视觉理解"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1024000,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.6-27B",
    "name": "Qwen3.6-27B",
    "description": "Qwen3.6系列27B原生视觉语言Dense模型，模型效果相较3.5-27B重点提升了Agentic coding能力、模型STEM与推理能力进一步增强；文档OCR及视觉Agent能力稳步提升",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 262144,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3.5-122B-A10B",
    "name": "Qwen3.5-122B-A10B",
    "description": "Qwen3.5-122B-A10B 是通义千问推出的原生视觉语言模型，采用创新的混合架构设计，将线性注意力机制与稀疏混合专家技术深度融合，大幅提升了模型的推理效率。在整体性能表现上，该模型仅次于同系列旗舰 Qwen3.5-397B-A17B；",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 102400,
    "maxTokens": 131072
  },
  {
    "id": "MiMo-V2.5-Pro",
    "name": "MiMo-V2.5-Pro",
    "description": "MiMo-V2.5-Pro 是小米发布的最新旗舰模型。与前代模型相比，它在通用智能体能力、复杂软件工程以及长程任务等方面都有显著提升，在 ClawEval、GDPVal 和 SWE-bench Pro 等基准测试中均位列前茅。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "none",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 1024000,
    "maxTokens": 131072
  },
  {
    "id": "Qwen3-235B-A22B",
    "name": "Qwen3-235B-A22B",
    "description": "【弹性扩容】实现思考模式和非思考模式的有效融合，可在对话中切换模式。推理能力显著超过QwQ、通用能力显著超过Qwen2.5-72B-Instruct，达到同规模业界SOTA水平。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "special",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 32768,
    "maxTokens": 131072
  },
  {
    "id": "SCNet-Max",
    "name": "SCNet-Max",
    "description": "SCNet-Max",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "free",
    "toolCalling": true,
    "reasoning": true,
    "thinkingMode": "levels",
    "thinkingLevelMap": {
      "off": "none",
      "minimal": null,
      "low": "low",
      "medium": "medium",
      "high": "high",
      "xhigh": "xhigh",
      "max": "max"
    },
    "defaultThinkingLevel": "medium",
    "input": [
      "text",
      "image"
    ],
    "contextWindow": 1048576,
    "maxTokens": 131072
  },
  {
    "id": "GLM-5.2-Base",
    "name": "GLM-5.2-Base",
    "description": "【仅支持128K以内上下文】专为 128K 以内主流业务场景深度优化，在通用任务效果、推理响应速度、输出效率与调用成本之间达成极佳平衡。可稳定支撑高频智能体交互、批量内容创作、企业办公提效等核心业务。",
    "tags": [
      "文本生成",
      "深度思考"
    ],
    "priceLabel": "special",
    "toolCalling": true,
    "reasoning": false,
    "thinkingMode": "levels",
    "thinkingLevelMap": null,
    "defaultThinkingLevel": null,
    "input": [
      "text"
    ],
    "contextWindow": 131072,
    "maxTokens": 131072
  }
]
