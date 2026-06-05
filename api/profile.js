// Vercel serverless · Yahoo Finance company profile + key stats
// Yahoo quoteSummary endpoint requires cookie + crumb since 2024.
// Flow: GET fc.yahoo.com → grab Set-Cookie · GET /v1/test/getcrumb with cookie → use both on quoteSummary.

let CACHE = { cookie: null, crumb: null, ts: 0 };
const SESSION_TTL = 60 * 60 * 1000; // 1h

async function getSession() {
  const now = Date.now();
  if (CACHE.crumb && (now - CACHE.ts) < SESSION_TTL) return CACHE;
  const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
  const init = await fetch("https://fc.yahoo.com", { headers: { "User-Agent": ua }, redirect: "manual" });
  let setCookies = [];
  if (typeof init.headers.getSetCookie === "function") setCookies = init.headers.getSetCookie();
  else { const raw = init.headers.get("set-cookie"); if (raw) setCookies = [raw]; }
  const cookie = setCookies.map(c => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error("no cookie from fc.yahoo.com");
  const crumbResp = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
    headers: { "User-Agent": ua, "Cookie": cookie, "Accept": "*/*" },
  });
  if (!crumbResp.ok) throw new Error(`getcrumb ${crumbResp.status}`);
  const crumb = (await crumbResp.text()).trim();
  if (!crumb || crumb.length < 4) throw new Error("empty crumb");
  CACHE = { cookie, crumb, ts: now };
  return CACHE;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=900, s-maxage=900");

  const t = String(req.query.ticker || "").trim().toUpperCase();
  if (!t) return res.status(400).json({ error: "missing ticker" });
  if (!/^[A-Z0-9.\-_=^]{1,16}$/.test(t)) return res.status(400).json({ error: "invalid ticker" });

  try {
    const { cookie, crumb } = await getSession();
    const modules = "summaryProfile,summaryDetail,price,defaultKeyStatistics,assetProfile";
    const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=${modules}&crumb=${encodeURIComponent(crumb)}`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Accept": "application/json",
        "Cookie": cookie,
      },
    });
    if (r.status === 401) {
      // session went stale · drop cache + one retry
      CACHE = { cookie: null, crumb: null, ts: 0 };
      const s2 = await getSession();
      const url2 = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(t)}?modules=${modules}&crumb=${encodeURIComponent(s2.crumb)}`;
      const r2 = await fetch(url2, { headers: { "User-Agent": "Mozilla/5.0", "Cookie": s2.cookie, "Accept": "application/json" } });
      if (!r2.ok) return res.status(r2.status).json({ error: `upstream ${r2.status}` });
      return res.status(200).json(extract(await r2.json(), t));
    }
    if (!r.ok) return res.status(r.status).json({ error: `upstream ${r.status}` });
    return res.status(200).json(extract(await r.json(), t));
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}

function extract(j, t) {
  const result = j?.quoteSummary?.result?.[0];
  if (!result) return { error: "not found", ticker: t };
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
  return {
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
  };
}
