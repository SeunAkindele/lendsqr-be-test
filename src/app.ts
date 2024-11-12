import express, { Application } from 'express';
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
require('./knexfile');
import router from './routes';
const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());

app.use('/api', router)

export default app;
