const BookingServiceModel = require('../database/models/booking-service.model');
const AccountModel = require('../database/models/account.model');
const jobReportsService = require('./job-report.service');

class AccountsService {
  async getAvailableAccounts(serviceId) {
    const availableAccounts = [];
    const accounts = await AccountModel.findAll({
      where: { booking_service_id: serviceId },
      raw: true,
    });

    const maxTickets = await this.getMaxAvailableTicketsPerAccount(serviceId);

    for (const account of accounts) {
      const bookedTickets = await this.getTotalBookedTickets(account.id);

      if (bookedTickets < maxTickets) {
        availableAccounts.push({
          ...account,
          availableTickets: maxTickets - bookedTickets,
        });
      }
    }
    return availableAccounts;
  }

  async getMaxAvailableTicketsPerAccount(serviceId) {
    const service = await BookingServiceModel.findByPk(serviceId);
    return service.max_available_tickets_per_account;
  }

  async getTotalBookedTickets(accountId) {
    const reports = await jobReportsService.getAccountReports(accountId);
    return reports.reduce((acc, report) => acc + report.booked_tickets, 0);
  }
}

module.exports = new AccountsService();
