import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { cookieOpts } from '../config/security.js'
import { REFRESH_TTL_DAYS } from '../config/constants.js'
import { Session } from '../models/associations.js'
import { hash } from './crypto.js'

export function makeTokens (userId) {
  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ sub: userId }, process.env.REFRESH_SECRET, { expiresIn: `${REFRESH_TTL_DAYS}d` })
  return { accessToken, refreshToken }
}

export function setAuthCookies (res, refreshToken) {
  res.cookie(process.env.REFRESH_COOKIE_NAME || 'basils_r', refreshToken, cookieOpts())
}
export function clearAuthCookies (res) {
  res.clearCookie(process.env.REFRESH_COOKIE_NAME || 'basils_r', cookieOpts())
}

export async function persistRefresh (userId, refreshToken, req) {
  const h = hash(refreshToken)
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 3600 * 1000)
  await Session.create({
    id: crypto.randomUUID(),
    userId,
    refreshTokenHash: h,
    userAgent: req.headers['user-agent'] || null,
    ip: req.ip || null,
    expiresAt,
    createdAt: new Date()
  })
}

export async function revokeRefreshFromCookie (req) {
  const cookieName = process.env.REFRESH_COOKIE_NAME || 'basils_r'
  const token = req.cookies?.[cookieName]
  if (!token) return
  await Session.destroy({ where: { refreshTokenHash: hash(token) } })
}

export async function refreshRotation (oldToken, req) {
  const payload = jwt.verify(oldToken, process.env.REFRESH_SECRET)
  const userId = payload.sub
  const existed = await Session.findOne({ where: { refreshTokenHash: hash(oldToken) } })
  if (!existed) {
    throw Object.assign(new Error('Invalid session'), { status: 401 })
  }
  const { accessToken, refreshToken } = makeTokens(userId)
  existed.refreshTokenHash = hash(refreshToken)
  existed.expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 3600 * 1000)
  await existed.save()
  return { accessToken, refreshToken }
}
