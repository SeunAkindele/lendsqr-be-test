import express, { Application } from 'express';
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
require('./knexfile');
const routes = require('./routes');
import userController from './user/controller/user.controller';
const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());

app.use('/api/users', userController);

export default app;
