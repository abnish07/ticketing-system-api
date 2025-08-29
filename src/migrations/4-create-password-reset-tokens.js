'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PasswordResetTokens', {
      id: { type: Sequelize.STRING, primaryKey: true },
      userId: { type: Sequelize.STRING, allowNull: false },
      tokenHash: { type: Sequelize.STRING, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addIndex('PasswordResetTokens', ['tokenHash'], {
      unique: true,
      name: 'password_reset_tokens_token_hash_unique'
    });
    await queryInterface.addIndex('PasswordResetTokens', ['userId'], {
      name: 'password_reset_tokens_user_id_idx'
    });
    await queryInterface.addIndex('PasswordResetTokens', ['expiresAt'], {
      name: 'password_reset_tokens_expires_at_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('PasswordResetTokens', 'password_reset_tokens_token_hash_unique');
    await queryInterface.removeIndex('PasswordResetTokens', 'password_reset_tokens_user_id_idx');
    await queryInterface.removeIndex('PasswordResetTokens', 'password_reset_tokens_expires_at_idx');
    await queryInterface.dropTable('PasswordResetTokens');
  }
};
