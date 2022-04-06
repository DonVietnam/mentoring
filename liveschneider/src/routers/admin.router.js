require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });
const AdminJSExpress = require('@adminjs/express');
const adminJs = require('../services/adminjs.service');
const authService = require('../services/auth.service');

module.exports = AdminJSExpress.buildRouter(adminJs);

/* module.exports = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: authService.validateUser,
  cookiePassword: process.env.ADMINJS_SESSION_SECRET,
}); */
