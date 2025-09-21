const express = require('express');
const app = express();
const routes = require('./routes/routes');
const pool = require('./models/database');
const bodyParser = require('body-parser');
const cors = require('cors');



//Middleware

app.use(cors());

app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});

app.use(bodyParser.json());

//Routes

app.use('/', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Web server is running on port ' + (`http://localhost:${process.env.PORT || 3000}`));
});