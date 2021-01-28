'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.movie.belongsToMany(models.user, {through: "faves"})
    }
  };
  movie.init({
    apiId: DataTypes.INTEGER, 
      
    title: DataTypes.STRING,
    poster_path: DataTypes.STRING,
    overview: DataTypes.STRING,
    original_title: DataTypes.TEXT,
    release_date: DataTypes.STRING,
    original_language: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'movie',
  });
  return movie;
};