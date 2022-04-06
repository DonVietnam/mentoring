const { DataTypes } = require('sequelize');
const databaseService = require('../../services/database.service');

module.exports = databaseService.define('user', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true,
  },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ADMIN' },
}, {
  createdAt: false,
  updatedAt: false,
});
