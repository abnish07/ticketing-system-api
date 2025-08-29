export default function errorHandler (err, req, res, next) {
  if (err?.name === 'ZodError') return res.status(400).json({ error: 'Invalid input', issues: err.issues })
  const status = err.status || 500
  return res.status(status).json({ error: status === 500 ? 'Something went wrong' : err.message })
}
