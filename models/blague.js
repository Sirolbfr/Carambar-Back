const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')

const Blague = sequelize.define('blague', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: Sequelize.STRING,
    allowNull: false
  },
  reponse: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Blague