import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/index.js'
export default class VerificationToken extends Model {}
VerificationToken.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  tokenHash: { type: DataTypes.STRING, unique: true, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'VerificationToken', tableName: 'VerificationTokens', timestamps: false })
