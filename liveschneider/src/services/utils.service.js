const bcrypt = require('bcrypt');

const HASH_SALT = 10;

class UtilsService {
  async hashString(value) {
    return await bcrypt.hash(value, HASH_SALT);
  }

  clamp = (num, min, max) => Math.min(Math.max(num, min), max);
}

module.exports = new UtilsService();
