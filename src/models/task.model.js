const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Task extends Model {}

Task.init ({

    idTask: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true  
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    hourStart: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hourFinal: {
        type: DataTypes.TIME,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    timestamps: false,
    sequelize,
    modelName: 'Task'
});

module.exports = Task;
//console.log(Task === sequelize.models.Task);