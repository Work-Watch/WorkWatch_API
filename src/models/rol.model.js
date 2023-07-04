const { Sequelize, DataTypes, Model, where } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

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
  sequelize, // We need to pass the connection instance
  modelName: 'Rol' // We need to choose the model name
});

Rol.hasOne(User, {
  foreignKey: 'idRol',
  sourceKey: 'idRol'
});

User.belongsTo(Rol, {
  foreignKey: 'idRol',
  targetKey: 'idRol'
});

const createRol = async() => {
  
  const administrador = await Rol.findOne({ where: { rol: 'administrador'} });
  const empleado = await Rol.findOne({ where: { rol: 'empleado'} })
  
  if (!administrador)
    await Rol.create({rol: "administrador"});

  if(!empleado)
    await Rol.create({rol: "empleado"});

}

createRol();

module.exports = Rol;
// the defined model is the class itself
//console.log(Rol === sequelize.models.Rol); // true