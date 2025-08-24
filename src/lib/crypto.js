import crypto from 'crypto'

export function hash (str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex')
}
export function randomToken (bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}
export function exp (hours) {
  return new Date(Date.now() + hours * 3600 * 1000)
}

// AES-256-GCM encrypt/decrypt
export function encrypt (plaintext) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'base64')
  if (key.length !== 32) throw new Error('ENCRYPTION_KEY must be 32 bytes base64')
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString('base64')
}
export function decrypt (base64) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'base64')
  if (key.length !== 32) throw new Error('ENCRYPTION_KEY must be 32 bytes base64')
  const raw = Buffer.from(base64, 'base64')
  const iv = raw.subarray(0, 12)
  const tag = raw.subarray(12, 28)
  const enc = raw.subarray(28)
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(enc), decipher.final()])
  return dec.toString('utf8')
}
