'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Messages',
      'autoResponse',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "Whether a message was generated automatically or not."
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Messages', 'autoResponse')
  }
};
