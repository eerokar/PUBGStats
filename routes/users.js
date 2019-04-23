const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Edit Profile Page
router.get('/editProfile/:originalname/:originalpubgname', (req, res) => res.render('editProfile', {
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
                errors.push({msg: 'That name is already registered'})
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
router.post('/editProfile/:originalname/:originalpubgname', (req, res) => {
    let name = req.params.originalname;
    let originalPubgName = req.params.originalpubgname;
    const {pubgname: pubgname} = req.body;
    let userToUpdate = User.findOne({name: name});


            userToUpdate.findOneAndUpdate({pubgname: originalPubgName}, {pubgname: pubgname})
                .then(function () {
                    res.redirect('/dashboard');
                })
                .catch(err => console.log('Vituiks män: ' + err));
});

router.post('/saveFav', (req,res,next) =>{
    //console.log(req.body.userName);
    let name = req.body.userName;
    let match = req.body.match;
    let userToUpdate = User.findOne({name: name});

    //User.update({ name: name },{$push: {favouriteMatches: match}})
    userToUpdate.update({$push: {favouriteMatches: match}})
        .then(function () {

            req.flash('success_msg', 'This match was added to favourites');
        })
        .catch(err => console.log('Vituiks män: ' + err));

    console.log(userToUpdate.find({}));
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

//Liikaa html (Korjaa) (AJAX)

module.exports = router;