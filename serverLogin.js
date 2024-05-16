const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
var flash = require('connect-flash');
const app = express();

// Configure Express
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")
app.use(flash());

// Mock user database
const users = [
    { id: 1, username: 'user', password: 'password' }
];


// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {

    res.render('login', { message: '' });
});

app.post('/login', (req, res) => {

    const user = users.find(u => u.username === req.body.username && u.password === req.body.password);
    if (user) {
        res.render('profile', { user: user })
    }
    else {
        res.render('login', { message: 'error: user not found' })
    }
});

app.get('/profile', (req, res) => {
    res.render('profile', { user: req.user });
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
