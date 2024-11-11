const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./knexfile');

const UserController = require('./user/controller/user.controller');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// const user = new UserController();

app.get('/', (req, res) => {
  res.send("mvp wallet service")
});

// app.post('/users', (req, res) => user.create(req, res));

// fauxTokenMiddleware Guard for all protected routes
app.use((req, res, next) => {
    const token = req.headers['authorization'];
  
    if (token && token === `Bearer ${process.env.FAUX_TOKEN}`) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});
