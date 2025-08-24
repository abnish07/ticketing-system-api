import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import crypto from 'crypto'
import { User, Session, VerificationToken, PasswordResetToken } from '../models/associations.js'
import {
  signupSchema,
  loginSchema,
  twoFaVerifySchema,
  twoFaEnableSchema,
  emailTokenSchema,
  forgotSchema,
  resetSchema
} from '../validators/authSchemas.js'
import {
  signupLimiter,
  loginLimiter,
  forgotLimiter,
  verifyEmailLimiter,
  resetLimiter
} from '../middleware/rateLimits.js'
import { hash, randomToken, exp, encrypt, decrypt } from '../lib/crypto.js'
import {
  makeTokens,
  persistRefresh,
  setAuthCookies,
  clearAuthCookies,
  revokeRefreshFromCookie,
  refreshRotation
} from '../lib/tokens.js'
import { ok, created } from '../lib/responses.js'
import auth from '../middleware/auth.js'
import { sendVerifyEmail, sendPasswordResetEmail } from '../lib/mailer.js'

const router = express.Router()

const userPayload = u => ({
  id: u.id,
  email: u.email,
  role: u.role,
  emailVerified: u.emailVerified,
  totpEnabled: u.totpEnabled
})

router.post('/signup', signupLimiter, async (req, res, next) => {
  try {
    const { email, password } = signupSchema.parse(req.body)
    const existed = await User.findOne({ where: { email } })
    if (existed) return ok(res, { message: 'check_email' })
    const userId = crypto.randomUUID()
    const passwordHash = await bcrypt.hash(password, 12)
    await User.create({ id: userId, email, passwordHash })
    const token = randomToken()
    await VerificationToken.create({
      id: crypto.randomUUID(),
      userId,
      tokenHash: hash(token),
      expiresAt: exp(24),
      createdAt: new Date()
    })
    await sendVerifyEmail(email, token)
    return created(res, { message: 'check_email' })
  } catch (err) { next(err) }
})

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.passwordHash || '')
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })
    if (user.totpEnabled) {
      const tempToken = jwt.sign({ uid: user.id, step: '2fa' }, process.env.JWT_SECRET, { expiresIn: '5m' })
      return ok(res, { next: '2fa_required', tempToken })
    }
    const { accessToken, refreshToken } = makeTokens(user.id)
    await persistRefresh(user.id, refreshToken, req)
    setAuthCookies(res, refreshToken)
    return ok(res, { accessToken, user: userPayload(user) })
  } catch (err) { next(err) }
})

router.post('/2fa/verify', async (req, res, next) => {
  try {
    const { code, tempToken } = twoFaVerifySchema.parse(req.body)
    const payload = jwt.verify(tempToken, process.env.JWT_SECRET)
    if (payload.step !== '2fa') throw Object.assign(new Error('Invalid token'), { status: 401 })
    const user = await User.findByPk(payload.uid)
    if (!user || !user.totpSecretEnc) throw Object.assign(new Error('Invalid token'), { status: 401 })
    const secret = decrypt(user.totpSecretEnc)
    const valid = speakeasy.totp.verify({ secret, encoding: 'ascii', token: code, window: 1 })
    if (!valid) return res.status(401).json({ error: 'Invalid code' })
    const { accessToken, refreshToken } = makeTokens(user.id)
    await persistRefresh(user.id, refreshToken, req)
    setAuthCookies(res, refreshToken)
    return ok(res, { accessToken, user: userPayload(user) })
  } catch (err) { next(err) }
})

router.post('/2fa/setup', auth, async (req, res, next) => {
  try {
    const secret = speakeasy.generateSecret()
    const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url)
    return ok(res, { otpauth: secret.otpauth_url, qrDataUrl, secret: secret.ascii })
  } catch (err) { next(err) }
})

router.post('/2fa/enable', auth, async (req, res, next) => {
  try {
    const { code, secret } = twoFaEnableSchema.parse(req.body)
    const valid = speakeasy.totp.verify({ secret, encoding: 'ascii', token: code, window: 1 })
    if (!valid) return res.status(400).json({ error: 'Invalid code' })
    const user = await User.findByPk(req.user.id)
    user.totpSecretEnc = encrypt(secret)
    user.totpEnabled = true
    await user.save()
    return ok(res, { ok: true })
  } catch (err) { next(err) }
})

router.post('/2fa/disable', auth, async (req, res, next) => {
  try {
    const { code } = twoFaVerifySchema.pick({ code: true }).parse(req.body)
    const user = await User.findByPk(req.user.id)
    if (!user || !user.totpSecretEnc) return res.status(400).json({ error: '2fa not enabled' })
    const secret = decrypt(user.totpSecretEnc)
    const valid = speakeasy.totp.verify({ secret, encoding: 'ascii', token: code, window: 1 })
    if (!valid) return res.status(400).json({ error: 'Invalid code' })
    user.totpEnabled = false
    user.totpSecretEnc = null
    await user.save()
    return ok(res, { ok: true })
  } catch (err) { next(err) }
})

router.post('/verify-email', verifyEmailLimiter, async (req, res, next) => {
  try {
    const { token } = emailTokenSchema.parse(req.body)
    const tokenHash = hash(token)
    const v = await VerificationToken.findOne({ where: { tokenHash } })
    if (!v || v.expiresAt < new Date()) throw Object.assign(new Error('Invalid or expired token'), { status: 400 })
    const user = await User.findByPk(v.userId)
    user.emailVerified = new Date()
    await user.save()
    await v.destroy()
    return ok(res, { ok: true })
  } catch (err) { next(err) }
})

router.post('/password/forgot', forgotLimiter, async (req, res, next) => {
  try {
    const { email } = forgotSchema.parse(req.body)
    const user = await User.findOne({ where: { email } })
    if (user) {
      const token = randomToken()
      await PasswordResetToken.create({
        id: crypto.randomUUID(),
        userId: user.id,
        tokenHash: hash(token),
        expiresAt: exp(1),
        createdAt: new Date()
      })
      await sendPasswordResetEmail(email, token)
    }
    return ok(res, { message: 'check_email' })
  } catch (err) { next(err) }
})

router.post('/password/reset', resetLimiter, async (req, res, next) => {
  try {
    const { token, newPassword } = resetSchema.parse(req.body)
    const tHash = hash(token)
    const record = await PasswordResetToken.findOne({ where: { tokenHash: tHash } })
    if (!record || record.expiresAt < new Date()) throw Object.assign(new Error('Invalid or expired token'), { status: 400 })
    const user = await User.findByPk(record.userId)
    user.passwordHash = await bcrypt.hash(newPassword, 12)
    await user.save()
    await PasswordResetToken.destroy({ where: { userId: user.id } })
    await Session.destroy({ where: { userId: user.id } })
    return ok(res, { ok: true })
  } catch (err) { next(err) }
})

router.post('/refresh', async (req, res, next) => {
  try {
    const cookieName = process.env.REFRESH_COOKIE_NAME || 'basils_r'
    const oldToken = req.cookies?.[cookieName]
    if (!oldToken) throw Object.assign(new Error('Unauthorized'), { status: 401 })
    const { accessToken, refreshToken } = await refreshRotation(oldToken, req)
    setAuthCookies(res, refreshToken)
    return ok(res, { accessToken })
  } catch (err) { next(err) }
})

router.post('/logout', auth, async (req, res, next) => {
  try {
    await revokeRefreshFromCookie(req)
    clearAuthCookies(res)
    return ok(res, { ok: true })
  } catch (err) { next(err) }
})

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return ok(res, userPayload(user))
  } catch (err) { next(err) }
})

export default router
