const BookingServiceModel = require('../../database/models/booking-service.model');
const JobModel = require('../../database/models/job.model');

const workerService = require('../../services/worker.service');

class JobAction {
  async afterEditJob(req) {
    try {
      if (req.notice) {
        const { notice } = req;
        if (notice.type === 'success') {
          const jobs = await JobModel.findAll({
            where: { status: 'start' },
            include: BookingServiceModel,
          });

          await workerService.runWorkers(jobs);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return req;
  }
}

module.exports = new JobAction();
