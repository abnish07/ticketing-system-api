import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  acceptTerms: z.boolean()
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export const twoFaVerifySchema = z.object({
  code: z.string().length(6),
  tempToken: z.string()
})

export const twoFaEnableSchema = z.object({
  code: z.string().length(6),
  secret: z.string()
})

export const emailTokenSchema = z.object({
  token: z.string().min(1)
})

export const forgotSchema = z.object({
  email: z.string().email()
})

export const resetSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8)
})
