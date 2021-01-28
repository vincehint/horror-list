'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
const db = require('.');
//db.user = require("/user.model");
//db.faves = require("/faves.model");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.belongsToMany(models.movie, {through: "faves"})
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2,25],
          msg: 'Name muse be 2-25 characters long.'
        }
      }
    },    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address.'
        }
      }
    },   
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8,99],
          msg: 'Password must be between 8 and 99 characters long.'
        }
      }
    }  
  }, {
    sequelize,
    modelName: 'user',
  })

  user.addHook('beforeCreate', (pendingUser, options)=> {
    console.log(`OG password: ${pendingUser.password}`)
    let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
    console.log(`Hashed password: ${hashedPassword}`)
    pendingUser.password = hashedPassword
  })

  user.prototype.validPassword = async function(passwordInput) {
    console.log(`passwordInput: ${passwordInput}`)
    let match = await bcrypt.compare(passwordInput, this.password)
    console.log(`??????? was the password a match??: ${match}`)
    return match
  }

  return user
}