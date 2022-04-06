const AdminJsService = require('adminjs');
const AdminJSSequelize = require('@adminjs/sequelize');
const databaseService = require('./database.service');
const workerService = require('./worker.service');
const userAction = require('../adminjs/actions/user.action');
const jobAction = require('../adminjs/actions/job.action');
const AccountModel = require('../database/models/account.model');
const BookingServiceModel = require('../database/models/booking-service.model');
const UserModel = require('../database/models/user.model');
const JobModel = require('../database/models/job.model');
const JobReportModel = require('../database/models/job-report.model');
const LogModel = require('../database/models/log.model');

AdminJsService.registerAdapter(AdminJSSequelize);

module.exports = new AdminJsService({
  databases: [databaseService],
  rootPath: '/admin',
  resources: [{
    resource: UserModel,
    options: {
      properties: {
        id: { position: -2 },
        password: { isVisible: false },
        password_origin: {
          type: 'string',
          isRequired: true,
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: userAction.beforeNewUser,
        },
        edit: {
          before: userAction.beforeEditUser,
        },
      },
    },
  },
  {
    resource: JobModel,
    options: {
      properties: {
        bookingServiceId: { position: 1 },
        start_date: { position: 2 },
        end_date: { position: 3 },
        start_time: { position: 4 },
        end_time: { position: 5 },
        tickets_per_day: { position: 6 },
        status: {
          position: 7,
          isRequired: false,
          availableValues: [
            { label: 'start', value: 'start' },
            { label: 'in progress', value: 'in progress' },
            { label: 'failed', value: 'failed' },
            { label: 'done', value: 'done' },
          ],
        },
      },
      actions: {
        edit: {
          after: jobAction.afterEditJob,
        },
      },
    },
  },
  {
    resource: JobReportModel,
    options: {
      properties: {
        jobId: { position: 1 },
        accountId: { position: 2 },
        day: { position: 3 },
        available_tickets: { position: 4 },
        booked_tickets: { position: 5 },
      },
    },
  },
  {
    resource: BookingServiceModel,
    options: {
      properties: {
        name: {
          position: 1,
          availableValues: Array.from(workerService.worker_template.keys())
            .map((x) => ({ label: x, value: x })),
        },
      },
    },
  },
  {
    resource: AccountModel,
    options: {
      properties: {
        bookingServiceId: { position: 1 },
        email: { position: 1 },
        password: { position: 2 },
      },
    },
  },
  {
    resource: LogModel,
    options: {
      properties: {
        id: { isVisible: false },
        message: { position: 1 },
        type: {
          position: 2,
          availableValues: [
            { label: 'info', value: 'info' },
            { label: 'error', value: 'error' },
          ],
        },
      },
    },
  }],
  branding: {
    companyName: 'USA Guided Tours',
  },
});
