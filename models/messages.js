"use strict";

module.exports = function(sequelize, DataTypes) {
  var Messages = sequelize.define("Messages", {
    mId: {
      type: DataTypes.STRING,
      comment: "A unique message ID.",
      allowNull: false
    },
    senderId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    recipientId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: Date.now(),
      validate: {
        isNumeric: true
      }
    },
    seq: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "This is a conversation sequence number."
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      comment: "This is a text message or a URL of an attachment."
    }
  }, {
    timestamps: false,
    tableName: 'messages'
  })

  return Messages
}