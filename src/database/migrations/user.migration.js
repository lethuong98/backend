'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      fullName: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      hobby: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(32),
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING(200),
      },
      role: {
        allowNull: false,
        type: Sequelize.INTEGER(10),
      },      
      avatar: {        
        type: Sequelize.STRING(300),
      },
      filterDate: {        
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
    await queryInterface.dropTable('Users');
  },
};
