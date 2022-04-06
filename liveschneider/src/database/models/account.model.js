const { DataTypes } = require('sequelize');
const databaseService = require('../../services/database.service');

const BookingServiceModel = require('./booking-service.model');

const AccountModel = databaseService.define('account', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true,
  },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  createdAt: false,
  updatedAt: false,
});

BookingServiceModel.hasMany(AccountModel, {
  foreignKey: {
    field: 'booking_service_id',
    allowNull: false,
  },
});

AccountModel.belongsTo(BookingServiceModel, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = AccountModel;
