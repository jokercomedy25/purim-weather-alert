export default async function handler(req, res) {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ error: 'invalid_coordinates' });
  }
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'PurimWeatherAlert/1.1 https://jupurim.com/alert',
        'Accept': 'application/json'
      }
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: 'upstream_error', status: r.status, detail: text.slice(0, 400) });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'weather_fetch_failed', detail: String(err) });
  }
}
