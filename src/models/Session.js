import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/index.js'
export default class Session extends Model {}
Session.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  refreshTokenHash: { type: DataTypes.STRING, allowNull: false },
  userAgent: { type: DataTypes.STRING },
  ip: { type: DataTypes.STRING },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'Session', tableName: 'Sessions', timestamps: false })
