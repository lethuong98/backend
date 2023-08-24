'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
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
      fullName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },            
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING(200),
      },
      note: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },      
      coupon: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },
      totalMoney: {
        allowNull: false,
        type: Sequelize.INTEGER(20),
      },
      filterDate: {
        allowNull: false,
        type: Sequelize.STRING(20),
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
    await queryInterface.dropTable('Orders');
  },
};
