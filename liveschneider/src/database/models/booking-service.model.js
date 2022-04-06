const { DataTypes } = require('sequelize');
const databaseService = require('../../services/database.service');

const BookingServiceModel = databaseService.define('booking_service', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING, unique: true, allowNull: false,
  },
  max_available_tickets_per_account: {
    type: DataTypes.INTEGER, allowNull: false,
  },
}, {
  createdAt: false,
  updatedAt: false,
});

module.exports = BookingServiceModel;
