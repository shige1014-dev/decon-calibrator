// Vercel serverless · proxy Yahoo ticker search · autocomplete
// GET /api/search?q=apple  →  { quotes: [{symbol, name, exch, type}, ...] }

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  const q = String(req.query.q || "").trim();
  if (!q || q.length < 1) return res.status(400).json({ error: "missing q" });
  if (q.length > 32) return res.status(400).json({ error: "q too long" });

  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ZeroJournal/1.0)",
        "Accept": "application/json",
      },
    });
    if (!r.ok) return res.status(r.status).json({ error: `upstream ${r.status}` });
    const j = await r.json();
    const quotes = (j.quotes || []).filter(q => q.symbol).slice(0, 8).map(q => ({
      symbol: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      exch: q.exchDisp || q.exchange || "",
      type: q.quoteType || q.typeDisp || "",
    }));
    return res.status(200).json({ quotes });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
