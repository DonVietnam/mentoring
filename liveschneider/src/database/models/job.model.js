const { DataTypes } = require('sequelize');
const databaseService = require('../../services/database.service');

const BookingServiceModel = require('./booking-service.model');
const JobReportModel = require('./job-report.model');

const JobModel = databaseService.define('job', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true,
  },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  start_time: { type: DataTypes.STRING, allowNull: false },
  end_time: { type: DataTypes.STRING, allowNull: false },
  tickets_per_day: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'done' },
}, {
  createdAt: false,
  updatedAt: false,
});

JobModel.hasMany(JobReportModel, {
  foreignKey: {
    field: 'job_id',
    allowNull: false,
  },
});

JobReportModel.belongsTo(JobModel, {
  foreignKey: {
    allowNull: false,
  },
});

BookingServiceModel.hasMany(JobModel, {
  foreignKey: {
    field: 'booking_service_id',
    allowNull: false,
  },
});

JobModel.belongsTo(BookingServiceModel, {
  foreignKey: {
    field: 'job_id',
    allowNull: false,
  },
});

module.exports = JobModel;
