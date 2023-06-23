const { Sequelize } = require('sequelize');
var debug = require('debug')('api-workwacht:db');

const sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  port: process.env.PORT,
  logging: false // no imprime las peticiones a la base
});

async function testConnection(){
  try {
    await sequelize.authenticate();
    debug("Connected database");
  } catch (err) {
    debug("Error database: " + err);
  }
};

testConnection();

module.exports = sequelize;