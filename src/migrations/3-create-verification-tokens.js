'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VerificationTokens', {
      id: { type: Sequelize.STRING, primaryKey: true },
      userId: { type: Sequelize.STRING, allowNull: false },
      tokenHash: { type: Sequelize.STRING, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
    });
    await queryInterface.addIndex('VerificationTokens', ['tokenHash'], {
      unique: true,
      name: 'verification_tokens_token_hash_unique'
    });
    await queryInterface.addIndex('VerificationTokens', ['userId'], {
      name: 'verification_tokens_user_id_idx'
    });
    await queryInterface.addIndex('VerificationTokens', ['expiresAt'], {
      name: 'verification_tokens_expires_at_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('VerificationTokens', 'verification_tokens_token_hash_unique');
    await queryInterface.removeIndex('VerificationTokens', 'verification_tokens_user_id_idx');
    await queryInterface.removeIndex('VerificationTokens', 'verification_tokens_expires_at_idx');
    await queryInterface.dropTable('VerificationTokens');
  }
};
