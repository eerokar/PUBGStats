require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const bodyParser = require('body-parser');

const app = express();
// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to mongo
connectToUserDatabase();

function connectToUserDatabase() {
    mongoose.connect(db, { useNewUrlParser: true }).then(() => {
        console.log('Connected successfully.');
        app.listen(process.env.APP_PORT);
    }, err => {
        console.log('Connection to db failed: ' + err);
    });
}

//Browser can access these folders
app.use(express.static('public'));
app.use('/views', express.static('views'));
app.use('/image-assets', express.static('image-assets'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Globasl Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/matches', require('./routes/matches'));