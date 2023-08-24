'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      colorId: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      sizeId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
      },
      sold: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
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
    await queryInterface.dropTable('ProductDetails');
  },
};
