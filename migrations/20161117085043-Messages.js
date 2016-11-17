'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'Messages',
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        mId: {
          type: Sequelize.STRING,
          comment: "A unique message ID.",
          allowNull: false
        },
        senderId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          validate: {
            isNumeric: true
          }
        },
        recipientId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          validate: {
            isNumeric: true
          }
        },
        timestamp: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: Date.now(),
          validate: {
            isNumeric: true
          }
        },
        seq: {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: "This is a conversation sequence number."
        },
        data: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          },
          comment: "This is a text message or a URL of an attachment."
        }
      },
      {
        schema: 'public'                      // default: public, PostgreSQL only.
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('Messages')
  }
}