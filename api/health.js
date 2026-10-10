export default function handler(req, res) {
  res.status(200).json({ ok: true, service: 'Purim Weather & Alert', version: '1.1' });
}
