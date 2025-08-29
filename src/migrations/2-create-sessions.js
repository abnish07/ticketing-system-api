'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: { type: Sequelize.STRING, primaryKey: true },
      userId: { type: Sequelize.STRING, allowNull: false },
      refreshTokenHash: { type: Sequelize.STRING, allowNull: false },
      userAgent: { type: Sequelize.STRING },
      ip: { type: Sequelize.STRING },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addIndex('Sessions', ['userId'], { name: 'sessions_userId_idx' });
    await queryInterface.addIndex('Sessions', ['expiresAt'], { name: 'sessions_expiresAt_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Sessions', 'sessions_userId_idx');
    await queryInterface.removeIndex('Sessions', 'sessions_expiresAt_idx');
    await queryInterface.dropTable('Sessions');
  }
};
