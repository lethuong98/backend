'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FeedBacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      userId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      fullName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },

      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      subjectName: {
        allowNull: false,
        type: Sequelize.STRING(350),
      },
      note: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FeedBacks');
  },
};
