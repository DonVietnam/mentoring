const { DataTypes } = require('sequelize');
const databaseService = require('../../services/database.service');

const AccountModel = require('./account.model');

const JobReportModel = databaseService.define('job_report', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true,
  },
  day: {
    type: DataTypes.DATEONLY, allowNull: false,
  },
  available_tickets: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  booked_tickets: {
    type: DataTypes.INTEGER, allowNull: false,
  },
}, {
  createdAt: true,
  updatedAt: false,
});

AccountModel.hasMany(JobReportModel, {
  foreignKey: {
    field: 'account_id',
    allowNull: false,
  },
});

JobReportModel.belongsTo(AccountModel, {
  foreignKey: {
    allowNull: false,
  },
});

module.exports = JobReportModel;
