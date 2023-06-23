const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Team = require('./team.model');
const UserTeam = require('./UserTeam.model');
const bcrypt = require('bcryptjs');

class User extends Model {}

User.init({
  // Model attributes are defined here
  idUser: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  recovery: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

User.belongsToMany(Team, { through: UserTeam, foreignKey: 'idUser'});
Team.belongsToMany(User, { through: UserTeam, foreignKey: 'idTeam'});


// Hook beforeSave -> realizar acciones antes de guardar o actualizar un usuario en la base de datos
User.beforeSave(async (user, options) => {

  // Guardar en mayuscula el name, lastname y el company
  
  if (user.name) {
    user.name = user.name.toUpperCase();
  }
  if (user.lastName) {
    user.lastName = user.lastName.toUpperCase();
  }
  if (user.company) {
    user.company = user.company.toUpperCase();
  }

  // Verificar si la contraseña no está vacía antes de encriptarla
  if (user.password) {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT));
    user.password = hashedPassword;
  }
  
});


module.exports = User
// the defined model is the class itself
//console.log(User === sequelize.models.User); // true
