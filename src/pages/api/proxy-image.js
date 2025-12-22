export default async function handler(req, res) {
  try {
    const { url } = req.query
    if (!url || typeof url !== 'string') {
      res.status(400).json({ status: 'error', message: 'Missing url' })
      return
    }

    // Basic allowlist (adjust as needed)
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        res.status(400).json({ status: 'error', message: 'Invalid protocol' })
        return
      }
    } catch {
      res.status(400).json({ status: 'error', message: 'Invalid url' })
      return
    }

    const upstream = await fetch(url, { cache: 'no-store' })
    if (!upstream.ok) {
      res.status(upstream.status).json({ status: 'error', message: 'Upstream fetch failed' })
      return
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const buffer = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(buffer)
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'Proxy failed' })
  }
}


