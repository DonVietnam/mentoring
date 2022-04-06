require('dotenv').config({ path: `.${process.env.NODE_ENV}.env` });
const express = require('express');
const sequelize = require('./services/database.service');
const adminJs = require('./services/adminjs.service');

const adminRouter = require('./routers/admin.router');

const app = express();

app.use(adminJs.options.rootPath, adminRouter);

async function bootstrap() {
  await connectDatabase();
  createServer();
}

async function connectDatabase() {
  await sequelize.authenticate();
  await sequelize.sync();
}

function createServer() {
  const { APP_PORT } = process.env;
  app.listen(APP_PORT, () => console.log(`server has been started, port:${APP_PORT}`));
}

bootstrap();
