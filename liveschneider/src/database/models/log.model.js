const { DataTypes } = require('sequelize');
const databaseService = require('../../services/database.service');

const LogModel = databaseService.define('log', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true,
  },
  message: {
    type: DataTypes.STRING, allowNull: false,
  },
  type: {
    type: DataTypes.STRING, allowNull: false,
  },
}, {
  createdAt: true,
  updatedAt: false,
});

module.exports = LogModel;
