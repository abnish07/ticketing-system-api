export function cookieOpts () {
  return { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV !== 'development', path: '/' }
}
