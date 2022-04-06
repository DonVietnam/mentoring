const LogModel = require('../database/models/log.model');

class LoggerService {
  async logInfo(message) {
    await this.log(message, 'info');
  }

  async logError(message) {
    await this.log(message, 'error');
  }

  async log(message, type) {
    await LogModel.create({
      message,
      type,
    });
    console.log(message);
  }
}

module.exports = new LoggerService();
