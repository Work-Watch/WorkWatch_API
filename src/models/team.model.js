const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Task = require('./task.model');

class Team extends Model {}

Team.init({
  // Model attributes are defined here
  idTeam: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
    timestamps: false,
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Team' // We need to choose the model name
});

Team.hasMany(Task, {
  foreignKey: 'idTeam',
  sourceKey: 'idTeam'
});

Task.belongsTo(Team, {
  foreignKey: 'idTeam',
  targetKey: 'idTeam'
});

module.exports = Team;
// the defined model is the class itself
//console.log(Team === sequelize.models.Team); // true