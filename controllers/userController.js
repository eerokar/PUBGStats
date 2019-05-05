'use strict';
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {

    //Methdod for registering new user
    register: (name, pubgname, password, password2) => {
        return new Promise(function(resolve, reject) {
            let errors = [];
            //Check required fields
            if (!name || !pubgname || !password || !password2) {
                errors.push({msg: 'please fill in all fields'})
            }
            //Check passwords match
            if (password !== password2) {
                errors.push({msg: 'Passwords do not match'})
            }
            //Check pass length
            if (password.length < 6) {
                errors.push({msg: 'Password should be at least 6 characters'})
            }
            if (errors.length > 0) {
                resolve ([false, errors]);
            } else {
                // Validation passed
                User.findOne({name: name})
                    .then(user => {
                        if (user) {
                            // User exists
                            errors.push({msg: 'That name is already registered'});
                            resolve ([false, errors]);
                        } else {
                            const newUser = new User({
                                name: name,
                                pubgname: pubgname,
                                password
                            });
                            // Hash password
                            bcrypt.genSalt(10, (err, salt) =>
                                bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) throw err;

                                    // Set password to hashed
                                    newUser.password = hash;
                                    //Save user
                                    newUser.save()
                                        .then(user => {
                                            resolve ([true, 'success']);
                                        })
                                        .catch(err => console.log(err));
                                }));
                        }
                    });
            }
        });
    },

    //Methdod for editing profile
    editProfile: (name, originalPubgName, pubgname) => {
        let userToUpdate = User.findOne({name: name});
        userToUpdate.findOneAndUpdate({pubgname: originalPubgName}, {pubgname: pubgname})
            .catch(err => console.log('Error: ' + err));
    },
};