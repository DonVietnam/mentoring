const utilsService = require('../../services/utils.service');

class UserAction {
  async beforeNewUser(req) {
    try {
      if (req.payload.password_origin) {
        req.payload = {
          ...req.payload,
          password_origin: req.payload.password,
          password: await utilsService.hashString(req.payload.password_origin),
        };
      }
    } catch (error) {
      console.log(error);
    }
    return req;
  }

  async beforeEditUser(req) {
    try {
      if (req.payload.password_origin) {
        req.payload = {
          ...req.payload,
          password: await utilsService.hashString(req.payload.password_origin),
        };
      }
    } catch (error) {
      console.log(error);
    }
    return req;
  }
}

module.exports = new UserAction();
