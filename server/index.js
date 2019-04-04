const express = require('express');
require('dotenv').config();
const massive = require('massive');
const session = require('express-session');

const AuthController = require('./controllers/Auth');

const app = express();
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
    console.log('db conectado');
});

app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}));

app.post('/auth/register', AuthController.register)
app.post('/auth/login', AuthController.login)
app.get('/auth/logout', AuthController.logout)

app.listen(SERVER_PORT, () => {
    console.log(`server is going on: ${SERVER_PORT}`);
});