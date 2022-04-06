const JobReportModel = require('../database/models/job-report.model');

class JobReportService {
  async writeReport(accountId, jobId, report) {
    await JobReportModel.create({
      jobId,
      accountId,
      day: new Date(report.day),
      available_tickets: report.availableTickets,
      booked_tickets: report.bookedTickets,
    });
  }

  async getAccountReports(accountId) {
    return await JobReportModel.findAll({
      where: { account_id: accountId },
    });
  }

  async getJobReports(jobId) {
    return await JobReportModel.findAll({
      where: { job_id: jobId },
    });
  }
}

module.exports = new JobReportService();
