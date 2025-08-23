export default function corsConfig () {
  return { origin: [process.env.WEB_ORIGIN], credentials: true }
}
