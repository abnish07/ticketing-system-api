import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import corsConfig from './config/cors.js'
import errorHandler from './middleware/error.js'
import authRouter from './routes/auth.js'
import { connectDb } from './db/index.js'
import './models/associations.js'
import logger from './lib/logger.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors(corsConfig()))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 4000
connectDb().then(() => {
  app.listen(PORT, () => logger.info(`API listening on :${PORT}`))
})
