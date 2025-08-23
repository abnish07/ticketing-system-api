'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.STRING, primaryKey: true },
      email: { type: Sequelize.STRING, allowNull: false },
      passwordHash: { type: Sequelize.STRING },
      emailVerified: { type: Sequelize.DATE },
      totpEnabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      totpSecretEnc: { type: Sequelize.TEXT },
      role: { type: Sequelize.ENUM('ADMIN', 'STAFF'), allowNull: false, defaultValue: 'STAFF' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'users_email_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'users_email_unique');
    await queryInterface.dropTable('Users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_role";');
  }
};
