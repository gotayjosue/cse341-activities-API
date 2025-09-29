const express = require('express');
const env = require('dotenv').config()
const app = express();
const routes = require('./routes/routes');
const pool = require('./models/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')
const session = require('express-session')
const GitHubStrategy = require('passport-github2').Strategy

//Middleware

app.use(session({
    secret: 'MySessioSecret',
    resave: false,
    saveUninitialized: true,
}))

app.use(passport.initialize())

app.use(passport.session())

passport.use(new GitHubStrategy(
    {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
    return done(null, profile)
}
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/',(req, res) => {res.send(req.session.user !== undefined? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: 'api-docs', session: false}),
    (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
    });

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