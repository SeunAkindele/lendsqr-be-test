import express, { Application, Request, Response, NextFunction } from 'express';
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
require('./knexfile');
import router from './routes';
const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());

// Root route to respond to GET requests at the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the MVP wallet service');
});

app.use('/api', router);

// Middleware to handle invalid routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handling middleware for other errors (optional)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

export default app;
