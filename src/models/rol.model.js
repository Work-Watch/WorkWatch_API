const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model')

class Rol extends Model {}

Rol.init({
  // Model attributes are defined here
  idRol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Rol' // We need to choose the model name
});

// Define a hook to create roles after the model is synchronized with the database
Rol.afterSync((options) => {
  // Create the roles
  Rol.bulkCreate([
    { rol: 'administrador' },
    { rol: 'empleado' },
  ]);
});

Rol.hasOne(User, {
  foreignKey: 'idRol',
  sourceKey: 'idRol'
});

User.belongsTo(Rol, {
  foreignKey: 'idRol',
  targetKey: 'idRol'
});

module.exports = Rol;
// the defined model is the class itself
//console.log(Rol === sequelize.models.Rol); // true