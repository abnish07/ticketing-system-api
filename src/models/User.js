import { DataTypes, Model } from 'sequelize'
import sequelize from '../db/index.js'
export default class User extends Model {}
User.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING },
  emailVerified: { type: DataTypes.DATE },
  totpEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  totpSecretEnc: { type: DataTypes.TEXT },
  role: { type: DataTypes.ENUM('ADMIN', 'STAFF'), allowNull: false, defaultValue: 'STAFF' },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { sequelize, modelName: 'User', tableName: 'Users', timestamps: true, updatedAt: 'updatedAt', createdAt: 'createdAt' })
