export default async function handler(req, res) {
  const q = String(req.query.q || '').trim();
  if (q.length < 2 || q.length > 120) return res.status(400).json({ error: 'invalid_query' });
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '5');
  url.searchParams.set('countrycodes', 'th');
  url.searchParams.set('addressdetails', '1');
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'PurimWeatherAlert/1.1 https://jupurim.com/alert',
        'Accept-Language': 'th,en;q=0.8'
      }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'geocode_upstream_error' });
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'geocode_fetch_failed', detail: String(err) });
  }
}
