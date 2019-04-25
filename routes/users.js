const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

// User model
const User = require('../models/User');

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
router.post('/register', (req, res) => {
    const {name: name, pubgname: pubgname, password, password2} = req.body;
    let errors = [];

    //Check required fields
    if(!name || !pubgname || !password || !password2){
        errors.push({msg: 'please fill in all fields'})
    }

    //Check passwords match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'})

    }

    //Check pass length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'})

    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name: name,
            pubgname: pubgname,
            password,
            password2
        });
    }else{
       // Validation passed

        User.findOne({name: name})
            .then(user => {
            if(user){
                // User exists
                errors.push({msg: 'That name is already registered'});
                res.render('register', {
                    errors,
                    name: name,
                    pubgname: pubgname,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name: name,
                    pubgname: pubgname,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        // Set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }));
            }
        });
    }
});

// Edit Profile Handle
router.post('/editProfile/:originalname/:originalpubgname',ensureAuthenticated, (req, res) => {
    let name = req.params.originalname;
    let originalPubgName = req.params.originalpubgname;
    const {pubgname: pubgname} = req.body;
    let userToUpdate = User.findOne({name: name});

    userToUpdate.findOneAndUpdate({pubgname: originalPubgName}, {pubgname: pubgname})
        .then(function () {
            res.redirect('/dashboard');
        })
        .catch(err => console.log('Error: ' + err));
});

// Save Favourite Match Handle
router.post('/saveFav',ensureAuthenticated, (req,res) =>{
    let name = req.body.userName;
    let matchObject = {
        matchId: req.body.matchId,
        match: req.body.match
    };
    let userToUpdate = User.findOne({name: name});

    //Check if match is already in favourites
    userToUpdate.find( { "favouriteMatches.matchId": { $in: [ req.body.matchId ] } } )
        .then(user => {
        if(user.length === 0) {
            //If it is not:
            User.updateOne({name: name}, {$push: {favouriteMatches: matchObject}})
                .then(function () {
                    req.flash('success_msg', 'This match was added to favourites');
                    res.redirect('back');
                })
                .catch(err => console.log('Error: ' + err));

        }else{
            //If it is:
            req.flash('error_msg', 'This match is already in your favourites');
            res.redirect('back');
        }
    });
});

// Remove Favourite Matches Handle
router.post('/removeFav',ensureAuthenticated,(req,res) =>{
    let name = req.body.userName;
    let matchId = req.body.matchId;
    let userToUpdate = User.findOne({name: name});

    //Check if match exists
    userToUpdate.find( { "favouriteMatches.matchId": { $in: [ req.body.matchId ] } } )
        .then(user => {
            if(user.length === 0) {
                //If it does not:
                req.flash('error_msg', 'This match is not in your favourites');
                res.redirect('back');
            }else{
                //If it does:
                User.updateOne({name: name},
                    {$pull: {favouriteMatches: {matchId: matchId}}})
                    .then(function () {
                        req.flash('success_msg', 'This match was deleted from favourites');
                        res.redirect('back');
                    })
                    .catch(err => console.log('Error: ' + err));
            }
        });
});

// Show Favourite Matches Handle
router.get('/showFavs/:originalname/:pubgname',ensureAuthenticated, (req,res,next) =>{
    let name = req.params.originalname;
    let pubgname = req.params.pubgname;
    let userToGetMatchesFrom = User.findOne({name: name});
    let favouriteMatches = [];

        userToGetMatchesFrom.findOne( { },{favouriteMatches}, function(err, item) {
            let matchIds = [];
            for(var i in item.favouriteMatches){
                if(item.favouriteMatches[i].matchId !== undefined) {
                    matchIds.push(item.favouriteMatches[i].matchId);
                }
            }
            let matchIdsJson = JSON.stringify(matchIds.reverse());
            res.render('favourites', {
                matchIds: matchIdsJson,
                name: name,
                pubgname: pubgname});
    });
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