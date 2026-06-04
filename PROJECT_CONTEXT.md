# decon-calibrator · 投资初衷校准器

ZERO2076 ecosystem · standalone single-page tool · Vol.IV warm-navy palette.

## What

像成熟投资人审查一份投资备忘录 — 只评价初衷 / 证据 / 假设 / 时间尺度 / 情绪干扰 · 不输出操作指令。

10 道委员会审查题 · 6 段原始假设备忘录 · 6 类状态评价 · 8 类风险标签 · 9 类下一步建议。
全部数据 localStorage 本地存 · 无后端 · 无追踪。

## How

- 单文件 `index.html` · 全部 CSS + JS 内联 · 不依赖外部资源
- Vol.IV palette (#0E1218 / #C9A84C) · no-boxed-ui 金线分隔
- localStorage key `calibrator_records` (历史) + `calibrator_theme` (深浅)
- Vercel static host · `cleanUrls: true`

## Origins

从 `~/zero2076/investment-calibrator/` (原 standalone) 重新设计 — 先嵌入 decon-2030 验证视觉 · 再剥离独立。decon-2030 内部副本已删除并切外链。

## Deploy

```
vercel deploy --prod
```

## Pages

- `/` 单页全套表单 + 结果 + 历史 + 详情 modal
