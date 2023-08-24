'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      banners: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(10000),
        allowNull: false,
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
    await queryInterface.dropTable('Blogs');
  },
};
