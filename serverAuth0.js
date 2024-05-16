require('dotenv').config();
const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// Configure Express to use EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Auth0 Configuration
const auth0Strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    }
);

passport.use(auth0Strategy);

// Serialize user into the sessions
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from the sessions
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), (req, res) => {
    res.redirect('/');
});

app.get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
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
