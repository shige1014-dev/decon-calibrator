# 股票日记 · STOCK JOURNAL

ZERO2076 ecosystem · standalone SPA · Vol.IV warm-navy palette.

## Pivot 2026-06-05

原版"投资初衷校准器"(单页 10 题委员会审查) → **股票日记本**架构:

> 情绪化会改写认知 · 用最快的方式 (5 题选择 + 一句话) 把当下心境封存。
> 下次再看时 · 你才知道当时的自己是清醒还是被牵着走。

## 核心流程 (≤ 30 秒)

1. **选股** — 输入 ticker/名字 → autocomplete (Yahoo via `/api/search`) → 自动拉实时价 (Yahoo via `/api/quote`)
2. **一句话** — ≤140 字理由 + 日期
3. **5 题快选** — 假设/时间/止损/价格/情绪 · A 清醒 → D 高风险 · 点一下立刻跳下一题
4. **状态徽章** — 0-15 分 → 4 类 (清醒 CLEAR / 漂移 DRIFT / 干扰 NOISE / 接管 CHAOS) → 保存到日记本

## 架构

- 单文件 `index.html` · hash 路由 SPA (4 view: home / new / book / search)
- 2 个 Vercel serverless: `/api/quote` + `/api/search` 代理 Yahoo Finance (避 CORS)
- 全 localStorage · 无后端持久层 · 无追踪
- 数据格式: `{ books: { TICKER: { ticker, name, exchange, currency, entries: [...] } } }`

## v2 roadmap (后期)

- (a) 股票提醒 · Notification API + 价格阈值
- (b) 股票分类 · tag
- (c) 同类对比 · 接 decon-2030 板块数据

## v3

- iOS 上架 · 真留存数据足再说

## Same-market competitors

英文已饱和: Thesis / ThesisWatch Pro / Featurepower (论点追踪) · UltraTrader / TraderSync / Tradervue / Edgewonk / Chartlog / TradeZella / TradesViz / Stonk Journal (日内日记)

中文几乎真空: 集思录 (社区+模拟仓·非日记) · 通达信内置 (桌面非 app) · 知乎/集思录论坛有个人开发 Windows 版"投资日记"

差异化: **中文 + 长线 thesis 心境流 + 一次买断/免费 localStorage + iOS 原生 (规划中)**

## Deploy

```
vercel deploy --prod
```

## Repo

- GitHub: `shige1014-dev/decon-calibrator`
- Vercel project: `decon-calibrator`
- 域: `decon-calibrator.vercel.app`
