'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      orderId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      nameProduct: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      sizeId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      colorId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      totalMoney: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
      },      
      thumbnail: {
        allowNull: false,
        type: Sequelize.STRING(150),
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
    await queryInterface.dropTable('OrderDetails');
  },
};
