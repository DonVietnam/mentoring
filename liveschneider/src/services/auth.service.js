const bcrypt = require('bcrypt');
const UserModel = require('../database/models/user.model');

class AuthService {
  async validateUser(email, password) {
    const user = await UserModel.findOne({ where: { email } });
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    return '';
  }
}

module.exports = new AuthService();
