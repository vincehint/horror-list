'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      apiId: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      poster_path: {
        type: Sequelize.STRING
      },
      overview: {
        type: Sequelize.TEXT
      },
      original_title: {
        type: Sequelize.STRING
      },
      release_date: {
        type: Sequelize.STRING
      },
      original_language: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('movies');
  }
};