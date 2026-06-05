// Vercel serverless · proxy Yahoo Finance quote (browser CORS workaround)
// GET /api/quote?ticker=AAPL  →  { ticker, name, price, currency, sector, exchange, change, changePct }

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=60");

  const t = String(req.query.ticker || "").trim().toUpperCase();
  if (!t) return res.status(400).json({ error: "missing ticker" });
  if (!/^[A-Z0-9.\-_=^]{1,16}$/.test(t)) return res.status(400).json({ error: "invalid ticker" });

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(t)}?interval=1d&range=5d`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ZeroJournal/1.0)",
        "Accept": "application/json",
      },
    });
    if (!r.ok) return res.status(r.status).json({ error: `upstream ${r.status}` });
    const j = await r.json();
    const result = j?.chart?.result?.[0];
    if (!result) return res.status(404).json({ error: "not found" });
    const meta = result.meta || {};
    const close = meta.regularMarketPrice ?? null;
    const prev = meta.chartPreviousClose ?? meta.previousClose ?? null;
    return res.status(200).json({
      ticker: meta.symbol || t,
      name: meta.longName || meta.shortName || meta.symbol || t,
      price: close,
      currency: meta.currency || null,
      exchange: meta.exchangeName || meta.fullExchangeName || null,
      change: close != null && prev != null ? +(close - prev).toFixed(4) : null,
      changePct: close != null && prev != null ? +(((close - prev) / prev) * 100).toFixed(2) : null,
      ts: meta.regularMarketTime || null,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
