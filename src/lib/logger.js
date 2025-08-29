import winston from 'winston'

const isDev = process.env.NODE_ENV === 'development'

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
)

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: isDev ? consoleFormat : jsonFormat,
  transports: [
    new winston.transports.Console({
      format: isDev ? consoleFormat : jsonFormat
    })
  ],
  exitOnError: false
})

export default logger
