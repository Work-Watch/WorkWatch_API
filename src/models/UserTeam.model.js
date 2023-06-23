const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');


class UserTeam extends Model{}

UserTeam.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    
},{
    timestamps: false,
    sequelize,
    modelName: 'UserTeam'
});


module.exports = UserTeam;
//console.log(UserTeam === sequelize.models.UserTeam); 