const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

//Controllers
const favouritesController = require('../controllers/favouritesController');
const userController = require('../controllers/userController');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Edit Profile Page
router.get('/editProfile/:originalname/:originalpubgname',ensureAuthenticated, (req, res) => res.render('editProfile', {
    name: req.user.name,
    pubgname: req.user.pubgname
}));

// Register Handle
router.post('/register', async (req, res) => {
    const {name: name, pubgname: pubgname, password, password2} = req.body;
    var loginResponse = await userController.register(name, pubgname, password, password2);
    if (loginResponse[0] === false) {
        let errors = loginResponse[1];
        res.render('register', {
            errors,
            name: name,
            pubgname: pubgname,
            password,
            password2
        });
    } else {
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
    }
});

// Edit Profile Handle
router.post('/editProfile/:originalname/:originalpubgname',ensureAuthenticated, (req, res) => {
    let name = req.params.originalname;
    let originalPubgName = req.params.originalpubgname;
    const {pubgname: pubgname} = req.body;
    userController.editProfile(name, originalPubgName, pubgname);
    res.redirect('/dashboard');
});

// Save Favourite Match Handle
router.post('/saveFav',ensureAuthenticated, (req,res) =>{
    let name = req.body.userName;
    let matchId = req.body.matchId;
    let match =  req.body.match;
    favouritesController.saveFavourite(name, matchId, match);
    res.redirect('back');
});

// Remove Favourite Matches Handle
router.post('/removeFav',ensureAuthenticated,(req,res) =>{
    let name = req.body.userName;
    let matchId = req.body.matchId;
    favouritesController.removeFavourite(name, matchId);
    res.redirect('back');
});

// Check if favourite exists
router.get('/checkIfExists/:userName/:id',ensureAuthenticated, async (req,res) =>{
    let name = req.params.userName;
    let matchId = req.params.id;
    let returnValue = await favouritesController.checkIfFavouriteExists(name, matchId);
    res.send(returnValue);
});

// Show Favourite Matches Handle
router.get('/showFavs/:originalname/:pubgname',ensureAuthenticated, async (req,res) =>{
    let name = req.params.originalname;
    let pubgname = req.params.pubgname;
    let matches = await favouritesController.showFavourites(name);
    let matchIdsJson = JSON.stringify(matches);

        res.render('favourites', {
            matchIds: matchIdsJson,
            name: name,
            pubgname: pubgname});
});

// Login handle
router.post('/login', (req,res,next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

// Logout handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;