const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Lendsqr wallet service")
})

app.listen('7587', () => {
    console.log('Server is listening on port 7587')
})