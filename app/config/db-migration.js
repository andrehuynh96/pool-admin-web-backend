require('dotenv').config();
module.exports = {
  username: process.env.STAKING_DB_USER,
  password: process.env.STAKING_DB_PASS,
  database: process.env.STAKING_DB_NAME,
  host: process.env.STAKING_DB_HOST,
  port: process.env.STAKING_DB_PORT,
  dialect: "postgres",
  operatorsAliases: 0,
  define: {
    underscored: true,
    underscoredAll: true
  }
} 