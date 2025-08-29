import User from './User.js'
import Session from './Session.js'
import VerificationToken from './VerificationToken.js'
import PasswordResetToken from './PasswordResetToken.js'

User.hasMany(Session, { foreignKey: 'userId' })
Session.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(VerificationToken, { foreignKey: 'userId' })
VerificationToken.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(PasswordResetToken, { foreignKey: 'userId' })
PasswordResetToken.belongsTo(User, { foreignKey: 'userId' })

export { User, Session, VerificationToken, PasswordResetToken }
