# Prompt Gallery

这是一个独立的 React + Vite 图片提示词网站，页面默认使用简体中文。

范围仅包含图片浏览、分类、搜索、详情和提示词复制。不要加入图片生成、账号登录、模板、工作流、历史记录、资产管理或案例库模块，除非用户明确更改范围。

内容位于 `src/data/prompts.json`，图片位于 `public/images/`。保留提示词原文、多图对应关系和原始来源。不要让本项目依赖原 AI Visual Operating System 的目录、数据库、服务或环境变量。

验证：`npm test`、`npm run build`，并在浏览器验证搜索、分类、详情、多图切换和复制提示词。默认端口为 3003。
