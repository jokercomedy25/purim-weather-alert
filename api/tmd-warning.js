export default async function handler(req, res) {
  const url = 'https://tmd.go.th/api/xml/warning-news';
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'PurimWeatherAlert/1.1 https://jupurim.com/alert' } });
    if (!r.ok) return res.status(r.status).send('');
    const xml = await r.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(502).send('');
  }
}
