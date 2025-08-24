import jwt from 'jsonwebtoken'
export default function auth (req, res, next) {
  try {
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub, role: payload.role || 'STAFF' }
    next()
  } catch { return res.status(401).json({ error: 'Unauthorized' }) }
}
