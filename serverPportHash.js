require('dotenv').config();
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');

const users = []; // In-memory user storage for simplicity, replace with DB in production

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport Local Strategy
passport.use(new LocalStrategy(
    function(username, password, done) {
        const user = users.find(u => u.username === username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, function(err, res) {
            if (res) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    const user = users.find(u => u.username === username);
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.redirect('/login');
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
