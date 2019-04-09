const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");

const https = require('https');
const fs = require('fs');

const fetch = require("node-fetch");

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

const app = express();

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

const apiKey = require('./config/conf').apiKey;

// Connect to mongo
connectToUserDatabase();

function connectToUserDatabase() {
    mongoose.connect(db, {useNewUrlParser: true});
    mongoose.connection.once('open',function () {
        console.log('connection has been made');
    }).on('error',function (error) {
        console.log(error)
    });
}

//Browser can access these folders
app.use(express.static('public'));
app.use('/upload-images', express.static('upload-images'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({extended: false}));

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

//____________________PUBG___________________________________


app.get('/playerName/:id', async (req, res) => {
    let playername = req.params.id;
    let url = "https://api.pubg.com/shards/pc-eu/players?filter[playerNames]=" + playername;
    let response = await getRecentMatches(url);
    res.send(response);
});

app.get('/matchBasics/:id', async (req, res) => {
    let matchId = req.params.id;
    let url = "https://api.pubg.com/shards/eu/matches/" + matchId;
    let response = await getMatchBasics(url);
    res.send(response);
});

app.get('/matchDetails/:id', async (req, res) => {
    let matchId = req.params.id;
    let url = "https://api.pubg.com/shards/eu/matches/" + matchId;
    let matchBasics = await getMatchBasics(url);
    let telemetryUrl = await matchBasics.telemetryEventsURL;
    let response = await getTelemetryEvents(telemetryUrl);
    res.send(response);
});

const apiRequestConfig = {
    headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/vnd.api+json'
    }
};

// Gets recent played matches
async function getRecentMatches(url) {
    var recentMatchDetails = {};

    const response = await fetch(url, apiRequestConfig);
    const object = await response.json();

    let recentMatchesArray = await object.data[0].relationships.matches.data;


    for(var i in recentMatchesArray){
        let matchBasicsURL = "https://api.pubg.com/shards/eu/matches/" + recentMatchesArray[i].id;
        recentMatchDetails[i] = {
            matchId: recentMatchesArray[i].id,
            matchDetails: await getMatchBasics(matchBasicsURL)};
    }
    console.log(recentMatchDetails);
    return(recentMatchDetails);
}

// Gets basic information about each match
async function getMatchBasics(url) {

    const response = await fetch(url, apiRequestConfig);
    const object = await response.json();
    let matchBasics = await object.data.attributes;


    //Searches the URLs of telemetry events for each match
    let included = await object.included;
    let asset = {};

    for (var i in included){
        if (included[i].type === 'asset'){
            asset = included[i];
        }
    }
    matchBasics.telemetryEventsURL = asset.attributes.URL;
    return(matchBasics);
}

async function getTelemetryEvents(url) {

    const response = await fetch(url, apiRequestConfig);
    const object = await response.json();

    return(object);

}

const PORT = process.env.PORT ||  3000;
https.createServer(options, app).listen(PORT);



