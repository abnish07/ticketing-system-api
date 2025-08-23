require('dotenv/config')
const { URL } = require('url')
const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://localhost:5432/app')

const common = {
  dialect: 'postgres',
  url: dbUrl.toString(),
  logging: false
}

module.exports = {
  development: common,
  test: common,
  production: common
}
