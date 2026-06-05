// Vercel serverless · Yahoo Finance company profile + key stats
// GET /api/profile?ticker=AAPL → { ticker, name, sector, industry, marketCap, currency,
//   pe, forwardPE, w52high, w52low, w52pos, beta, dividendYield, exchange, summary }

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=900, s-maxage=900");

  const t = String(req.query.ticker || "").trim().toUpperCase();
  if (!t) return res.status(400).json({ error: "missing ticker" });
  if (!/^[A-Z0-9.\-_=^]{1,16}$/.test(t)) return res.status(400).json({ error: "invalid ticker" });

  try {
    const modules = "summaryProfile,summaryDetail,price,defaultKeyStatistics,assetProfile";
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=${modules}`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ZeroJournal/1.0)",
        "Accept": "application/json",
      },
    });
    if (!r.ok) return res.status(r.status).json({ error: `upstream ${r.status}` });
    const j = await r.json();
    const result = j?.quoteSummary?.result?.[0];
    if (!result) return res.status(404).json({ error: "not found" });

    const p = result.price || {};
    const sp = result.summaryProfile || result.assetProfile || {};
    const sd = result.summaryDetail || {};
    const ks = result.defaultKeyStatistics || {};

    const num = (v) => (v && typeof v === "object" && "raw" in v ? v.raw : (typeof v === "number" ? v : null));

    const w52h = num(sd.fiftyTwoWeekHigh);
    const w52l = num(sd.fiftyTwoWeekLow);
    const price = num(p.regularMarketPrice);
    const w52pos = (w52h != null && w52l != null && w52h > w52l && price != null)
      ? +(((price - w52l) / (w52h - w52l)) * 100).toFixed(1)
      : null;

    return res.status(200).json({
      ticker: p.symbol || t,
      name: p.longName || p.shortName || t,
      sector: sp.sector || null,
      industry: sp.industry || null,
      country: sp.country || null,
      website: sp.website || null,
      employees: num(sp.fullTimeEmployees),
      marketCap: num(p.marketCap) ?? num(sd.marketCap),
      currency: p.currency || sd.currency || null,
      exchange: p.exchangeName || null,
      price: price,
      pe: num(sd.trailingPE),
      forwardPE: num(sd.forwardPE),
      pb: num(ks.priceToBook),
      eps: num(ks.trailingEps),
      beta: num(sd.beta) ?? num(ks.beta),
      dividendYield: num(sd.dividendYield),
      w52high: w52h,
      w52low: w52l,
      w52pos: w52pos,
      avgVolume: num(sd.averageVolume),
      summary: sp.longBusinessSummary || null,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
