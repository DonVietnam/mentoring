const accountsService = require('./accounts.service');
const jobReportService = require('./job-report.service');
const utilsService = require('./utils.service');
const loggerService = require('./logger.service');
const nationalArchivesWorker = require('../workers/national-archives.worker');

class WorkerService {
  worker_template = new Map([
    ['National Archives', nationalArchivesWorker],
  ]);

  async runWorkers(jobs) {
    for (const job of jobs) {
      Promise.resolve().then(async () => {
        await this.setJobStatus(job, 'in progress');
        await this.runWorker(job);
      }).then(async () => {
        await this.setJobStatus(job, 'done');
      }).catch(async (error) => {
        await loggerService.logError(error.message);
        await this.setJobStatus(job, 'failed');
      });
    }
  }

  async runWorker(job) {
    const bookTickets = this.worker_template.get(job.booking_service.name);
    const workingDays = this.getJobWorkingDays(job);

    for (const day of workingDays) {
      while (!await this.isJobDone(job, day)) {
        const dayLocal = day.toLocaleDateString('en-US');
        const account = await this.getAvailableAccount(job.booking_service.id);
        const { email, password } = account;
        const { startTime, endTime } = this.getJobTimeInterval(job);
        const tickets = await this.getTicketsToBooking(job, day, account);

        const report = await bookTickets(email, password, dayLocal, startTime, endTime, tickets);

        if (report) {
          await jobReportService.writeReport(account.id, job.id, report);
        }
      }
    }
  }

  async isJobDone(job, day) {
    const totalBookedTickets = await this.getTotalBookedTickets(job, day);
    // TODO: add second condition
    return totalBookedTickets >= job.tickets_per_day;
  }

  async getTicketsToBooking(job, day, account) {
    const bookedTickets = await this.getTotalBookedTickets(job, day);
    return utilsService.clamp(job.tickets_per_day - bookedTickets, 0, account.availableTickets);
  }

  async getTotalBookedTickets(job, day) {
    const reports = await jobReportService.getJobReports(job.id);
    return reports.filter((x) => Date.parse(x.day) === Date.parse(day))
      .reduce((acc, curr) => acc + curr.booked_tickets, 0);
  }

  async setJobStatus(job, status) {
    await job.update({ status });
    await job.save();
  }

  async getAvailableAccount(serviceId) {
    const [account] = await accountsService.getAvailableAccounts(serviceId);

    if (!account) {
      throw new Error('no available account to process job');
    }
    return account;
  }

  getJobWorkingDays(job) {
    const { currentDay, endDay } = this.getJobExtremeDays(job);
    const days = [];
    do {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    } while (currentDay <= endDay);
    return days;
  }

  getJobExtremeDays(job) {
    return {
      currentDay: new Date(job.start_date),
      endDay: new Date(job.end_date),
    };
  }

  getJobTimeInterval(job) {
    return {
      startTime: job.start_time,
      endTime: job.end_time,
    };
  }
}

module.exports = new WorkerService();
