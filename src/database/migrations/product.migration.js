'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      nameProduct: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      regularPrice: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
      },
      salePrice: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
      },
      weight: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      dimensions: {
        allowNull: false,
        type: Sequelize.STRING(40),
      },
      materials: {
        allowNull: false,
        type: Sequelize.STRING(40),
      },
      other: {
        allowNull: false,
        type: Sequelize.STRING(80),
      },
      subDesc: {
        allowNull: false,
        type: Sequelize.STRING(300),
      },
      desc: {
        allowNull: false,
        type: Sequelize.STRING(600),
      },
      totalSold: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
      },
      newProduct: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      saleProduct: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      listSize: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      listColor: {
        allowNull: false,
        type: Sequelize.STRING(30),
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
    await queryInterface.dropTable('Products');
  },
};
